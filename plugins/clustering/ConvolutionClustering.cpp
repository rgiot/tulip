#include <stdio.h>
#include <math.h>
#include <sstream>
#include <qinputdialog.h>
#include <tulip/TlpTools.h>
#include <tulip/Graph.h>
#include <tulip/BooleanProperty.h>
#include <fstream>

#include "ConvolutionClustering.h"
#include "ConvolutionClusteringSetup.h"

CLUSTERINGPLUGIN(ConvolutionClustering,"Convolution","David Auber","14/08/2001","Alpha","0","1");

using namespace std;
//================================================================================
  ConvolutionClustering::ConvolutionClustering(ClusterContext context):Clustering(context) {}
//================================================================================
ConvolutionClustering::~ConvolutionClustering(){}
//================================================================================
//convolution function, build a triangular function center in 0 with a width width and a 
double g(int k,double width,double amplitude) {
  double slope=amplitude/width; 
  if ((k<=-width) || (k>=width)) 
    return 0;
  else {
    if (k<0)
      return ((double)k*slope+amplitude); //partie croissante du signal triangulaire
    else
      return ((double)-k*slope+amplitude); //partie décroissante du signal triangulaire
  }
}
//================================================================================
int getInterval(int d,const vector<int> &ranges) {
  for (unsigned int i=0;i<ranges.size()-1;++i) {
    if ((d>=ranges[i]) && (d<ranges[i+1])) return i;
  }
  return ranges.size()-2;
}
//================================================================================
void ConvolutionClustering::setParameters(int histosize,int threshold,int width) {
  this->histosize=histosize;
  this->threshold=threshold;
  this->width=width;
}
//================================================================================
void ConvolutionClustering::getParameters(int &histosize,int &threshold,int &width) {
  histosize=this->histosize;
  threshold=this->threshold;
  width=this->width;
}
//================================================================================
list<int> ConvolutionClustering::getLocalMinimum() {
  vector<double> &discretHisto = *getHistogram();
  list<int> localMinimum;
  localMinimum.push_back(0);
  bool slopeSens; //false descent
  if (discretHisto[0]>discretHisto[1]) slopeSens=false; else slopeSens=true;
  for (unsigned int i=1;i<discretHisto.size();++i) {
    bool newSlopeSens;
    if (discretHisto[i-1]>discretHisto[i]) newSlopeSens=false; else newSlopeSens=true;
    if (newSlopeSens!=slopeSens) {
      //new Local minimum
      if (slopeSens==false) {
	int local = localMinimum.back();
	if (i-local<width/2){
	  localMinimum.pop_back();
	  localMinimum.push_back((i+local)/2);
	}
	else
	  localMinimum.push_back(i);
      }
      slopeSens=newSlopeSens;
    }
  }
  return localMinimum;
}
//================================================================================
void ConvolutionClustering::autoSetParameter() {

  map<double,int> histo;
  Iterator<node> *itN=graph->getNodes();
  while (itN->hasNext()) {
    node itn=itN->next();
    double tmp = metric->getNodeValue(itn);
    if (histo.find(tmp)==histo.end())
      histo[tmp]=1;
    else 
      histo[tmp]+=1;
  }delete itN;

  if (histo.empty()) return;
  
  //===============================================================================
  //Find good step for discretization
  //We take the minimum interval between to bar in the continue histogram
  double deltaXMin=-1;
  double deltaXMax=0;
  double deltaSum=0;
  map<double,int>::iterator itMap=histo.begin();
  double lastValue=(*itMap).first;
  ++itMap;
  for (;itMap!=histo.end();++itMap) {    
    deltaSum+=itMap->first-lastValue;
    if (itMap->first-lastValue>deltaXMax) deltaXMax=itMap->first-lastValue;
    if (itMap->first-lastValue<deltaXMin ||  deltaXMin<0 ) deltaXMin=itMap->first-lastValue;
    lastValue=(*itMap).first;
  }
  histosize=(int)((metric->getNodeMax()-metric->getNodeMin())/deltaXMin);
  if (histosize > 16384) histosize = 16384; //histosize = histosize <? 16384;
  if (histosize < 64) histosize = 64; //histosize = histosize >? 64;

  //===============================================================================
  //Find good with for the convolution function
  //We take the maximum width of the biggest hole
  //width=(int)(deltaXMax*histosize/(metric->getNodeMax()-metric->getNodeMin()));
  //width=(int)(deltaXMin*histosize/(metric->getNodeMax()-metric->getNodeMin()));
  deltaSum /= histo.size();
  width=(int)(deltaSum*histosize/(metric->getNodeMax()-metric->getNodeMin()));
  //===============================================================================
  //Find good threshold
  //make the average of all local minimum
  vector<double> &discretHisto=*getHistogram();
  list <double> localMinimum;
  double sum=0;
  int nbElement=1;
  bool slopeSens;
  if (discretHisto[0]>discretHisto[1]) slopeSens=false; else slopeSens=true;
  for (unsigned int i=1;i<discretHisto.size();++i) {
    bool newSlopeSens;
    if (discretHisto[i-1]>discretHisto[i]) newSlopeSens=false; else newSlopeSens=true;
    if (newSlopeSens!=slopeSens) {
      //new Local minimum
      localMinimum.push_back(discretHisto[i]);
      nbElement++;
      sum+=(discretHisto[i]+discretHisto[i-1])/ 2;
    }
    slopeSens=newSlopeSens;
  }
  threshold=(int)(sum/nbElement);
}
//================================================================================
vector<double> *ConvolutionClustering::getHistogram() {
  //building of the histogram of values
  histogramOfValues.clear();
  Iterator<node> *itN=graph->getNodes();
  while (itN->hasNext()) {
    node itn=itN->next();
    int tmp=(int)( (metric->getNodeValue(itn) - metric->getNodeMin() ) * (double)histosize / 
		   (metric->getNodeMax() - metric->getNodeMin()));
    if (histogramOfValues.find(tmp) == histogramOfValues.end())
      histogramOfValues[tmp]=1;
    else
      histogramOfValues[tmp]+=1;
  } delete itN;

  //Apply the convolution on the histogram of values
  //Convolution parameter, this version work only with integer
  smoothHistogram.clear();
  smoothHistogram.resize(histosize);
  for (int pos=0; pos<histosize; ++pos) smoothHistogram[pos]=0;
  map<int,int>::iterator itMap;
  for (itMap=histogramOfValues.begin(); itMap!=histogramOfValues.end(); ++itMap) {
    double value=itMap->second;
    int index=itMap->first;
    for (int i=-width;i<=width;++i) {
      if ((index+i)>=0 && (index+i)<histosize)
	smoothHistogram[index+i] += value*g(i,width,1);
    }
  }
  return &smoothHistogram;
}
//================================================================================
void ConvolutionClustering::buildSubGraphs(const vector<int>& ranges){
  //  cerr << __PRETTY_FUNCTION__ << "...." << flush;
  //build the empty graphs 
  char str[100];
  vector<Graph *> newGraphs(ranges.size()-1);
  for (unsigned int i=0; i< ranges.size()-1; ++i) {
    sprintf(str,"Cluster_%05i",i);
    newGraphs[i] = tlp::newSubGraph(graph,string(str));
  }
  
  //Fill the graphs with nodes
  Iterator<node> *itN=graph->getNodes();
  while (itN->hasNext()) {
    node itn=itN->next();
    int tmp = getInterval((int)( (metric->getNodeValue(itn) - metric->getNodeMin() ) * 
				 (double)histosize / (metric->getNodeMax()-metric->getNodeMin()))
			  ,ranges);
    newGraphs[tmp]->addNode(itn);
  } delete itN;
  
  //Fill the graphs with edges
  for (unsigned int i=0; i< ranges.size()-1; ++i) {
    Iterator<edge> *itE=graph->getEdges();
    while (itE->hasNext()) {
      edge ite=itE->next();
      if (newGraphs[i]->isElement(graph->source(ite)) && newGraphs[i]->isElement(graph->target(ite)) ) 
	newGraphs[i]->addEdge(ite);
    } delete itE;
  }
  for (unsigned int i=0; i< ranges.size()-1; ++i) {
    if (newGraphs[i]->numberOfNodes()==0) {
      graph->delSubGraph(newGraphs[i]);
    }
  }
  //  cerr << " end." << endl;
}
//================================================================================
bool ConvolutionClustering::run() {
  histosize=128;
  string tmp1,tmp2;
  metric=graph->getProperty<DoubleProperty>("viewMetric");
  autoSetParameter();
  getHistogram();
  ConvolutionClusteringSetup *mysetup = new ConvolutionClusteringSetup(this);
  bool setupResult = mysetup->exec();
  delete mysetup;
  if (setupResult==QDialog::Rejected) return false;
  vector<int> ranges;
  ranges.push_back(0);
  list<int> localMinimum = getLocalMinimum();
  while (!localMinimum.empty()) {
    ranges.push_back(localMinimum.front());
    localMinimum.pop_front();
  }
  ranges.push_back(histosize);
  //Ensure that there is elements inside each intervals.
  buildSubGraphs(ranges);
  return true;
}
//================================================================================
bool ConvolutionClustering::check(string &erreurMsg) {
  erreurMsg="";
  return true;
}
//================================================================================
void ConvolutionClustering::reset() {
}
//================================================================================




