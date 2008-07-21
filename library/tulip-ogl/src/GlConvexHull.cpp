#include <tulip/ConvexHull.h>
#include <tulip/ForEach.h>
#include <tulip/DoubleProperty.h>
#include <tulip/LayoutProperty.h>
#include <tulip/SizeProperty.h>
#include <GL/gl.h>
#include <tulip/GlTools.h>
#include "tulip/GlConvexHull.h"

using namespace std;

namespace tlp {

  GlConvexHull::GlConvexHull(const vector<Coord> &points, 
			     const vector<Color> &fcolors,
			     const vector<Color> &ocolors,
			     const bool filled,
			     const bool outlined,
			     const string &name,
			     const bool computeHull):
    
    _points(points),
    _fillColors(fcolors),
    _outlineColors(ocolors),
    _filled(filled),
    _outlined(outlined),
    _name(name){

  assert(points.size() >= 3);
  if (computeHull) {
    vector<unsigned int> convexHullIdxs;

    convexHull(_points, convexHullIdxs);
    // build new points
    vector<Coord> points;
    vector<unsigned int>::const_iterator it = convexHullIdxs.begin();

    for (;it != convexHullIdxs.end(); ++it) {
      points.push_back(_points[*it]);
      boundingBox.check(_points[*it]);
    }
    _points = points;
  }
}

void GlConvexHull::draw(float lod,Camera *camera) {
  glEnable(GL_BLEND);
  if (_filled){
    if (_points.size() == 3)
      glBegin(GL_TRIANGLES);
    else 
      if (_points.size() == 4)
	glBegin(GL_QUADS);
      else
	glBegin(GL_POLYGON);

    for(unsigned int i=0; i < _points.size(); ++i) {
      if (i < _fillColors.size()) {
	setMaterial(_fillColors[i]);
	glColor4ubv((unsigned char *)&_fillColors[i]);
      }
      //_points[i][2] = 0;
      glVertex3fv((float *)&_points[i]);
    }
    glEnd();
  }
    
  if (_outlined) {
    glBegin(GL_LINE_LOOP);
    for(unsigned int i=0; i < _points.size(); ++i) {
      if (i < _outlineColors.size()) {
	glColor4ubv((unsigned char *)&_outlineColors[i]);
      }
      //_points[i][2] = 0;
      glVertex3fv((float *)&_points[i]);
    }
    glEnd();
  }
    
  glTest(__PRETTY_FUNCTION__);
}

#define V_INC 30
static Color darkerColor(Color c) {
  Color dc;
  unsigned char v = c.getR();
  dc.setR((v > V_INC) ? (v - V_INC) : v);
  v = c.getG();
  dc.setG((v > V_INC) ? (v - V_INC) : v);
  v = c.getB();
  dc.setB((v > V_INC) ? (v - V_INC) : v);
  v = c.getA();
  dc.setA((v < (255 - V_INC)) ? (v + V_INC) : v);
  return dc;
}

ConvexHullItem* GlConvexHull::buildConvexHullsFromHierarchy(Graph *graph,
							   std::vector<Color> fColors,
							   std::vector<Color> oColors,
							   bool deducedFromChilds,
							   Graph *root,
							   unsigned int depth) {
  //vector<GlConvexHull *> convexHulls;
  Graph *sg;
  //vector<GlConvexHull *> sgConvexHulls;
  ConvexHullItem *convexHullItem=new ConvexHullItem;

  graph->getAttributes().get("name",convexHullItem->name);

  if (root == 0)
    root = graph;

  if (fColors.size() == 0) {
    // use default colors
    fColors.push_back(Color(255, 148, 169, 200));
    fColors.push_back(Color(153, 250, 255, 200));
    fColors.push_back(Color(255, 152, 248, 200));
    fColors.push_back(Color(157, 152, 255, 200));
    fColors.push_back(Color(255, 220, 0, 200));
    fColors.push_back(Color(252, 255, 158, 200));
  }
  if (oColors.size() == 0) {
    // use default color
    oColors.push_back(Color(100, 100, 100, 120));
  }

  

  // build convex hulls from subgraphs
  forEach(sg, graph->getSubGraphs()) {
    ////
    //if(sg->numberOfNodes() <= 1) continue;

    ////
    ConvexHullItem *child=
      buildConvexHullsFromHierarchy(sg, fColors, oColors,
				    deducedFromChilds, root, depth + 1);
    ///vector<GlConvexHull *>::const_iterator it = sgAllConvexHulls.begin();

    // first one (if any) is the direct subgraph convex hull
    // (others are for subgraphs of this subgraph)
    // and it will be used if needed to find this graph convex hull
    /*if (deducedFromChilds) {
      if (it != sgAllConvexHulls.end())
	sgConvexHulls.push_back(*it);
	}*/
    // add all
    convexHullItem->children.push_back(child);
    /*for (;it != sgAllConvexHulls.end(); it++) {
      convexHulls.push_back(*it);
      }*/
    
  }

  // filled and outline colors determination
  Color fColor = fColors[depth%fColors.size()];
  Color oColor = oColors[depth%oColors.size()];
  unsigned int i = depth/fColors.size();
  while(i > 0) {
    fColor = darkerColor(fColor);
    i--;
  }
  i = depth/oColors.size();
  while(i > 0) {
    oColor = darkerColor(oColor);
    i--;
  }
  // build args to create a GlConvexHull for this graph
  // vectors of Color
  vector<Color> filledColors;
  vector<Color> outColors;
  filledColors.push_back(fColor);
  outColors.push_back(oColor);

  if (depth) {
    // compute this graph convex hull
    vector<Coord> gConvexHull;

    /*if (sgConvexHulls.size() > 0) {
      vector<GlConvexHull *>::const_iterator it = sgConvexHulls.begin();

      // initialize convex hull with the first one
      gConvexHull = (*it)->_points;

      // merge loop
      for (++it; it != sgConvexHulls.end(); it++) {

	// add points from current sg convex hull
	// to computed graph convex hull
	vector<Coord>::const_iterator itCoord = (*it)->_points.begin();

	for (; itCoord != (*it)->_points.end(); itCoord++)
	  gConvexHull.push_back(*itCoord);	

	vector<unsigned int> gConvexHullIdxs;
	// compute convex hull with new set of points
	convexHull(gConvexHull, gConvexHullIdxs);

	// build new points
	vector<Coord> points;
	vector<unsigned int>::const_iterator it = gConvexHullIdxs.begin();

	for (;it != gConvexHullIdxs.end(); ++it) {
	  points.push_back(gConvexHull[*it]);
	}
	gConvexHull = points;
      }
      // add a GlConvexHull for this graph in front of gConvexHulls
      convexHulls.insert(convexHulls.begin(), 1,
			 new GlConvexHull(gConvexHull, filledColors, outColors, true, true,graph->getAttribute<string>("name"),
			                  // convex hull is already computed
					  false));
    } else {*/
      // no subgraphs
      // the convex hull will be build directly with the graph nodes and edges
      // if there is some
      if (graph->numberOfNodes()) {
	LayoutProperty *layout = root->getProperty<LayoutProperty>("viewLayout");
	SizeProperty *size = root->getProperty<SizeProperty>("viewSize");
	DoubleProperty *rot = root->getProperty<DoubleProperty>("viewRotation");
	node n;
	// the variable below will be used to compute
	// the box around the bends of edges
	float bendsl = FLT_MAX;
	forEach(n, graph->getNodes()) {
	  // get node coordinates
	  Coord point = layout->getNodeValue(n);
	  // get size of bounding box
	  Size box = size->getNodeValue(n);
	  // get box rotation in degree
	  double alpha = rot->getNodeValue(n);
	  // convert in radian
	  alpha = M_PI * alpha / 180.0;
	  // get half height of bounding box
	  float hh = box.getH() / 2.0;
	  // get half width of bounding box
	  float hw = box.getW() / 2.0;
	  // add 10%
	  float hl;
	  if (hh/10. < hw/10.)
	    hl = hh/10.;
	  else
	    hl = hw/10.;
	  
	  hh += hl;
	  hw += hl;
	  if (bendsl > hl)
	    bendsl = hl;
	  // add points of rotated bounding box
	  float cosA = cos(alpha);
	  float sinA = sin(alpha);
	  Coord vect;
	  vect.setX(-hw * cosA + hh * sinA);
	  vect.setY(-hw * sinA - hh * cosA);
	  gConvexHull.push_back(point + vect);
	  vect.setX(-hw * cosA - hh * sinA);
	  vect.setY(-hw * sinA + hh * cosA);
	  gConvexHull.push_back(point + vect);
	  vect.setX(hw * cosA - hh * sinA);
	  vect.setY(hw * sinA + hh * cosA);
	  gConvexHull.push_back(point + vect);
	  vect.setX(hw * cosA + hh * sinA);
	  vect.setY(hw * sinA - hh * cosA);
	  gConvexHull.push_back(point + vect);
	}
	// add bends of edges
	edge e;
	forEach(e, graph->getEdges()) {
	  // get bends of the edge
	  std::vector<Coord> bends = layout->getEdgeValue(e);
	  unsigned int nbBends = bends.size();
	  for (unsigned int i = 0; i < nbBends; i++) {
	    Coord point(bends[i]);
	    double x = point.getX(), y = point.getY();
	    point.setX(x - bendsl);
	    point.setY(y - bendsl);
	    gConvexHull.push_back(point);
	    point.setY(y + bendsl);
	    gConvexHull.push_back(point);
	    point.setX(x + bendsl);
	    gConvexHull.push_back(point);
	    point.setY(y - bendsl);
	    gConvexHull.push_back(point);
	  }
	}
	// add a GlConvexHull for this graph in front of convexHulls
	convexHullItem->hull=new GlConvexHull(gConvexHull, filledColors, outColors, true, true, graph->getAttribute<string>("name"));
      }
      //}
  }
			 
  return convexHullItem;
}
  //====================================================
  void GlConvexHull::translate(const Coord& mouvement){
    boundingBox.first+=mouvement;
    boundingBox.second+=mouvement;

    for(vector<Coord>::iterator it=_points.begin();it!=_points.end();++it){
      (*it)+=mouvement;
    }
  }
  //====================================================
  void GlConvexHull::getXML(xmlNodePtr rootNode){
    xmlNodePtr dataNode= NULL;

    GlXMLTools::createProperty(rootNode, "type", "GlConvexHull");

    GlXMLTools::createDataNode(rootNode, dataNode);

    GlXMLTools::getXML(dataNode, "points", _points);
    GlXMLTools::getXML(dataNode, "fillColors", _fillColors);
    GlXMLTools::getXML(dataNode, "outlineColor", _outlineColors);
    GlXMLTools::getXML(dataNode, "filled", _filled);
    GlXMLTools::getXML(dataNode, "outlined", _outlined);
  }
   //====================================================
  void GlConvexHull::setWithXML(xmlNodePtr rootNode){
    xmlNodePtr dataNode= NULL;

    GlXMLTools::getDataNode(rootNode, dataNode);

    if(dataNode) {
      GlXMLTools::setWithXML(dataNode, "points",_points);
      GlXMLTools::setWithXML(dataNode, "fillColors", _fillColors);
      GlXMLTools::setWithXML(dataNode, "outlineColor", _outlineColors);
      GlXMLTools::setWithXML(dataNode, "filled", _filled);
      GlXMLTools::setWithXML(dataNode, "outlined", _outlined);
    }
  }
  
}


