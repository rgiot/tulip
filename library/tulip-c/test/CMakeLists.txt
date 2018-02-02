INCLUDE_DIRECTORIES(${TulipCoreInclude}/../../tulip-c/include )

ADD_EXECUTABLE(tulip_c_test test.c)

SET(LibTulipCoreNameC "c-${LibTulipCoreName}")

TARGET_LINK_LIBRARIES(tulip_c_test ${LibTulipCoreNameC})
INSTALL(TARGETS tulip_c_test
  RUNTIME DESTINATION ${TulipBinInstallDir} COMPONENT tulip_core_c_test
)
