extern crate tulip;

use tulip::tlp::*;

#[test]
fn create() {

    let mut g = Graph::new().expect("Unable to create graph");
    let n1 = g.add_node();
    let n2 = g.add_node();
    let e = g.add_edge(&n1, &n2);

}
