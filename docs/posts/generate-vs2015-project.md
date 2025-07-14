---
title: The xmake plugin for generating vstudio project file (vs2002 - 2015)
tags: [xmake, VisualStudio, plugin, vs2008, vs2015]
date: 2016-08-29
author: Ruki
---

Xmake provide a builtin-plugin for generating VisualStudio project file (vs2002 - 2015) now.

.e.g 

We need enter the project directory first and run the following command if we want to generate vs2013 project.

```bash
$ xmake project -k vs2013
```

It will generate a directory(vs2013) in the current project and the directory structure is similar to:

```
vs2013
├── demo
│   └── demo.vcxproj
├── tbox
│   └── tbox.vcxproj
└── tbox.sln
```





We also modify the other building directory manulally.

```bash
$ xmake f -o f:\build
$ xmake project -k vs2015
```

Or we set the other VisualStudio project directory.

```bash
$ xmake project -k vs2008 f:\vsproject
```

We can also configure some other options before generate VisualStudio project and building it.

.e.g 

Generate the project for building the debug version.

```bash
$ xmake f -m debug
$ xmake project -k vs2015
```

Or Disable some modules and re-generate vs project.

```bash
$ xmake f --demo=n --openssl=n --xml=n
$ xmake project -k vs2015
```

Xmake can also build project directly without the VisualStudio project file.

We need only open cmd windows and run the following command:

```bash
$ xmake
```

Done! :)