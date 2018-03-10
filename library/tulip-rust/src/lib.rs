#![allow(non_upper_case_globals)]
#![allow(non_camel_case_types)]
#![allow(non_snake_case)]

include!(concat!(env!("OUT_DIR"), "/bindings.rs"));



pub mod tlp {

    use std::slice;


    /// Generate the get_property code for the specific type of data
    macro_rules! get_property {
        ($type:/*ty*/tt, $rustname:ident, $cname:tt/*ident*/) => (
            pub fn $rustname(&self, name:&str) -> $type {
                use std::os::raw::c_char;
                use std::ffi::CString;

                let prop:$type;
                prop = $type{
                    p: unsafe{
                        $cname(
                            self.g,
                            CString::new(name).unwrap().as_ptr()
                        )
                    }
                };
                prop
            }
        );
    }





    pub struct Graph {
        g: ::tulip_graph_t,
        no_nodes: [Node; 0], // manage the absence of nodes
        no_edges: [Edge; 0], // manage the absence of edges
    }


    pub type Color = ::color_t;


    impl Color {
        pub fn new(r:u8, g:u8, b:u8) -> Color {
            Color{r,g,b,a:0}
        }
    }

    /// Each property must implement this trait
    pub trait Property {
        /// Repesents the type of data in tulip c library
        type TulipType;

        /// Represents the data manipulated
        type Data;

        /// Change the value of the required node
        fn set_node_value(&mut self, n: &Node, val: Self::Data);
    }


    /// Generate the minimal code for the requested property
    macro_rules! create_property {
        (
            $rust_type:tt,
            $c_type:tt,
            $rust_inner_type:ident,
            $c_inner_type:tt,
            $set_code:expr
        ) => (

            pub struct $rust_type {
                p: $c_type
            }

            impl Property for $rust_type {
                type TulipType = $c_type;
                type Data = $rust_inner_type;

                fn set_node_value(&mut self, n: &Node, val: Self::Data) {
                    $set_code(self, n, val);
                }
            }
            );
    }



    create_property!(
        ColorProperty,
        (::tulip_color_property_t),
        Color,
        (::color_t),
        |prop:&mut ColorProperty, n: &Node, val:Color| {
            unsafe{::tulip_colorproperty_set_node_value(prop.p, n.get_id(), (&val) as * const _)}
        }
    );

    create_property!(
        StringProperty,
        (::tulip_string_property_t),
        String,
        (::string_t),
        |prop:&mut StringProperty, n: &Node, val:String| {
            use std::ffi::CString;
            unsafe{::tulip_stringproperty_set_node_value(prop.p, n.get_id(), CString::new(val).unwrap().as_ptr() )};
        }
    );

    create_property!(
        DoubleProperty,
        (::tulip_double_property_t),
        f64,
        (::double_t),
        |prop:&mut DoubleProperty, n: &Node, val:f64| {
            unsafe{::tulip_doubleproperty_set_node_value(prop.p, n.get_id(), val)}
        }
    );






    pub trait GraphElement {
        fn get_id(&self) -> u32;
        fn is_element(&self, g:&Graph) -> bool;

        fn is_valid(&self) -> bool {
            self.get_id() != <u32>::max_value()
        }

    }

    #[derive(Clone)]
    pub struct Node {
        idx: u32
    }

    #[derive(Clone)]
    pub struct Edge {
        idx: u32
    }

    impl GraphElement for Node {
        fn get_id(&self) -> u32 {
            self.idx
        }

        fn is_element(&self, g:&Graph) -> bool {
            g.is_node_element(self)
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
            g.is_edge_element(self)
        }


    }

    impl Graph {

        /// Create a new graph
        pub fn new() -> Result<Graph, &'static str> {
            let id = unsafe {
                ::tulip_new_graph()
            };

            match id.is_null() {
                true => Err("Unable to create graph"),
                false => Ok(Graph{ g:id, no_nodes:[], no_edges:[] })
            }
        }


