#!/bin/bash
# npm add vitepress@2.0.0-alpha.6 -D --save-dev
# npm add vitepress-plugin-group-icons -D
# npm add vitepress-plugin-llms -D
npm run generate-release
npx vitepress dev docs
