//-*-c++-*-
#ifndef _TLPSTLFUNCTIONS_H
#define _TLPSTLFUNCTIONS_H

class DoubleProperty;
class node;
class edge;
/**
   This class enables to compare nodes and edges according to a metric,
   instances of this class are useful for using stl sort function.
 */
class LessByMetric {
 public:
  LessByMetric(DoubleProperty *metric):metric(metric){}
  bool operator() (node n1,node n2);
  bool operator() (edge e1,edge e2);
private:
  DoubleProperty *metric;
};

#endif
