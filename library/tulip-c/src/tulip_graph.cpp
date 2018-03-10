#include "tulipc/tulip_graph.h"
#include <tulip/Graph.h>



#include <tulip/TlpTools.h>
void tulip_init_lib() {
	tlp::initTulipLib();
}

#include <tulip/TlpQtTools.h>
void tulip_init_tulip_software() {
	tlp::initTulipSoftware();
}


#include <tulip/PluginLibraryLoader.h>
void tulip_load_plugins() {
	tlp::PluginLibraryLoader::loadPlugins(nullptr);
}

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






#include <tulip/ColorProperty.h>

tulip_color_property_t tulip_get_color_property(tulip_graph_t g, const char *prop) {
	return reinterpret_cast<tlp::Graph *>(g)->getProperty<tlp::ColorProperty>(prop);
}

void tulip_colorproperty_set_node_value(tulip_color_property_t p, const tulip_node n, const struct color_t* const c ) {
	return reinterpret_cast<tlp::ColorProperty *>(p)->setNodeValue(tlp::node(n), tlp::Color(c->r, c->g, c->b, c->a));
}

const struct color_t  tulip_colorproperty_get_node_value(tulip_color_property_t p, tulip_node n) {
	struct color_t c;

	const auto & res = reinterpret_cast<tlp::ColorProperty *>(p)->getNodeValue(tlp::node(n));
	c.r = res.r();
	c.b = res.b();
	c.g = res.g();
	c.a = res.a();
	return c;
}






#include <tulip/StringProperty.h>

tulip_string_property_t tulip_get_string_property(tulip_graph_t g, const char *prop) {
	return reinterpret_cast<tlp::Graph *>(g)->getProperty<tlp::StringProperty>(prop);
}

void tulip_stringproperty_set_node_value(tulip_string_property_t p, const tulip_node n, const char *s ) {
	return reinterpret_cast<tlp::StringProperty *>(p)->setNodeValue(tlp::node(n), s);
}

// XXX No idea how to manage the live of the string
const char * tulip_stringproperty_get_node_value(tulip_string_property_t p, tulip_node n) {
	const auto & res = reinterpret_cast<tlp::StringProperty *>(p)->getNodeValue(tlp::node(n));
	return res.c_str(); // XXX will it die now
}





#include <tulip/DoubleProperty.h>

tulip_double_property_t tulip_get_double_property(tulip_graph_t g, const char *prop) {
	return reinterpret_cast<tlp::Graph *>(g)->getProperty<tlp::ColorProperty>(prop);
}

void tulip_doubleproperty_set_node_value(tulip_double_property_t p, const tulip_node n, const double val) {
	return reinterpret_cast<tlp::DoubleProperty *>(p)->setNodeValue(tlp::node(n), val);
}

const double  tulip_doubleproperty_get_node_value(tulip_double_property_t p, tulip_node n) {
	return reinterpret_cast<tlp::DoubleProperty *>(p)->getNodeValue(tlp::node(n));
}



std::string error;


// TODO templetize for all the cases
char tulip_apply_doubleproperty_algorithm(tulip_graph_t g, tulip_double_property_t p, const char * const n, tulip_dataset_t const d) {
	return reinterpret_cast<tlp::Graph *>(g)->applyPropertyAlgorithm(
			n,
			reinterpret_cast<tlp::DoubleProperty *>(p),
			error,
			reinterpret_cast<tlp::DataSet *>(d)
			);
}


const char * tulip_plugin_error_message() {
	return error.c_str();
}
