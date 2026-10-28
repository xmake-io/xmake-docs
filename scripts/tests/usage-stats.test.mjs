import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergeStats } from '../collect-usage-stats.mjs'
test('retains older history and replaces overlapping days rather than adding counts', () => {
 const result = mergeStats({days:[{date:'2026-01-01',clones:5,uniques:3},{date:'2026-02-01',clones:2,uniques:1}]}, {clones:[{timestamp:'2026-02-01T00:00:00Z',count:4,uniques:2},{timestamp:'2026-02-03T00:00:00Z',count:8,uniques:5}]})
 assert.deepEqual(result.days.map(d=>[d.date,d.clones]),[['2026-01-01',5],['2026-02-01',4],['2026-02-03',8]])
})
test('rejects malformed payloads without modifying history', () => {
 const previous={days:[{date:'2026-01-01',clones:5,uniques:3}]}
 assert.throws(()=>mergeStats(previous,{message:'Forbidden'}))
 assert.throws(()=>mergeStats(previous,{clones:[{timestamp:'2026-02-01',count:1,uniques:3}]}))
 assert.equal(previous.days.length,1)
})
test('empty response retains history; absent dates are not fabricated as zero',()=>{
 const previous={days:[{date:'2026-01-01',clones:5,uniques:3}]}
 assert.deepEqual(mergeStats(previous,{clones:[]}).days,previous.days)
})

test('excludes current UTC day and refreshes yesterday on later collections', () => {
 const payload={clones:[{timestamp:'2026-02-02T00:00:00Z',count:20,uniques:5},{timestamp:'2026-02-03T00:00:00Z',count:3,uniques:2}]}
 const first=mergeStats({days:[]},payload,new Date('2026-02-03T04:23:00Z'))
 assert.deepEqual(first.days,[{date:'2026-02-02',clones:20,uniques:5}])
 payload.clones[1].count=30
 const next=mergeStats(first,payload,new Date('2026-02-04T04:23:00Z'))
 assert.equal(next.days[1].clones,30)
})
