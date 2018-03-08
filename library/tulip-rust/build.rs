extern crate bindgen;

use std::env;
use std::path::PathBuf;



const RUSTC_LINK_SEARCH:&str = "cargo:rustc-link-search=native=";
const RUSTC_LINK_LIB:&str = "cargo:rustc-link-lib=";

fn main() {

    // TODO automatically retreive these two variables
    let TULIP_SRC_ROOT_DIR = "/home/rgiot/src/tulip-perso/";
    let TULIP_BUILD_ROOT_DIR = "/home/rgiot/build/tulip-rust/";
    let LIBCPP_ROOT_DIR = "/usr/lib/gcc/x86_64-linux-gnu/7/";
    let TULIP_VERSION = "5.2";

    let RUSTC_LINK_SEARCH_BUILD = format!("{}{}", RUSTC_LINK_SEARCH, TULIP_BUILD_ROOT_DIR);

    let TULIP_LINK_SEARCH_PATH = [
        format!("{}{}", RUSTC_LINK_SEARCH_BUILD, "library/tulip-c/src/"),
        format!("{}{}", RUSTC_LINK_SEARCH_BUILD, "library/tulip-core/src/"),
        format!("{}{}", RUSTC_LINK_SEARCH_BUILD, LIBCPP_ROOT_DIR)
    ];

    let TULIP_LINK_LIB = [
        format!("{}{}{}", RUSTC_LINK_LIB, "c-tulip-core-", TULIP_VERSION),
        format!("{}{}{}", RUSTC_LINK_LIB, "tulip-core-", TULIP_VERSION),
        format!("{}{}", RUSTC_LINK_LIB, "stdc++")
    ];


    // output search path
    for line in TULIP_LINK_SEARCH_PATH.into_iter() {
        println!("{}", line);
    }

    // output libs
    for line in TULIP_LINK_LIB.into_iter() {
        println!("{}", line);
    }


    // The bindgen::Builder is the main entry point
    // to bindgen, and lets you build up options for
    // the resulting bindings.
    let bindings = bindgen::Builder::default()
        // The input header we would like to generate
        // bindings for.
        .header("wrapper.h")
        // Finish the builder and generate the bindings.
        .generate()
        // Unwrap the Result and panic on failure.
        .expect("Unable to generate bindings");

    // Write the bindings to the $OUT_DIR/bindings.rs file.
    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}
