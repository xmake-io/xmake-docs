import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

export function mergeStats(previous, response, now = new Date()) {
  if (!Array.isArray(previous.days) || !Array.isArray(response.clones)) throw new Error('Invalid traffic data')
  const today = now.toISOString().slice(0, 10)
  const days = new Map(previous.days.filter(day => day.date < today).map(day => [day.date, day]))
  for (const row of response.clones) {
    const date = row.timestamp?.slice(0, 10)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || !Number.isSafeInteger(row.count) || !Number.isSafeInteger(row.uniques) || row.uniques < 0 || row.count < row.uniques) throw new Error('Invalid daily traffic record')
    if (date >= today) continue
    days.set(date, { date, clones: row.count, uniques: row.uniques })
  }
  return { source: 'xmake-io/xmake-stats', updatedAt: now.toISOString(), days: [...days.values()].sort((a, b) => a.date.localeCompare(b.date)) }
}

async function main() {
  const token = process.env.XMAKE_STATS_TOKEN
  if (!token && process.argv.includes('--optional')) { console.log('Using saved usage statistics'); return }
  if (!token) throw new Error('Configure the XMAKE_STATS_TOKEN Actions secret with traffic access to xmake-io/xmake-stats')
  const file = resolve('docs/.vitepress/data/usage-stats.json')
  const previous = JSON.parse(await readFile(file, 'utf8'))
  const response = await fetch('https://api.github.com/repos/xmake-io/xmake-stats/traffic/clones?per=day', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) throw new Error(`GitHub traffic API returned ${response.status}; existing history preserved`)
  const next = mergeStats(previous, await response.json())
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(next, null, 2) + '\n')
  console.log(`Saved ${next.days.length} daily traffic records`)
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = process.argv.includes('--optional') ? 0 : 1 })
