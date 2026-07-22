cmake_minimum_required(VERSION 3.11)
project(rnapp)

set(RNOH_APP_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(NODE_MODULES "${CMAKE_CURRENT_SOURCE_DIR}/../../../../../node_modules")
set(RNOH_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../oh_modules/@rnoh/react-native-openharmony/src/main/cpp")
set(RNOH_GENERATED_DIR "${CMAKE_CURRENT_SOURCE_DIR}/generated")
set(LOG_VERBOSITY_LEVEL 1)
set(CMAKE_ASM_FLAGS "-Wno-error=unused-command-line-argument -Qunused-arguments")
set(CMAKE_CXX_FLAGS "-fstack-protector-strong -Wl,-z,relro,-z,now,-z,noexecstack -s -fPIE -pie")
set(WITH_HITRACE_SYSTRACE ON)
set(WITH_HITRACE_REACT_MARKER ON)
set(OH_MODULES_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../../../oh_modules") # required by 'autolink_libraries'

add_subdirectory("${RNOH_CPP_DIR}" ./rn)

include("${CMAKE_CURRENT_SOURCE_DIR}/autolinking.cmake")

# Manually linked libraries (no RNOH autolinking metadata in these packages)
add_subdirectory("${OH_MODULES_DIR}/@react-native-ohos/async-storage/src/main/cpp" ./async_storage)
add_subdirectory("${OH_MODULES_DIR}/@react-native-ohos/react-native-safe-area-context/src/main/cpp" ./safe_area)
add_subdirectory("${OH_MODULES_DIR}/@react-native-ohos/react-native-localize/src/main/cpp" ./rn_localize)

# These libraries link against `rnoh`, which is an INTERFACE target expanding to
# rnoh_core/rnoh_core_package. That expansion does not give ninja a build-order
# edge, so a parallel build can link them before librnoh_core.so exists
# ("no such file or directory: librnoh_core.so"). Force the ordering.
foreach(manual_lib rnoh_async_storage rnoh_safe_area rnoh_localize)
    if(TARGET ${manual_lib})
        add_dependencies(${manual_lib} rnoh_core rnoh_core_package)
    endif()
endforeach()

file(GLOB GENERATED_CPP_FILES "${CMAKE_CURRENT_SOURCE_DIR}/generated/*.cpp") # this line is needed by codegen v1
add_library(rnoh_app SHARED
    ${GENERATED_CPP_FILES}
    "./PackageProvider.cpp"
    "${RNOH_CPP_DIR}/RNOHAppNapiBridge.cpp"
)
target_link_libraries(rnoh_app PUBLIC rnoh rnoh_async_storage rnoh_safe_area rnoh_localize)

autolink_libraries(rnoh_app)
