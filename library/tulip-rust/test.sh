export LD_LIBRARY_PATH=/home/rgiot/build/tulip-rust/library/tulip-gui/src/:/home/rgiot/build/tulip-rust/library/tulip-core/src/:$LD_LIBRARY_PATH 
export TULIPC_LIB_DIR=/home/rgiot/build/tulip-rust/library/tulip-c/src/ \

cargo build
cargo test --verbose

RUST_BACKTRACE=1 ./target/debug/graphmanipulation
