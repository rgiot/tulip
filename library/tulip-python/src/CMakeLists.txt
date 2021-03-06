IF(PYTHONLIBS_FOUND)
IF(SIP_OK)

IF(WIN32)
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -DDLL_TULIP_PYTHON")
ENDIF(WIN32)

INCLUDE_DIRECTORIES(BEFORE ${SIP_INCLUDE_DIR})
INCLUDE_DIRECTORIES(${PYTHON_INCLUDE_DIR} ${PYTHON_INCLUDE_PATH} ${OPENGL_INCLUDE_DIR})
INCLUDE_DIRECTORIES(BEFORE ${TulipCoreBuildInclude})
INCLUDE_DIRECTORIES(${TulipCoreInclude} ${TulipOGLInclude} ${TulipGUIInclude} ${TulipPythonInclude} ${CMAKE_CURRENT_BINARY_DIR} ${CMAKE_CURRENT_SOURCE_DIR})

QTX_SET_INCLUDES_AND_DEFINITIONS()

SET(${LibTulipPythonName}_LIB_SRCS
    ConsoleUtilsModule.cpp
    PythonCodeEditor.cpp
    PythonCodeHighlighter.cpp
    ParenMatcherHighlighter.cpp
    PythonInterpreter.cpp
    PythonShellWidget.cpp
    TulipUtilsModule.cpp
    APIDataBase.cpp
    AutoCompletionDataBase.cpp
    PythonTabWidget.cpp
    ConsoleHandlers.h
    PythonEditorsTabWidget.cpp
    PythonCppTypesConverter.cpp
    PythonIDE.cpp
    PythonPluginCreationDialog.cpp
)

SET(${LibTulipPythonName}_UI
    ../designer/FindReplaceDialog.ui
    ../designer/PythonPluginCreationDialog.ui
    ../designer/PythonIDE.ui
)

SET(${LibTulipPythonName}_MOC
    ConsoleHandlers.h
    ../include/tulip/PythonShellWidget.h
    ../include/tulip/PythonCodeEditor.h
    ../include/tulip/PythonEditorsTabWidget.h
    ../include/tulip/PythonInterpreter.h
    ../include/tulip/PythonIDE.h
    ../include/tulip/PythonPluginCreationDialog.h
)

QTX_WRAP_UI(${LibTulipPythonName}_UI_SRCS ${${LibTulipPythonName}_UI})
QTX_WRAP_CPP(${LibTulipPythonName}_MOC_SRCS ${${LibTulipPythonName}_MOC})
QTX_ADD_RESOURCES(${LibTulipPythonName}_RCC_SRCS ../resources/TulipPython.qrc)

ADD_LIBRARY(${LibTulipPythonName} SHARED ${${LibTulipPythonName}_LIB_SRCS} ${${LibTulipPythonName}_MOC_SRCS} ${${LibTulipPythonName}_UI_SRCS} ${${LibTulipPythonName}_RCC_SRCS})

TARGET_LINK_LIBRARIES(${LibTulipPythonName} ${LibTulipCoreName})
TARGET_LINK_LIBRARIES(${LibTulipPythonName} ${LibTulipGUIName})
TARGET_LINK_LIBRARIES(${LibTulipPythonName} ${QT_LIBRARIES})
TARGET_LINK_LIBRARIES(${LibTulipPythonName} ${PYTHON_LIBRARY})

INSTALL(TARGETS ${LibTulipPythonName}
  RUNTIME DESTINATION ${TulipBinInstallDir} COMPONENT tulip_python
  LIBRARY DESTINATION ${TulipLibInstallDir} COMPONENT tulip_python
  ARCHIVE DESTINATION ${TulipLibInstallDir} COMPONENT tulip_python)

ENDIF(SIP_OK)
ENDIF(PYTHONLIBS_FOUND)
