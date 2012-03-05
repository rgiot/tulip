/**
 *
 * This file is part of Tulip (www.tulip-software.org)
 *
 * Authors: David Auber and the Tulip development Team
 * from LaBRI, University of Bordeaux 1 and Inria Bordeaux - Sud Ouest
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

#ifndef METHODFACTORY_H
#define METHODFACTORY_H

#include <string>

#include <tulip/Plugin.h>
#include <tulip/PluginLister.h>
#include <tulip/TulipRelease.h>
#include <tulip/PluginContext.h>
#include <tulip/PropertyAlgorithm.h>
// #include <tulip/Algorithm.h>
// #include <tulip/ImportModule.h>
// #include <tulip/ExportModule.h>

/** \addtogroup plugins */
/*@{*/

#define PLUGININFORMATIONSWITHGROUP(NAME, AUTHOR, DATE, INFO, RELEASE, GROUP)\
std::string name() const { return std::string(NAME); } \
std::string author() const { return std::string(AUTHOR); }\
std::string date() const { return std::string(DATE); }  \
std::string info() const { return std::string(INFO); }  \
std::string release() const { return std::string(RELEASE); }\
std::string tulipRelease() const { return std::string(TULIP_RELEASE); }\
std::string group() const { return std::string(GROUP); }

#define PLUGIN(C) \
class C##Factory : public tlp::FactoryInterface { \
public:            \
  C##Factory() {          \
    tlp::PluginLister::registerPlugin(this);     \
  }             \
  ~C##Factory(){}          \
  tlp::Plugin* createPluginObject(tlp::PluginContext* context) { \
    C* tmp = new C(context);       \
    return tmp;       \
  }              \
};                                                      \
\
extern "C" {                                            \
  C##Factory C##FactoryInitializer;               \
}

/*@}*/
#endif
