/**
 *
 * This file is part of Tulip (http://tulip.labri.fr)
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
#include <tulip/GlGraphRenderer.h>
#include <tulip/GraphProperty.h>
#include <tulip/GlTools.h>
#include <tulip/GlDisplayListManager.h>
#include <tulip/GlLODSceneVisitor.h>
#include <tulip/GlScene.h>
#include <tulip/GlVertexArrayManager.h>
#include <tulip/GlVertexArrayVisitor.h>
#include <tulip/GlBoundingBoxSceneVisitor.h>
#include <tulip/GlNode.h>
#include <tulip/GlEdge.h>
#include <tulip/GlGraphInputData.h>
#include <tulip/GlGraphRenderingParameters.h>

using namespace std;

namespace tlp {

GlGraphRenderer::GlGraphRenderer(const GlGraphInputData *inputData)
    : inputData(inputData), graphModified(true), selectionDrawActivate(false),
      selectionIdMap(nullptr), selectionCurrentId(nullptr) {}

void GlGraphRenderer::visitGraph(GlSceneVisitor *visitor, bool visitHiddenEntities) {
  Graph *graph = inputData->getGraph();

  if (!graph)
    return;

  visitNodes(graph, visitor, visitHiddenEntities);
  visitEdges(graph, visitor, visitHiddenEntities);
}

void GlGraphRenderer::visitNodes(Graph *graph, GlSceneVisitor *visitor, bool visitHiddenEntities) {
  if (inputData->parameters->isDisplayNodes() || inputData->parameters->isViewNodeLabel() ||
      inputData->parameters->isViewMetaLabel() || visitHiddenEntities) {
    visitor->reserveMemoryForNodes(graph->numberOfNodes());
    auto nodes = graph->nodes();
    unsigned int nbNodes = nodes.size();
    for (unsigned int i = 0; i < nbNodes; ++i) {
      GlNode glNode(nodes[i], i);
      visitor->visit(&glNode);
    }
  }
}

void GlGraphRenderer::visitEdges(Graph *graph, GlSceneVisitor *visitor, bool visitHiddenEntities) {
  if (inputData->parameters->isDisplayEdges() || inputData->parameters->isViewEdgeLabel() ||
      inputData->parameters->isViewMetaLabel() || visitHiddenEntities) {
    visitor->reserveMemoryForEdges(graph->numberOfEdges());
    auto edges = graph->edges();
    unsigned int nbEdges = edges.size();
    for (unsigned int i = 0; i < nbEdges; ++i) {
      GlEdge glEdge(edges[i], i);
      visitor->visit(&glEdge);
    }
  }
}
}
