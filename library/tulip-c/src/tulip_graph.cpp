#include "tulipc/tulip_graph.h"
#include <tulip/Graph.h>

tulip_graph_t tulip_new_graph() {
	return tlp::newGraph();
}

tulip_node tulip_add_node(tulip_graph_t g) {
	assert(g);
	return static_cast<tlp::Graph *>(g)->addNode();
}

tulip_edge tulip_add_edge(tulip_graph_t g, tulip_node f, tulip_node t) {
	assert(g);
	return static_cast<tlp::Graph *>(g)->addEdge(tlp::node(f), tlp::node(t));
}

unsigned int tulip_number_of_nodes(tulip_graph_t g) {
	assert(g);
	return static_cast<tlp::Graph *>(g)->numberOfNodes();
}

unsigned int tulip_number_of_edges(tulip_graph_t g ) {
	assert(g);
	return static_cast<tlp::Graph *>(g)->numberOfEdges();
}


void tulip_nodes(tulip_graph_t g, tulip_nodes_t* pv, unsigned int* ps) {
	assert(g);
	const auto & nodes = static_cast<tlp::Graph *>(g)->nodes();
	const auto & ptrNodes = nodes.data();

	if (nodes.empty()) {
		*pv = nullptr;
		*ps = 0;
	}
	else {
		//*pv = dynamic_cast<const void * >(ptrNodes);
		*pv = reinterpret_cast<tulip_nodes_t>(ptrNodes);
		*ps = nodes.size();
	}
}




void tulip_edges(tulip_graph_t g, tulip_edges_t* pv, unsigned int* ps) {
	assert(g);
	const auto & edges = static_cast<tlp::Graph *>(g)->edges();
	const auto & ptrEdges = edges.data();

	if (edges.empty()) {
		*pv = nullptr;
		*ps = 0;
	}
	else {
		*pv = (tulip_edges_t) ptrEdges;
		*ps = edges.size();
	}
}


int tulip_save_graph(tulip_graph_t g, const char * fname) {
	return saveGraph(static_cast<tlp::Graph *>(g), fname);
}

void tulip_del_node(tulip_graph_t g, tulip_node n, int deleteInAllGraphs) {
  reinterpret_cast<tlp::Graph *>(g)->delNode(static_cast<tlp::node>(n), deleteInAllGraphs );
}

void tulip_del_edge(tulip_graph_t g, tulip_edge n, int deleteInAllGraphs) {
  reinterpret_cast<tlp::Graph *>(g)->delEdge(static_cast<tlp::edge>(n), deleteInAllGraphs );
}

unsigned int tulip_deg(tulip_graph_t g, tulip_node n) {
  return reinterpret_cast<tlp::Graph *>(g)->deg(static_cast<tlp::node>(n));
}

unsigned int tulip_indeg(tulip_graph_t g, tulip_node n) {
  return reinterpret_cast<tlp::Graph *>(g)->indeg(static_cast<tlp::node>(n));
}

unsigned int tulip_outdeg(tulip_graph_t g, tulip_node n) {
  return reinterpret_cast<tlp::Graph *>(g)->outdeg(static_cast<tlp::node>(n));
}

tulip_node tulip_source(tulip_graph_t g, tulip_edge e) {
  return reinterpret_cast<tlp::Graph *>(g)->source(static_cast<tlp::edge>(e));
}

tulip_node tulip_target(tulip_graph_t g, tulip_edge e) {
  return reinterpret_cast<tlp::Graph *>(g)->target(static_cast<tlp::edge>(e));
}

int tulip_is_node_element(tulip_graph_t g, tulip_node n) {
	return reinterpret_cast<tlp::Graph *>(g)->isElement(static_cast<tlp::node>(n));
}

int tulip_is_edge_element(tulip_graph_t g, tulip_edge e) {
	return reinterpret_cast<tlp::Graph *>(g)->isElement(static_cast<tlp::edge>(e));
}



