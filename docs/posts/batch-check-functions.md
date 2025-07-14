---
title: Batch checking library functions
tags: [xmake, check, batch, function]
date: 2016-07-16
author: Ruki
---

xmake provides some api, which can detect whether exist some library functions.

```lua

target("test")

    -- checks some libc functions from the header files: wchar.h and stdlib.h
    add_cfuncs("libc", nil,         {"wchar.h", "stdlib.h"},            "wcscat",
                                                                        "wcsncat",
                                                                        "wcscpy",
                                                                        "wcsncpy",
                                                                        "wcslcpy",
                                                                        "wcslen",
                                                                        "wcsnlen",
                                                                        "wcsstr",
                                                                        "wcscasestr",
                                                                        "wcscmp",
                                                                        "wcscasecmp",
                                                                        "wcsncmp",
                                                                        "wcsncasecmp",
                                                                        "wcstombs",
                                                                        "mbstowcs")

    -- checks the interfaces: pthread_mutex_init, pthread_create in the pthread
    -- the first argument is the library alias name
    add_cfuncs("posix", nil,        "pthread.h",                        "pthread_mutex_init", "pthread_create")

    -- checks the pthread interfaces and attempt to links it using flags: -lpthread
    add_cfuncs("posix", "pthread",  "pthread.h",                        "pthread_mutex_init", "pthread_create")

```



We can run `xmake f -v` to get the verbose info:

```
checking for the c include string.h ... ok
checking for the c include stdlib.h ... ok
checking for the c function strlen ... ok
checking for the c function sincosf ... no
checking for the c include wchar.h ... ok
checking for the c function wcscmp ... ok
checking for the c function wcsncat ... ok
checking for the c include dlfcn.h ... ok
checking for the c function dlopen ... ok
checking for the links polarssl ... ok
checking for the c include polarssl/polarssl.h ... ok
checking for the c function strcat ... ok
checking for the c function wcsstr ... ok
checking for the c function wcscat ... ok
checking for the c function sincos ... no
checking for the c function memcpy ... ok
checking for the c function sqrtf ... ok
checking for the c function wcsnlen ... ok
checking for the c function acosf ... ok
checking for the links pthread, dl, m, c ... ok
checking for the c include sys/stat.h ... ok
checking for the c function open ... ok
checking for the c function strnlen ... ok
checking for the c function system ... ok
checking for the links z ... ok
checking for the c include zlib/zlib.h ... ok
checking for the c function strncat ... ok
checking for the c function wcsncpy ... ok
checking for the c function gmtime ... ok
checking for the c include signal.h ... ok
checking for the c include setjmp.h ... ok
checking for the c function sigsetjmp ... ok
checking for the c function sinf ... ok
checking for the c function strncmp ... ok
checking for the c function memmove ... ok
checking for the c function strncasecmp ... ok
checking for the c function strlcpy ... ok
checking for the links sqlite3 ... ok
checking for the c include sqlite3/sqlite3.h ... ok
checking for the c include sys/sem.h ... ok
checking for the c include sys/ipc.h ... ok
checking for the c function semtimedop ... no
checking for the c function wcscpy ... ok
checking for the c function sqrt ... ok
checking for the c function strcmp ... ok
checking for the c function strcasecmp ... ok
checking for the c function semget ... ok
checking for the c include unistd.h ... ok
checking for the c function sysconf ... ok
checking for the c function memset ... ok
checking for the c function getpagesize ... ok
checking for the c include semaphore.h ... ok
checking for the c function sem_init ... ok
checking for the c function strncpy ... ok
checking for the c function localtime ... ok
checking for the c include ifaddrs.h ... ok
checking for the c function getifaddrs ... ok
checking for the c function strcpy ... ok
checking for the c function gethostname ... ok
checking for the c function wcslcpy ... ok
checking for the c include dirent.h ... ok
checking for the c function opendir ... ok
checking for the c function wcslen ... ok
checking for the c function cos ... ok
checking for the c include sys/time.h ... ok
checking for the c function gettimeofday ... ok
checking for the c function signal ... ok
checking for the c function strstr ... ok
checking for the c function exp ... ok
checking for the c function log2f ... ok
checking for the c function sin ... ok
checking for the c function log2 ... ok
checking for the c function cosf ... ok
checking for the c include pthread.h ... ok
checking for the c function pthread_mutex_init ... ok
checking for the c function fmodf ... ok
checking for the c function wcstombs ... ok
checking for the c function fmod ... ok
checking for the c function memcmp ... ok
checking for the c function atan2f ... ok
checking for the c function atan2 ... ok
checking for the c function atanf ... ok
checking for the c function atan ... ok
checking for the c function powf ... ok
checking for the c function pow ... ok
checking for the c function asinf ... ok
checking for the c function asin ... ok
checking for the c function pthread_create ... ok
```

xmake will generate the results into the config.h after checking if the config file has been enabled.

```lua
target("test")
    -- set the auto-generated config.h
    set_config_h("$(buildir)/tbox/tbox.config.h")
    set_config_h_prefix("TB_CONFIG")
```

And the content of config.h is: 

