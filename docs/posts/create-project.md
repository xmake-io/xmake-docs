---
title: Create project
tags: [xmake, create, project, template]
date: 2016-06-26
author: Ruki
---

xmake provides some project templates, you can easily create an empty project.

Create a c++ console project：

```bash
        xmake create -l c++ -t 1 demo
     or xmake create --language=c++ --template=1 demo
```

Create a c static library project：

```bash
        xmake create -l c -t 5 demo
     or xmake create --language=c --template=5 demo
```

Create a c shared library project：

```bash
        xmake create -t 3 demo
     or xmake create --template=3 demo
```

The default language is C language and `-t/--template` argument is used to get specific types of templates.

Only supports three templates which are console, static library and shared library.

We will add some application templates in the future.

We need note that the template's ID is variable. 



You can run `xmake create --help` to get more arguments info for template.

```bash
    Usage: xmake create [options] [target]

    Create a new project.

    Options: 
        -n NAME, --name=NAME                   The project name.
        -f FILE, --file=FILE                   Create a given xmake.lua file. (default: xmake.lua)
        -P PROJECT, --project=PROJECT          Create from the given project directory.
                                               Search priority:
                                                   1. The Given Command Argument
                                                   2. The Envirnoment Variable: XMAKE_PROJECT_DIR
                                                   3. The Current Directory
        -l LANGUAGE, --language=LANGUAGE       The project language (default: c)
                                                   - c
                                                   - c++
                                                   - objc
                                                   - objc++
                                                   - swift
        -t TEMPLATE, --template=TEMPLATE       Select the project template id of the given language. (default: 1)
                                                   - language: c
                                                     1. The Console Program
                                                     2. The Console Program (tbox)
                                                     3. The Shared Library
                                                     4. The Shared Library (tbox)
                                                     5. The Static Library
                                                     6. The Static Library (tbox)
                                                   - language: c++
                                                     1. The Console Program
                                                     2. The Console Program (tbox)
                                                     3. The Shared Library
                                                     4. The Shared Library (tbox)
                                                     5. The Static Library
                                                     6. The Static Library (tbox)
                                                   - language: objc
                                                     1. The Console Program
                                                   - language: objc++
                                                     1. The Console Program
                                                   - language: swift
                                                     1. The Console Program
                                               
        -v, --verbose                          Print lots of verbose information.
            --version                          Print the version number and exit.
        -h, --help                             Print this help message and exit.
                                               
        target                                 Create the given target.
                                               Uses the project name as target if not exists.
```
