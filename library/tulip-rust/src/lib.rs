#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));

use std::slice;

struct Graph {
    g: tulip_graph_t
}



trait GraphElement {
    fn get_id(&self) -> u32;
}

struct Node {
    idx: u32
}

struct Edge {
    idx: u32
}


impl GraphElement for Node {
    fn get_id(&self) -> u32 {
        return self.idx
    }
}

impl GraphElement for Edge {
    fn get_id(&self) -> u32 {
        return self.idx
    }
}

impl Graph {
    pub fn new() -> Result<Graph, &'static str> {
        let id = unsafe {
            tulip_new_graph()
        };

        match id.is_null() {
            true => Err("Unable to create graph"),
            false => Ok(Graph{ g:id })
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

    pub fn number_of_nodes(&self) -> u32 {
        unsafe{tulip_number_of_nodes(self.g)}
    }

    // An option is returned to managed sempty slice.
    // Need to do in another way...
    pub fn nodes(&self) -> Option<&[Node]>{
        let mut addr:*const u32= 0 as *const u32;
        let mut size:u32 = 0;

        let paddr = &mut addr as *mut *const u32;
        let psize = &mut size as *mut u32;

        unsafe{
            tulip_nodes(self.g, paddr, psize);
        }

        if !addr.is_null()  && size > 0 {
            Some(unsafe{slice::from_raw_parts(addr as *const Node, size as usize)})
        }
        else {
            None
        }
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
        let e = g.add_edge(n1, n2);

        let nb_nodes = g.number_of_nodes();
        assert_eq!(nb_nodes, 2);

        let nodes = g.nodes();
        assert!(nodes.is_some());

        let nodes2 = nodes.unwrap();
        let s = nodes.unwrap().len();
        assert_eq!(s, 2);

        assert_eq!(nodes2[0].get_id(), 0);
        assert_eq!(nodes2[1].get_id(), 1);
    }
}
