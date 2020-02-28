#!/usr/bin/env bash

remote_get_content() {
    if curl --version >/dev/null 2>&1
    then
        curl -fsSL "$1"
    elif wget --version >/dev/null 2>&1
    then
        wget "$1" -O -
    fi
}

bash <(remote_get_content https://cdn.jsdelivr.net/gh/xmake-io/xmake@master/scripts/get.sh) $@
