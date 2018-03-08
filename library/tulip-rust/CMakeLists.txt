include(ExternalProject)

#set_directory_properties(PROPERTIES EP_PREFIX ${CMAKE_BINARY_DIR}/Rust)

SET(LibTulipCoreNameC "c-${LibTulipCoreName}")


ADD_CUSTOM_TARGET(RustDeps ALL
   DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/Cargo.toml
	${CMAKE_CURRENT_SOURCE_DIR}/build.rs
	${CMAKE_CURRENT_SOURCE_DIR}/wrapper.h
	${CMAKE_CURRENT_SOURCE_DIR}/src/lib.rs
)



SET(ENV{TULIPC_LIB_DIR} "/home/rgiot/build/tulip-rust/library/tulip-c/src/")

ExternalProject_Add(
  tulip-rust
  DEPENDS ${LibTulipCoreName} ${LibTulipCoreNameC} RustDeps
  SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}
  CMAKE_ARGS -DCMAKE_INSTALL_PREFIX:
    PATH=<INSTALL_DIR>
    DOWNLOAD_COMMAND ""
    CONFIGURE_COMMAND ""
    BUILD_COMMAND cargo build
    COMMAND cargo build --release
    BINARY_DIR "${CMAKE_SOURCE_DIR}/library/tulip-rust"
    INSTALL_COMMAND ""
    LOG_BUILD ON
    TEST_COMMAND LD_LIBRARY_PATH=${CMAKE_BINARY_DIR}/library/tulip-core/src:${LD_LIBRARY_PATH} cargo test
)

