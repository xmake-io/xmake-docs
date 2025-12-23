#ifndef TEST_H
#define TEST_H

#include <QtCore/qglobal.h>

#if defined(TEST_LIBRARY)
#  define TEST_EXPORT Q_DECL_EXPORT
#else
#  define TEST_EXPORT Q_DECL_IMPORT
#endif

TEST_EXPORT void test();

#endif // TEST_H
