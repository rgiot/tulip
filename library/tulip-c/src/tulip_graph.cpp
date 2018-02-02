#include "tulipc/tulip_graph.h"
#include <tulip/Graph.h>

tulip_graph_t tulip_new_graph() {
	return tlp::newGraph();
}

tulip_node tulip_add_node(tulip_graph_t g) {
	return static_cast<tlp::Graph *>(g)->addNode();
}

tulip_edge tulip_add_edge(tulip_graph_t g, tulip_node f, tulip_node t) {
	return static_cast<tlp::Graph *>(g)->addEdge(tlp::node(f), tlp::node(t));
}

unsigned int tulip_number_of_nodes(tulip_graph_t g) {
	return static_cast<tlp::Graph *>(g)->numberOfNodes();
}

unsigned int tulip_number_of_edges(tulip_graph_t g ) {
	return static_cast<tlp::Graph *>(g)->numberOfEdges();
}
