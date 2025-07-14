---
title: xmake-vscode v1.0.1 released, a xmake integration in vscode
tags: [xmake, lua, update]
date: 2017-10-17
author: Ruki
---

[xmake-vscode](https://github.com/xmake-io/xmake-vscode) plugin is a xmake integration in Visual Studio Code.

It is deeply integrated with [xmake](https://github.com/xmake-io/xmake) and vscode to provide a convenient and fast cross-platform c/c++ development and building.

## Features

* Colorization
* Completion Lists
* StatusBar
* Commands
* Configuration
* Build
* Run and Debug
* Record and Playback
* Problem

## Colorization and Completion Lists

<img src="/assets/img/posts/xmake/xmake-vscode-completion.gif">








## StatusBar

![statusbar](/assets/img/posts/xmake/xmake-vscode-statusbar.png)

## Commands

<img src="/assets/img/posts/xmake/xmake-vscode-commands.png">
 
## Configuration

<img src="/assets/img/posts/xmake/xmake-vscode-configure.gif">
 
## Build

<img src="/assets/img/posts/xmake/xmake-vscode-build.gif">
  
## Run and Debug

<img src="/assets/img/posts/xmake/xmake-vscode-debug.gif">
 
## Record and Playback

<img src="/assets/img/posts/xmake/xmake-vscode-record.gif">

## Problem

<img src="/assets/img/posts/xmake/xmake-vscode-problem.gif">

## Global Configuration

```json
{
    "configuration": {
        "type": "object",
        "title": "XMake configuration",
        "properties": {
            "xmake.logLevel": {
                "type": "string",
                "default": "normal",
                "description": "The Log Level: normal/verbose/minimal",
                "enum": [
                    "verbose",
                    "normal",
                    "minimal"
                ]
            },
            "xmake.buildLevel": {
                "type": "string",
                "default": "normal",
                "description": "The Build Output Level: normal/verbose/warning/debug",
                "enum": [
                    "verbose",
                    "normal",
                    "warning",
                    "debug"
                ]
            },
            "xmake.buildDirectory": {
                "type": "string",
                "default": "${workspaceRoot}/build",
                "description": "The Build Output Directory"
            },
            "xmake.installDirectory": {
                "type": "string",
                "default": "",
                "description": "The Install Output Directory"
            },
            "xmake.packageDirectory": {
                "type": "string",
                "default": "",
                "description": "The Package Output Directory"
            },
            "xmake.workingDirectory": {
                "type": "string",
                "default": "${workspaceRoot}",
                "description": "The Project Working Directory with the root xmake.lua"
            },
            "xmake.androidNDKDirectory": {
                "type": "string",
                "default": "",
                "description": "The Android NDK Directory"
            }
        }
    }
}
```