SET(tulipc_LIB_SRCS ${tulipc_LIB_SRCS}
	tulip_graph.cpp
)

SET(LibTulipCoreNameC "c-${LibTulipCoreName}")

SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fpic")

IF(HAVE_REENTRANT_QHULL)
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DHAVE_REENTRANT_QHULL")
ENDIF(HAVE_REENTRANT_QHULL)
INCLUDE_DIRECTORIES(${TulipCoreBuildInclude} ${TulipCoreInclude} ${PROJECT_SOURCE_DIR} ${ZLIB_INCLUDE_DIR} ${YajlInclude} ${QhullInclude} ${GZStreamInclude} ${UTF8CppInclude})



INCLUDE_DIRECTORIES(${TulipCoreInclude}/../../tulip-c/include )

ADD_LIBRARY(${LibTulipCoreNameC} STATIC ${tulipc_LIB_SRCS})
TARGET_LINK_LIBRARIES(${LibTulipCoreNameC} ${LibTulipCoreName} ${CMAKE_DL_LIBS})
IF(WIN32)
  IF(MSVC)
	  TARGET_LINK_LIBRARIES(${LibTulipCoreNameC} Dbghelp)
    IF(${CMAKE_GENERATOR} MATCHES "Visual Studio 9" OR ${CMAKE_GENERATOR} MATCHES "NMake Makefiles")
	    SET_TARGET_PROPERTIES(${LibTulipCoreNameC} PROPERTIES LINK_FLAGS " /NODEFAULTLIB:LIBCMT.lib ")
    ENDIF()
  ENDIF()
ENDIF(WIN32)

INSTALL(TARGETS ${LibTulipCoreNameC}
  RUNTIME DESTINATION ${TulipBinInstallDir} COMPONENT tulip_core_c
  LIBRARY DESTINATION ${TulipLibInstallDir} COMPONENT tulip_core_c
  ARCHIVE DESTINATION ${TulipLibInstallDir} COMPONENT tulip_core_c)

