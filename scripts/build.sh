#!/bin/bash
npm add vitepress@2.0.0-alpha.6 -D --save-dev
npm add vitepress-plugin-group-icons -D
npm add vitepress-plugin-llms -D
npm add gray-matter -D
npm add markdown-it -D
npm add glob -D
npm install
npm run generate-blog
npx vitepress build docs
node scripts/fix-llms-txt.cjs
