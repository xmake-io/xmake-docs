---
outline: deep
---

# yaml

[yaml](https://github.com/xmake-addons/yaml) provides a yaml parser and emitter written in
pure lua, plus a command line tool. No external dependency, so it works everywhere xmake works.

| Payload | What it provides |
| --- | --- |
| `modules/yaml` | the public module, `import("@addon.yaml.yaml")` |
| `modules/private/yaml/*` | the scanner, the parser, the emitter and the cli |

It reads the yaml that shows up in practice: block mappings and sequences (including the
compact `- name: foo` form), flow collections, quoted scalars with escapes, block scalars
(`|`, `>-`, `|2+`), anchors, aliases and merge keys, the standard tags and multiple documents.

## Install

```sh
$ xmake addon --install yaml
```

## Command line

```sh
$ xmake l @addon.yaml.yaml --help
$ xmake l @addon.yaml.yaml config.yaml            # normalize
$ xmake l @addon.yaml.yaml -f json config.yaml    # convert to json (also: lua)
$ xmake l @addon.yaml.yaml -g jobs.build.name ci.yaml   # query a key path
$ xmake l @addon.yaml.yaml -c config.yaml         # only check the syntax
$ cat config.yaml | xmake l @addon.yaml.yaml -f json
```

## In a script

```lua
import("@addon.yaml.yaml")

local value = yaml.decode("name: xmake\ntags: [build, lua]")
print(value.tags[1])                       -- build

local text = yaml.encode({name = "xmake", tags = yaml.mark_as_array({"build"})})
local conf = yaml.loadfile("config.yaml")
yaml.savefile("config.yaml", conf)
```

| Interface | Description |
| --- | --- |
| `yaml.decode(text)` | decode the first document |
| `yaml.decode_all(text)` | decode all the documents |
| `yaml.encode(value, opt)` | `opt = {indent = 2, sortkeys = true, blockstyle = true}` |
| `yaml.loadfile(path, opt)` / `yaml.savefile(path, value, opt)` | file helpers |
| `yaml.null()` / `yaml.is_null(v)` | the null value |
| `yaml.mark_as_array(t)` | emit an empty table as `[]` |

The null value and the array mark are the ones of `core.base.json`, so a decoded document
can be handed to `json.encode` as-is.
