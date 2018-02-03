include(ExternalProject)

set_directory_properties(PROPERTIES EP_PREFIX ${CMAKE_BINARY_DIR}/Rust)

SET(LibTulipCoreNameC "c-${LibTulipCoreName}")
ExternalProject_Add(
  tulip-rust
  DEPENDS ${LibTulipCoreName} ${LibTulipCoreNameC}
  SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}
  CMAKE_ARGS -DCMAKE_INSTALL_PREFIX:
    PATH=<INSTALL_DIR>
    DOWNLOAD_COMMAND ""
    CONFIGURE_COMMAND ""
    BUILD_COMMAND cargo build COMMAND cargo build --release
    BINARY_DIR "${CMAKE_SOURCE_DIR}/library/tulip-rust"
    INSTALL_COMMAND ""
    LOG_BUILD ON
    TEST_COMMAND LD_LIBRARY_PATH=${CMAKE_BINARY_DIR}/library/tulip-core/src:${LD_LIBRARY_PATH} cargo test
)

