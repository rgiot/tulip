 extern crate tulip;

use tulip::tlp::*;

fn main() {

    println!("START");
   // init_lib();
   // init_tulip_software();
   // load_plugins();

    let mut myGraph = Graph::new().expect("Unable to create the graph");

    let a = &myGraph.add_node();
    let b = &myGraph.add_node();
    let c = &myGraph.add_node();
    let d = &myGraph.add_node();
    let e = &myGraph.add_node();

    myGraph.add_edge(a, b);
    myGraph.add_edge(a, c);
    myGraph.add_edge(b, d);
    myGraph.add_edge(c, e);
    myGraph.add_edge(d, e);

    let mut color = myGraph.get_color_property("viewColor");
    color.set_node_value(a, Color::new(255, 0, 0));
    color.set_node_value(b, Color::new(0, 255, 0));
    color.set_node_value(c, Color::new(0, 0, 255));
    color.set_node_value(d, Color::new(255, 0, 0));
    color.set_node_value(e, Color::new(0, 255, 0));

    let mut label = myGraph.get_string_property("viewLabel");
    label.set_node_value(a, String::from("A"));
    label.set_node_value(b, String::from("B"));
    label.set_node_value(c, String::from("C"));
    label.set_node_value(d, String::from("D"));
    label.set_node_value(e, String::from("E"));

    let mut metric = myGraph.get_double_property("degree");

     match myGraph.apply_property_algorithm("Degree", &metric) {
        Ok(_) => {println!("Able to call degree");}
        Err(msg) => {
            eprintln!("Unable to call degree: {}", msg);

            for n in myGraph.nodes() {
                let deg = myGraph.deg(n) as f64;
                metric.set_node_value(n, deg);
                println!("{} => {} (should be 2)", n, &deg);
            }

            println!("Degree manually computed");
        }
     }

    let val = metric.get_node_value(a);
    println!("A degree => {} (should be 2)", val);

    // TODO add additional instructions of the demo

    myGraph.save("mygraph.tlp");
}
