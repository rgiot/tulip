INCLUDE_DIRECTORIES(${TulipCoreBuildInclude} ${TulipCoreInclude})
FILE(GLOB LIB_SRCS "*.cpp")

ADD_LIBRARY(LinLog-${TulipVersion} SHARED ${LIB_SRCS})
TARGET_LINK_LIBRARIES(LinLog-${TulipVersion}  ${LibTulipCoreName})

TULIP_INSTALL_PLUGIN(LinLog-${TulipVersion} ${TulipPluginsInstallDir})
