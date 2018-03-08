#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));

use std::slice;


// TODO Choose if node's life depend on grpah's life
//      or if we clone them
struct Graph {
    g: tulip_graph_t,
    no_nodes: [Node; 0],
    no_edges: [Edge; 0],

}

trait GraphElement {
    fn get_id(&self) -> u32;
    fn is_element(&self, g:&Graph) -> bool;

    fn is_valid(&self) -> bool {
        self.get_id() != <u32>::max_value()
    }

}

#[derive(Clone)]
struct Node {
    idx: u32
}

#[derive(Clone)]
struct Edge {
    idx: u32
}

impl GraphElement for Node {
    fn get_id(&self) -> u32 {
        self.idx
    }

    fn is_element(&self, g:&Graph) -> bool {
        g.is_node_element(self.clone())
    }


}

impl Node {

    fn fake() -> Node {
        Node{idx: <u32>::max_value()}
    }

    fn from(idx:u32) -> Node {
        Node{idx: idx}
    }
}

impl GraphElement for Edge {
    fn get_id(&self) -> u32 {
        return self.idx
    }


    fn is_element(&self, g:&Graph) -> bool {
        g.is_edge_element(self.clone())
    }


}

impl Graph {
    pub fn new() -> Result<Graph, &'static str> {
        let id = unsafe {
            tulip_new_graph()
        };

        match id.is_null() {
            true => Err("Unable to create graph"),
            false => Ok(Graph{ g:id, no_nodes:[], no_edges:[] })
        }
    }

    pub fn add_node(&mut self) -> Node {
        let id = unsafe{tulip_add_node(self.g)};
        Node {
            idx: id
        }
    }

    pub fn add_edge(&mut self, n1: Node , n2: Node) -> Edge {
        let id = unsafe{tulip_add_edge(self.g, n1.idx, n2.idx)};
        Edge {
            idx: id
        }
    }

    // Del node in all subgraphs
    pub fn del_node(&self, n:Node) -> Result<bool, String> {
        match n.clone().is_element(self) {
            true => {unsafe{tulip_del_node(self.g, n.get_id(), 1)}; Ok(true)},
            false => Err(String::from("Node XX is not in graph")),
        }
    }

    pub fn is_node_element(&self, n: Node) -> bool {
        unsafe{tulip_is_node_element(self.g, n.get_id()) != 0}
    }

    pub fn is_edge_element(&self, e: Edge) -> bool {
        unsafe{tulip_is_edge_element(self.g, e.get_id()) != 0}
    }

    pub fn number_of_nodes(&self) -> u32 {
        unsafe{tulip_number_of_nodes(self.g)}
    }

    // An option is returned to managed sempty slice.
    // Need to do in another way...
    pub fn nodes(&self) -> &[Node]{
        let mut addr:*const u32= 0 as *const u32;
        let mut size:u32 = 0;

        let paddr = &mut addr as *mut *const u32;
        let psize = &mut size as *mut u32;

        unsafe{
            tulip_nodes(self.g, paddr, psize);
        }

        if !addr.is_null()  && size > 0 {
            unsafe{slice::from_raw_parts(addr as *const Node, size as usize)}
        }
        else {
            &self.no_nodes
        }
    }

    pub fn deg(&self, n: Node) -> u32 {
        unsafe{tulip_deg(self.g, n.get_id())}
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn functionnal_create_simple_graph() {
        unsafe {
            let g = tulip_new_graph();
            let n1 = tulip_add_node(g);
            let n2 = tulip_add_node(g);

            let nb_nodes = tulip_number_of_nodes(g);
            assert_eq!(nb_nodes, 2);
        }
    }

    #[test]
    fn object_create_simple_graph() {
        let mut g = Graph::new().expect("Unable to create graph");
        let n1 = g.add_node();
        let n2 = g.add_node();
        let e = g.add_edge(n1.clone(), n2.clone());


        assert!(n1.clone().is_element(&g));
        assert!(n2.clone().is_element(&g));

        let nb_nodes = g.number_of_nodes();
        assert_eq!(nb_nodes, 2);


        let nodes2 = g.nodes();
        let s = nodes2.len();
        assert_eq!(s, 2);

        assert_eq!(nodes2[0].get_id(), 0);
        assert_eq!(nodes2[1].get_id(), 1);

        for node in nodes2 {
            assert!(node.is_valid());
        }

        let n:Node = Node::fake();
        assert!(!n.is_valid());
        assert!(!n.is_element(&g));

        let n:Node = Node::from(50);
        assert!(n.is_valid());
    }

    #[test]
    fn del() {
        let mut g = Graph::new().expect("Unable to create graph");
        let n1 = g.add_node();
        let n2 = g.add_node();
        let e = g.add_edge(n1.clone(), n2.clone());


        assert!(n1.clone().is_element(&g));
        assert!(n2.clone().is_element(&g));

        g.del_node(n1.clone());
        assert!(!n1.is_element(&g));
    }

    #[test]
    fn deg() {
        let mut g = Graph::new().expect("Unable to create graph");
        let n1 = g.add_node();
        let n2 = g.add_node();
        let n3 = g.add_node();
        let e = g.add_edge(n1.clone(), n2.clone());

        let nb_nodes = g.number_of_nodes();
        assert_eq!(nb_nodes, 3);
        assert_eq!(g.deg(n1), 1);
        assert_eq!(g.deg(n3), 0);


    }
}
