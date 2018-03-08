#include "tulipc/tulip_graph.h"
#include <stdio.h>

int main(int argc, char *argv[])
{
	tulip_graph_t g;
	tulip_node n1, n2, n3, n4, n5;
	tulip_edge e1, e2, e3, e4;

	g = tulip_new_graph();

	n1 = tulip_add_node(g);
	n2 = tulip_add_node(g);
	n3 = tulip_add_node(g);
	n4 = tulip_add_node(g);
	n5 = tulip_add_node(g);

	e1 = tulip_add_edge(g, n1, n5);
	e2 = tulip_add_edge(g, n2, n5);
	e3 = tulip_add_edge(g, n3, n5);
	e4 = tulip_add_edge(g, n4, n5);

	int nb_nodes = tulip_number_of_nodes(g);
	int nb_edges = tulip_number_of_edges(g);

	printf("Nb nodes: %d, nb edges: %d\n", nb_nodes, nb_edges);

	tulip_nodes_t nodes;
	tulip_nodes(g, &nodes, &nb_nodes);
	printf("Nb nodes: %d\n", nb_nodes);

	for(int i=0; i<5 ; ++i) {
		printf("id: %u\n",  nodes[i]);
	}

	tulip_del_node(g, n1, 1);
	tulip_nodes(g, &nodes, &nb_nodes);
	printf("Nb nodes: %d\n", nb_nodes);


	printf("Nb edges: %d\n", tulip_number_of_edges(g));
	tulip_del_edge(g, e4, 1);
	printf("Nb edges: %d\n", tulip_number_of_edges(g));

	return 0;
}
