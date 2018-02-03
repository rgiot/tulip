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

EXTERNC tulip_graph_t tulip_new_graph();
EXTERNC tulip_node tulip_add_node(tulip_graph_t);
EXTERNC tulip_edge tulip_add_edge(tulip_graph_t, tulip_node, tulip_node);
EXTERNC unsigned int tulip_number_of_nodes(tulip_graph_t);
EXTERNC unsigned int tulip_number_of_edges(tulip_graph_t);
EXTERNC void tulip_nodes(tulip_graph_t, tulip_nodes_t*, unsigned int*);

#undef EXTERNC
#endif
