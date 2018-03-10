 extern crate tulip;

use tulip::tlp::*;

#[test]
fn test() {

    let mut myGraph = Graph::new().expect("Unable to create the graph");

    let a = myGraph.add_node();
    let b = myGraph.add_node();
    let c = myGraph.add_node();
    let d = myGraph.add_node();
    let e = myGraph.add_node();

    myGraph.add_edge(&a, &b);
    myGraph.add_edge(&a, &c);
    myGraph.add_edge(&b, &d);
    myGraph.add_edge(&c, &e);
    myGraph.add_edge(&d, &e);

    let mut color = myGraph.get_color_property("viewColor");
    color.set_node_value(&a, Color::new(255, 0, 0));
    color.set_node_value(&b, Color::new(0, 255, 0));
    color.set_node_value(&c, Color::new(0, 0, 255));
    color.set_node_value(&d, Color::new(255, 0, 0));
    color.set_node_value(&e, Color::new(0, 255, 0));

    let mut label = myGraph.get_string_property("viewLabel");
    label.set_node_value(&a, String::from("A"));
    label.set_node_value(&b, String::from("B"));
    label.set_node_value(&c, String::from("C"));
    label.set_node_value(&d, String::from("D"));
    label.set_node_value(&e, String::from("E"));

    let mut metric = myGraph.get_double_property("degree");

    myGraph.apply_property_algorithm("Degree", metric).expect("Failure");
    //assert!((&res).is_ok());

    // TODO add additional instructions of the demo

    myGraph.save("mygraph.tlp");
}
