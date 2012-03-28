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
#include <sys/stat.h>
#include <sys/types.h>
#include <errno.h>
#include <fstream>
#include <sstream>
#include <cmath>
#include <tulip/TulipPlugin.h>
#include <vector>
#include <string.h>

using namespace std;
using namespace tlp;

enum ValType { TLP_DOUBLE = 0, TLP_STRING = 1, TLP_NOVAL = 2, TLP_NOTHING = 3, TLP_AND = 4 };
namespace {
const char * paramHelp[] = {
  // filename
  HTML_HELP_OPEN()            \
  HTML_HELP_DEF( "type", "pathname" )       \
  HTML_HELP_BODY()                  \
  "This parameter defines the file pathname to import."       \
  HTML_HELP_CLOSE(),
};
}

/** \addtogroup import */
/*@{*/
/** This plugin enables to import a graph coded with a matrix
 *
 *  File format:
 *
 *  The input format of this plugin is an ascii file where each
 *  line represents a row of the matrix.
 *  In each row, cells must be separated by a space.
 *
 *  Let M(i,j) be a cell of the matrix :
 *       - if i==j we define the value of a node.
 *       - if i!=j  we define a directed edge between node[i] and node[j]
 *
 *  If M(i,j) is real value (0, .0, -1, -1.0), it is stored in the
 *  viewMetric property of the graph. <br>
 *  If M(i,j) is a string, it is stored in the
 *  viewLabel property of the graph. <br>
 *  Use & to set the viewMetric and viewLabel properties of a node or edge in the same time.
 *  If M(i,j) == @ an edge will be created without value <br>
 *  If M(i,j) == # no edge will be created between node[i] and node[j]
 *
 *  EXEMPLE 1 :
 *  <br>A
 *  <br># B
 *  <br># # C
 *  <br>Define  a graph with 3 nodes (with labels A B C) and without edge.
 *
 *  EXEMPLE 2 :
 *  <br>A
 *  <br>@ B
 *  <br>@ @ C
 *  <br>Define a simple complete graph with 3 nodes (with labels A B C) and no label (or value) on its edges
 *
 *  EXEMPLE 3 :
 *  <br>A # E & 5
 *  <br>@ B
 *  <br># @ C
 *  <br>Define a graph with 3 nodes and 3 edges, the edge between A and C is named E and has the value 5
 *
 */
class AdjacencyMatrixImport:public ImportModule {
public:
  AdjacencyMatrixImport(AlgorithmContext context):ImportModule(context) {
    addParameter<string>("file::name",paramHelp[0]);
  }
  ~AdjacencyMatrixImport() {}
  vector<node> nodes;

  bool formatError(const char* s, int curLine) {
    std::stringstream ess;
    ess <<  "Error parsing '" << s << "' at line :" << curLine;
    pluginProgress->setError(ess.str());
    std::cerr << pluginProgress->getError() << std::endl;
    return false;
  }

  bool importGraph() {
    string name2;

    if (!dataSet->get("file::name", name2))
      return false;

    struct stat infoEntry;
    int result;
#ifdef _WIN32
    result = stat(name2.c_str(), &infoEntry);
#else
    result = lstat(name2.c_str(), &infoEntry);
#endif

    if (result == -1) {
      pluginProgress->setError(strerror(errno));
      return false;
    }

    std::ifstream in(name2.c_str());
    unsigned int curLine = 0;
    DoubleProperty *metric = graph->getProperty<DoubleProperty>("viewMetric");
    StringProperty *stringP = graph->getProperty<StringProperty>("viewLabel");

    std::string line;

    while (!in.eof() && std::getline(in, line)) {
      stringstream lines(line);
      unsigned int curNode = 0;
      edge e;
      bool itemFound = false;
      bool andFound = false;

      curLine++;

      while (lines.good()) {
        string valString;
        ValType type;

        if ( lines >> valString) {
          const char *start= valString.c_str();
          char *res;
          double valDouble = strtod(start, &res);

          if (res!=start) {
            type = TLP_DOUBLE;
            itemFound = true;
          }
          else if (valString == "&") {
            if (!itemFound)
              return formatError(valString.c_str(), curLine);

            type = TLP_AND;
            curNode--;
            andFound = true;
            itemFound = false;
            continue;
          }
          else if (valString == "@") {
            if (andFound)
              return formatError(valString.c_str(), curLine);

            type = TLP_NOVAL;
            itemFound = false;
          }
          else if (valString == "#") {
            if (andFound)
              return formatError(valString.c_str(), curLine);

            type = TLP_NOTHING;
            itemFound = false;
          }
          else {
            type = TLP_STRING;
            itemFound = true;
          }

          if ( curNode >= nodes.size() || curLine >= nodes.size()) {
            nodes.push_back(graph->addNode());
          }

          if (curNode == curLine) {
            switch (type) {
            case TLP_DOUBLE:
              metric->setNodeValue(nodes[curNode],valDouble);
              break;

            case TLP_STRING:
              stringP->setNodeValue(nodes[curNode],valString);
              break;

            default:
              return formatError(valString.c_str(), curLine);
            }
          }
          else {
            switch (type) {
            case TLP_DOUBLE:

              if (!andFound)
                e=graph->addEdge(nodes[curLine],nodes[curNode]);

              metric->setEdgeValue(e,valDouble);
              break;

            case TLP_STRING:

              if (!andFound)
                e=graph->addEdge(nodes[curLine],nodes[curNode]);

              stringP->setEdgeValue(e,valString);
              break;

            case TLP_NOVAL:
              e=graph->addEdge(nodes[curLine],nodes[curNode]);
              break;

            case TLP_NOTHING:
              break;

            default:
              return formatError(valString.c_str(), curLine);
            }
          }

          curNode++;
        }

        andFound = false;
      }

      if (andFound)
        return formatError("&", curLine);
    }

    return true;
  }
};
/*@}*/
IMPORTPLUGINOFGROUP(AdjacencyMatrixImport, "Adjacency Matrix", "Auber David", "05/09/2008","","1.2","File")
