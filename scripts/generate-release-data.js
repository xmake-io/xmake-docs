#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../docs/.vitepress/data')
const outputFile = path.join(outputDir, 'xmake-release.js')
const releaseApiUrl = 'https://api.github.com/repos/xmake-io/xmake/releases/latest'
const releasePageUrl = 'https://github.com/xmake-io/xmake/releases/latest'
const outputPrefix = 'export const xmakeRelease = '

const emptyRelease = {
  tagName: '',
  name: '',
  url: releasePageUrl,
  publishedAt: '',
  fetchedAt: ''
}

function ensureOutputDir() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }
}

function serializeRelease(release) {
  return `${outputPrefix}${JSON.stringify(release, null, 2)}\n`
}

function readCachedRelease() {
  if (!existsSync(outputFile)) {
    return { ...emptyRelease }
  }

  try {
    const content = readFileSync(outputFile, 'utf8').trim()
    if (!content.startsWith(outputPrefix)) {
      return { ...emptyRelease }
    }

    const cachedRelease = JSON.parse(content.slice(outputPrefix.length))
    return { ...emptyRelease, ...cachedRelease }
  } catch {
    return { ...emptyRelease }
  }
}

async function fetchLatestRelease() {
  const response = await fetch(releaseApiUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'xmake-docs-release-badge'
    },
    signal: AbortSignal.timeout(10000)
  })

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`)
  }

  const payload = await response.json()

  return {
    tagName: typeof payload.tag_name === 'string' ? payload.tag_name.trim() : '',
    name: typeof payload.name === 'string' ? payload.name.trim() : '',
    url: typeof payload.html_url === 'string' ? payload.html_url : releasePageUrl,
    publishedAt: typeof payload.published_at === 'string' ? payload.published_at : '',
    fetchedAt: new Date().toISOString()
  }
}

async function main() {
  ensureOutputDir()

  const cachedRelease = readCachedRelease()

  try {
    const latestRelease = await fetchLatestRelease()
    writeFileSync(outputFile, serializeRelease(latestRelease))
    console.log(`Generated xmake release data: ${latestRelease.tagName || 'unknown'}`)
  } catch (error) {
    const fallbackRelease = {
      ...emptyRelease,
      ...cachedRelease,
      fetchedAt: cachedRelease.fetchedAt || new Date().toISOString()
    }

    writeFileSync(outputFile, serializeRelease(fallbackRelease))
    console.warn(`Failed to fetch latest xmake release, using cached data instead: ${error instanceof Error ? error.message : String(error)}`)
  }
}

main().catch((error) => {
  console.error('Unable to generate xmake release data:', error)
  process.exitCode = 1
})