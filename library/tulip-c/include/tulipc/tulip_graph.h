#ifndef TULIP_GRAPH_C
#define TULIP_GRAPH_C


 #ifdef __cplusplus
 #define EXTERNC extern "C"
 #else
 #define EXTERNC
 #endif

typedef void* tulip_graph_t;
typedef unsigned int tulip_node;
typedef unsigned int tulip_edge;

typedef tulip_node const * tulip_nodes_t;
typedef tulip_edge * tulip_edges_t;

typedef void* tulip_color_property_t;
typedef void* tulip_string_property_t;
typedef void* tulip_double_property_t;


typedef void * tulip_dataset_t;

struct color_t {
	 unsigned char r;
	 unsigned char g;
	 unsigned char b;
	 unsigned char a;

};


EXTERNC void tulip_init_lib();
EXTERNC void tulip_load_plugins();
EXTERNC void tulip_init_tulip_software();


EXTERNC tulip_graph_t tulip_new_graph();

EXTERNC tulip_node tulip_add_node(tulip_graph_t);
EXTERNC tulip_edge tulip_add_edge(tulip_graph_t, tulip_node, tulip_node);

EXTERNC unsigned int tulip_number_of_nodes(tulip_graph_t);
EXTERNC unsigned int tulip_number_of_edges(tulip_graph_t);

EXTERNC void tulip_nodes(tulip_graph_t, tulip_nodes_t*, unsigned int*);
EXTERNC void tulip_edges(tulip_graph_t, tulip_edges_t*, unsigned int*);

EXTERNC int tulip_save_graph(tulip_graph_t, const char *);

EXTERNC void tulip_del_node(tulip_graph_t g, tulip_node n, int deleteInAllGraphs);
EXTERNC void tulip_del_edge(tulip_graph_t g, tulip_edge e, int deleteInAllGraphs);



EXTERNC unsigned int tulip_deg(tulip_graph_t g, tulip_node n) ;
EXTERNC unsigned int tulip_indeg(tulip_graph_t g, tulip_node n) ;
EXTERNC unsigned int tulip_outdeg(tulip_graph_t g, tulip_node n) ;
EXTERNC tulip_node tulip_source(tulip_graph_t g, tulip_edge e) ;
EXTERNC tulip_node tulip_target(tulip_graph_t g, tulip_edge e) ;


EXTERNC int tulip_is_node_element(tulip_graph_t, tulip_node);
EXTERNC int tulip_is_edge_element(tulip_graph_t, tulip_node);


EXTERNC tulip_color_property_t tulip_get_color_property(tulip_graph_t g, const char *);
EXTERNC void tulip_colorproperty_set_node_value(tulip_color_property_t, const tulip_node n, const struct color_t* const);
EXTERNC const struct color_t tulip_colorproperty_get_node_value(tulip_color_property_t, const tulip_node n);


EXTERNC tulip_string_property_t tulip_get_string_property(tulip_graph_t g, const char *);
EXTERNC void tulip_stringproperty_set_node_value(tulip_string_property_t, const tulip_node n, const char *);
EXTERNC const char * tulip_stringproperty_get_node_value(tulip_string_property_t, const tulip_node n);



EXTERNC tulip_double_property_t tulip_get_double_property(tulip_graph_t g, const char *);
EXTERNC void tulip_doubleproperty_set_node_value(tulip_double_property_t, const tulip_node n, const double);
EXTERNC const double tulip_doubleproperty_get_node_value(tulip_double_property_t, const tulip_node n);


// Call the algorihtm stuff and returns true if succeded. Error message can be obtained with tulip_plugin_error_message
EXTERNC char tulip_apply_doubleproperty_algorithm(tulip_graph_t, tulip_double_property_t, const char * const, tulip_dataset_t const);

EXTERNC const char * tulip_plugin_error_message();
#undef EXTERNC
#endif
