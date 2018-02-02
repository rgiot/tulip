#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));


    use std::ptr;
struct Graph {
    g: tulip_graph_t
}

struct Node {
    idx: u32
}

struct Edge {
    idx: u32
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
    }
}