        /// Save the graph on disc
        /// TODO Manage error code
        pub fn save(&self, fname:&str) {
            use std::ffi::CString;
            unsafe{::tulip_save_graph(self.g, CString::new(fname).unwrap().as_ptr())};
        }


        /// Add a new node in the graph and return it
        pub fn add_node(&mut self) -> Node {
            let id = unsafe{::tulip_add_node(self.g)};
            Node {
                idx: id
            }
        }

        /// Add a new edge
        pub fn add_edge(&mut self, n1: &Node , n2: &Node) -> Edge {
            let id = unsafe{::tulip_add_edge(self.g, n1.idx, n2.idx)};
            Edge {
                idx: id
            }
        }

        /// Del node in all subgraphs
        pub fn del_node(&self, n: &Node) -> Result<bool, String> {
            match n.is_element(self) {
                true => {unsafe{::tulip_del_node(self.g, n.get_id(), 1)}; Ok(true)},
                false => Err(String::from("Node XX is not in graph")),
            }
        }

        /// Verify if the node belongs to the  graph
        pub fn is_node_element(&self, n: &Node) -> bool {
            unsafe{::tulip_is_node_element(self.g, n.get_id()) != 0}
        }

        /// Verify if the edge belongs to the graph
        pub fn is_edge_element(&self, e: &Edge) -> bool {
            unsafe{::tulip_is_edge_element(self.g, e.get_id()) != 0}
        }

        /// Returns the number of nodes of the graph
        pub fn number_of_nodes(&self) -> u32 {
            unsafe{::tulip_number_of_nodes(self.g)}
        }

        /// Return all the nodes of the graph
        /// An option is returned to managed sempty slice.
        /// Need to do in another way...
        pub fn nodes(&self) -> &[Node]{
            let mut addr:*const u32= 0 as *const u32;
            let mut size:u32 = 0;

            let paddr = &mut addr as *mut *const u32;
            let psize = &mut size as *mut u32;

            unsafe{
                ::tulip_nodes(self.g, paddr, psize);
            }

            if !addr.is_null()  && size > 0 {
                unsafe{slice::from_raw_parts(addr as *const Node, size as usize)}
            }
            else {
                &self.no_nodes
            }
        }

        /// Return the degree of the graph
        pub fn deg(&self, n: &Node) -> u32 {
            unsafe{::tulip_deg(self.g, n.get_id())}
        }

        // Property stuff

        get_property!(ColorProperty, get_color_property, (::tulip_get_color_property));
        get_property!(StringProperty, get_string_property, (::tulip_get_string_property));
        get_property!(DoubleProperty, get_double_property, (::tulip_get_double_property));



        // Algorithm stuff
        pub fn apply_property_algorithm<Prop:Property>(& mut self, algo_name: &str, property: Prop) -> Result<(), &str> 
        {
            Err("Unable to apply algorithm")
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
                let g = ::tulip_new_graph();
                let n1 = ::tulip_add_node(g);
                let n2 = ::tulip_add_node(g);

                let nb_nodes = ::tulip_number_of_nodes(g);
                assert_eq!(nb_nodes, 2);
            }
        }

        #[test]
        fn object_create_simple_graph() {
            let mut g = Graph::new().expect("Unable to create graph");
            let n1 = g.add_node();
            let n2 = g.add_node();
            let e = g.add_edge(&n1, &n2);


            assert!(n1.is_element(&g));
            assert!(n2.is_element(&g));

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
            let e = g.add_edge(&n1, &n2);


            assert!(n1.is_element(&g));
            assert!(n2.is_element(&g));

            g.del_node(&n1);
            assert!(!n1.is_element(&g));
        }

        #[test]
        fn deg() {
            let mut g = Graph::new().expect("Unable to create graph");
            let n1 = g.add_node();
            let n2 = g.add_node();
            let n3 = g.add_node();
            let e = g.add_edge(&n1, &n2);

            let nb_nodes = g.number_of_nodes();
            assert_eq!(nb_nodes, 3);
            assert_eq!(g.deg(&n1), 1);
            assert_eq!(g.deg(&n3), 0);


        }
    }
}
