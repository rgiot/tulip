INCLUDE_DIRECTORIES(${TulipCoreBuildInclude} ${TulipCoreInclude} ${TulipOGLInclude} ${TulipGUIInclude} ${OPENGL_INCLUDE_DIR} ${CMAKE_CURRENT_BINARY_DIR} ${CMAKE_CURRENT_SOURCE_DIR})

SET(LIB_SRCS
    ParallelCoordinatesView.cpp
      ParallelCoordinatesDrawing.cpp
      ParallelCoordinatesGraphProxy.cpp
      ParallelAxis.cpp
      NominalParallelAxis.cpp
      AxisConfigDialogs.cpp 
      QuantitativeParallelAxis.cpp
      ParallelCoordsElementShowInfo.cpp
      ParallelCoordsElementsSelector.cpp
      ParallelCoordsGlEntitiesSelector.cpp
      ParallelCoordsElementDeleter.cpp
      ParallelCoordsElementHighlighter.cpp
      ParallelCoordsAxisSwapper.cpp
      ParallelCoordsAxisSliders.cpp
      ParallelCoordsAxisBoxPlot.cpp
      ParallelCoordsAxisSpacer.cpp
      ParallelCoordinatesInteractors.cpp
      ParallelTools.cpp
      ParallelCoordsDrawConfigWidget.cpp
      ParallelCoordinatesViewQuickAccessbar.cpp
      ${CMAKE_CURRENT_SOURCE_DIR}/../utils/ViewGraphPropertiesSelectionWidget.cpp
)

QTX_WRAP_UI(LIB_UI_HEADERS
    ParallelCoordsDrawConfigWidget.ui
    ${CMAKE_CURRENT_SOURCE_DIR}/../utils/ViewGraphPropertiesSelectionWidget.ui
)

QTX_WRAP_CPP(LIB_MOC_SRCS
      ParallelCoordinatesView.h
      AxisConfigDialogs.h
      ParallelCoordsDrawConfigWidget.h 
      ParallelCoordinatesViewQuickAccessbar.h
      ${CMAKE_CURRENT_SOURCE_DIR}/../utils/ViewGraphPropertiesSelectionWidget.h
)

QTX_ADD_RESOURCES(LIB_RCC_SRCS
ParallelResource.qrc
)

ADD_LIBRARY(ParallelCoordinatesView-${TulipVersion} SHARED ${LIB_SRCS} ${LIB_UI_HEADERS} ${LIB_MOC_SRCS} ${LIB_RCC_SRCS})
TARGET_LINK_LIBRARIES(ParallelCoordinatesView-${TulipVersion} ${LibTulipCoreName} ${LibTulipOGLName} ${LibTulipGUIName})

TULIP_INSTALL_PLUGIN(ParallelCoordinatesView-${TulipVersion} ${TulipViewPluginsInstallDir})