```c
#define TB_CONFIG_LIBC_HAVE_MEMCPY
#define TB_CONFIG_LIBC_HAVE_MEMSET
#define TB_CONFIG_LIBC_HAVE_MEMMOVE
#define TB_CONFIG_LIBC_HAVE_MEMCMP
#define TB_CONFIG_LIBC_HAVE_MEMMEM
#define TB_CONFIG_LIBC_HAVE_STRCAT
#define TB_CONFIG_LIBC_HAVE_STRNCAT
#define TB_CONFIG_LIBC_HAVE_STRCPY
#define TB_CONFIG_LIBC_HAVE_STRNCPY
#define TB_CONFIG_LIBC_HAVE_STRLCPY
#define TB_CONFIG_LIBC_HAVE_STRLEN
#define TB_CONFIG_LIBC_HAVE_STRNLEN
#define TB_CONFIG_LIBC_HAVE_STRSTR
#define TB_CONFIG_LIBC_HAVE_STRCASESTR
#define TB_CONFIG_LIBC_HAVE_STRCMP
#define TB_CONFIG_LIBC_HAVE_STRCASECMP
#define TB_CONFIG_LIBC_HAVE_STRNCMP
#define TB_CONFIG_LIBC_HAVE_STRNCASECMP
#define TB_CONFIG_LIBC_HAVE_WCSCAT
#define TB_CONFIG_LIBC_HAVE_WCSNCAT
#define TB_CONFIG_LIBC_HAVE_WCSCPY
#define TB_CONFIG_LIBC_HAVE_WCSNCPY
#define TB_CONFIG_LIBC_HAVE_WCSLCPY
#define TB_CONFIG_LIBC_HAVE_WCSLEN
#define TB_CONFIG_LIBC_HAVE_WCSNLEN
#define TB_CONFIG_LIBC_HAVE_WCSSTR
#define TB_CONFIG_LIBC_HAVE_WCSCMP
#define TB_CONFIG_LIBC_HAVE_WCSCASECMP
#define TB_CONFIG_LIBC_HAVE_WCSNCMP
#define TB_CONFIG_LIBC_HAVE_WCSNCASECMP
#define TB_CONFIG_LIBC_HAVE_WCSTOMBS
#define TB_CONFIG_LIBC_HAVE_MBSTOWCS
#define TB_CONFIG_LIBC_HAVE_GMTIME
#define TB_CONFIG_LIBC_HAVE_MKTIME
#define TB_CONFIG_LIBC_HAVE_LOCALTIME
#define TB_CONFIG_LIBC_HAVE_GETTIMEOFDAY
#define TB_CONFIG_LIBC_HAVE_SIGNAL
#define TB_CONFIG_LIBC_HAVE_SETJMP
#define TB_CONFIG_LIBC_HAVE_SIGSETJMP
#define TB_CONFIG_LIBC_HAVE_BACKTRACE
#define TB_CONFIG_LIBC_HAVE_SYSTEM
#define TB_CONFIG_LIBM_HAVE_LOG2
#define TB_CONFIG_LIBM_HAVE_LOG2F
#define TB_CONFIG_LIBM_HAVE_SQRT
#define TB_CONFIG_LIBM_HAVE_SQRTF
#define TB_CONFIG_LIBM_HAVE_ACOS
#define TB_CONFIG_LIBM_HAVE_ACOSF
#define TB_CONFIG_LIBM_HAVE_ASIN
#define TB_CONFIG_LIBM_HAVE_ASINF
#define TB_CONFIG_LIBM_HAVE_POW
#define TB_CONFIG_LIBM_HAVE_POWF
#define TB_CONFIG_LIBM_HAVE_FMOD
#define TB_CONFIG_LIBM_HAVE_FMODF
#define TB_CONFIG_LIBM_HAVE_ATAN
#define TB_CONFIG_LIBM_HAVE_ATANF
#define TB_CONFIG_LIBM_HAVE_ATAN2
#define TB_CONFIG_LIBM_HAVE_ATAN2F
#define TB_CONFIG_LIBM_HAVE_COS
#define TB_CONFIG_LIBM_HAVE_COSF
#define TB_CONFIG_LIBM_HAVE_SIN
#define TB_CONFIG_LIBM_HAVE_SINF
#define TB_CONFIG_LIBM_HAVE_EXP
#define TB_CONFIG_LIBM_HAVE_EXPF
#define TB_CONFIG_POSIX_HAVE_POLL
#define TB_CONFIG_POSIX_HAVE_PTHREAD_MUTEX_INIT
#define TB_CONFIG_POSIX_HAVE_PTHREAD_CREATE
#define TB_CONFIG_POSIX_HAVE_SOCKET
#define TB_CONFIG_POSIX_HAVE_OPENDIR
#define TB_CONFIG_POSIX_HAVE_DLOPEN
#define TB_CONFIG_POSIX_HAVE_OPEN
#define TB_CONFIG_POSIX_HAVE_GETHOSTNAME
#define TB_CONFIG_POSIX_HAVE_GETIFADDRS
#define TB_CONFIG_POSIX_HAVE_SEM_INIT
#define TB_CONFIG_POSIX_HAVE_GETPAGESIZE
#define TB_CONFIG_POSIX_HAVE_SYSCONF
#define TB_CONFIG_POSIX_HAVE_SCHED_YIELD
#define TB_CONFIG_SYSTEMV_HAVE_SEMGET
```

Please use the following api if we want to check the c++ function in the static library.

```lua
add_cxxfuncs(...)
```
