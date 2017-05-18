/*
 *
 * This file is part of Tulip (www.tulip-software.org)
 *
 * Authors: David Auber and the Tulip development Team
 * from LaBRI, University of Bordeaux
 *
 * Tulip is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Tulip is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */

#ifndef TULIP_SIZES_H
#define TULIP_SIZES_H

#include <tulip/tuliphash.h>
#include <tulip/PropertyTypes.h>
#include <tulip/AbstractProperty.h>
#include <tulip/PropertyAlgorithm.h>

namespace tlp {

class PropertyContext;

typedef AbstractProperty<tlp::SizeType, tlp::SizeType> AbstractSizeProperty;

/**
 * @ingroup Graph
 * @brief A graph property that maps a tlp::Size value to graph elements.
 */
class TLP_SCOPE SizeProperty:public AbstractSizeProperty {

public :
  SizeProperty (Graph *, const std::string& n="");

  Size getMax(const Graph *sg=NULL);
  Size getMin(const Graph *sg=NULL);
  void scale( const tlp::Vector<float,3>&, const Graph *sg=NULL );
  void scale( const tlp::Vector<float,3>&, Iterator<node> *, Iterator<edge> *);

  // redefinition of some PropertyInterface methods
  PropertyInterface* clonePrototype(Graph *, const std::string&) const;
  static const std::string propertyTypename;
  const std::string& getTypename() const {
    return propertyTypename;
  }


  // redefinition of some AbstractProperty methods
  virtual void setNodeValue(const node n, tlp::StoredType<Size>::ReturnedConstValue v);
  virtual void setAllNodeValue(tlp::StoredType<Size>::ReturnedConstValue v);
  virtual void setValueToGraphNodes(tlp::StoredType<Size>::ReturnedConstValue v, const Graph *graph );

  int compare(const node n1, const node n2)const;

  _DEPRECATED virtual void setAllNodeValue( tlp::StoredType<Size>::ReturnedConstValue v, const Graph *graph );

protected:
  void resetMinMax();

private:
  TLP_HASH_MAP<unsigned int, Size> max,min;
  TLP_HASH_MAP<unsigned int, bool> minMaxOk;
  void computeMinMax(const Graph * sg=NULL);
};

/**
 * @ingroup Graph
 * @brief A graph property that maps a std::vector<tlp::Size> value to graph elements.
 */
class TLP_SCOPE SizeVectorProperty:public AbstractVectorProperty<tlp::SizeVectorType, tlp::SizeType> {
public :
  SizeVectorProperty(Graph *g, const std::string& n=""):AbstractVectorProperty<SizeVectorType, SizeType>(g, n) {}

  // redefinition of some PropertyInterface methods
  PropertyInterface* clonePrototype(Graph *, const std::string&) const;
  static const std::string propertyTypename;
  const std::string& getTypename() const {
    return propertyTypename;
  }

};


}
#endif
