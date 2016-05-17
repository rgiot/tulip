SET(CHAR_SEP ":")
IF(WIN32)
SET(CHAR_SEP ";")
IF(MSVC)
SET(ENV{PATH} "${BIN_DIR}/../../library/tulip-core/src/Debug;${BIN_DIR}/../../library/tulip-gui/src/Debug;${BIN_DIR}/../../library/tulip-ogl/src/Debug;${BIN_DIR}/../../library/tulip-ogdf/src/Debug;${BIN_DIR}/../../library/tulip-python/src/Debug;${BIN_DIR}/../../thirdparty/gzstream/Debug;${BIN_DIR}/../../thirdparty/qxt/Debug;${BIN_DIR}/../../thirdparty/quazip/Debug;${BIN_DIR}/../../thirdparty/ftgl/Debug;${BIN_DIR}/../../thirdparty/OGDF/Debug;${BIN_DIR}/../../thirdparty/yajl/src/Debug;${QT_BIN_DIR};$ENV{PATH}")
ELSE(MSVC)
SET(ENV{PATH} "${BIN_DIR}/../../library/tulip-core/src;${BIN_DIR}/../../library/tulip-gui/src;${BIN_DIR}/../../library/tulip-ogl/src;${BIN_DIR}/../../library/tulip-ogdf/src/;${BIN_DIR}/../../library/tulip-python/src/;${BIN_DIR}/../../thirdparty/gzstream;${BIN_DIR}/../../thirdparty/qxt;${BIN_DIR}/../../thirdparty/quazip;${BIN_DIR}/../../thirdparty/ftgl;${BIN_DIR}/../../thirdparty/OGDF;${BIN_DIR}/../../thirdparty/yajl/src;${QT_BIN_DIR};$ENV{PATH}")
ENDIF(MSVC)
ENDIF(WIN32)
IF(MSVC)
SET(ENV{PYTHONPATH} "${BIN_DIR}/../../library/tulip-python/bindings/tulip-core/Debug${CHAR_SEP}${BIN_DIR}/../../library/tulip-python/src/Debug${CHAR_SEP}${SRC_DIR}/../../library/tulip-python/modules${CHAR_SEP}${SRC_DIR}/../../library/tulip-python/bindings/tulip-core${CHAR_SEP}${BIN_DIR}/../../library/tulip-python/bindings/stl/Debug${CHAR_SEP}$ENV{PYTHONPATH}")
ELSE(MSVC)
SET(ENV{PYTHONPATH} "${BIN_DIR}/../../library/tulip-python/bindings/tulip-core${CHAR_SEP}${BIN_DIR}/../../library/tulip-python/bindings/tulip-ogl${CHAR_SEP}${BIN_DIR}/../../library/tulip-python/bindings/tulip-gui${CHAR_SEP}${BIN_DIR}/../../library/tulip-python/src${CHAR_SEP}${SRC_DIR}/../../library/tulip-python/modules${CHAR_SEP}${SRC_DIR}/../../library/tulip-python/bindings/tulip-core${CHAR_SEP}${BIN_DIR}/../../library/tulip-python/bindings/stl${CHAR_SEP}$ENV{PYTHONPATH}")
ENDIF(MSVC)
IF(NOT SYSTEM_SIP)
IF(MSVC)
SET(ENV{PYTHONPATH} "${BIN_DIR}/../../thirdparty/sip-4.14/siplib/Debug${CHAR_SEP}$ENV{PYTHONPATH}")
ELSE(MSVC)
SET(ENV{PYTHONPATH} "${BIN_DIR}/../../thirdparty/sip-4.14/siplib${CHAR_SEP}$ENV{PYTHONPATH}")
ENDIF(MSVC)
ENDIF()
IF(APPLE)
SET(ENV{LC_ALL} "en_EN.UTF-8")
ENDIF(APPLE)
EXECUTE_PROCESS(COMMAND ${SPHINX_EXECUTABLE} -c ${CMAKE_CURRENT_BINARY_DIR} -b html -E -d ${BIN_DIR}/doctrees ${SOURCE_DIR} ${BIN_DIR}/html)
