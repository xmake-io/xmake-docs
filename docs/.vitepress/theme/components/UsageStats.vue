<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import stats from '../../data/usage-stats.json'
const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const unit = ref('day')
const year = ref('all')
const month = ref('all')
const years = [...new Set(stats.days.map((d: any) => d.date.slice(0, 4)))].sort().reverse()
const today = new Date().toISOString().slice(0, 10)
const points = computed(() => {
 const groups = new Map<string, { date: string; clones: number; uniques: number; days: number }>()
 for (const d of stats.days as {date:string;clones:number;uniques:number}[]) {
  if (d.date >= today || (year.value !== 'all' && !d.date.startsWith(year.value)) || (unit.value === 'day' && month.value !== 'all' && d.date.slice(5,7) !== month.value)) continue
  const key = d.date.slice(0, unit.value === 'year' ? 4 : unit.value === 'month' ? 7 : 10)
  const p = groups.get(key) || {date:key,clones:0,uniques:0,days:0}
  p.clones += d.clones; p.uniques += d.uniques; p.days++; groups.set(key,p)
 }
 return [...groups.values()].map(p=>({...p,uniques:Math.round(p.uniques/p.days)}))
})
const metrics = computed(() => [
 {key:'uniques' as const, title:zh.value ? (unit.value==='day'?'每日 UV（估计）':'日均 UV（估计）') : (unit.value==='day'?'Daily users (estimated)':'Average daily users (estimated)')},
 {key:'clones' as const,title:zh.value?'项目构建记录':'Project build records'},
])
const max = (key: 'clones'|'uniques') => Math.max(1,...points.value.map(p=>p[key]))
const x = (i:number) => 42 + (points.value.length <= 1 ? 294 : i * 588 / (points.value.length-1))
const y = (value:number,key:'clones'|'uniques') => 180 - value/max(key)*150
function segments(key:'clones'|'uniques') {
 const segments:string[]=[]; let segment=''
 points.value.forEach((p,i)=>{
  const prev=points.value[i-1]
  const serial=(date:string)=>unit.value==='day'?Date.parse(date)/86400000:unit.value==='month'?Number(date.slice(0,4))*12+Number(date.slice(5)):Number(date)
  if(prev && serial(p.date)-serial(prev.date)>1){segments.push(segment);segment=''}
  segment+=`${segment?' L':'M'}${x(i)},${y(p[key],key)}`
 });if(segment)segments.push(segment);return segments
}
const stale = computed(()=>stats.updatedAt && Date.now()-Date.parse(stats.updatedAt)>3*86400000)
</script>
<template>
<section class="usage-stats">
 <div class="filters">
  <label>{{ zh?'按':'Group by' }} <select v-model="unit"><option value="day">{{ zh?'天':'Day' }}</option><option value="month">{{ zh?'月':'Month' }}</option><option value="year">{{ zh?'年':'Year' }}</option></select></label>
  <label>{{ zh?'年份':'Year' }} <select v-model="year"><option value="all">{{ zh?'全部':'All' }}</option><option v-for="v in years" :key="v">{{v}}</option></select></label>
  <label v-if="unit==='day'">{{ zh?'月份':'Month' }} <select v-model="month"><option value="all">{{zh?'全部':'All'}}</option><option v-for="m in 12" :key="m" :value="String(m).padStart(2,'0')">{{m}}</option></select></label>
 </div>
 <p v-if="!stats.days.length" class="muted">{{zh?'暂无统计数据。':'No statistics available yet.'}}</p>
 <p v-else-if="!points.length" class="muted">{{zh?'所选时间范围暂无完整日期的数据。':'No completed daily records in this period.'}}</p>
 <div v-else class="charts">
  <figure v-for="metric in metrics" :key="metric.key">
   <figcaption>{{metric.title}}</figcaption>
   <svg viewBox="0 0 650 215" role="img" :aria-label="metric.title">
    <title>{{metric.title}}</title>
    <path class="grid" d="M42 30H630 M42 105H630 M42 180H630"/>
    <text x="4" y="34">{{max(metric.key).toLocaleString()}}</text><text x="20" y="184">0</text>
    <path v-for="(path,i) in segments(metric.key)" :key="i" class="line" :d="path"/>
    <circle v-for="(p,i) in points" :key="p.date" :cx="x(i)" :cy="y(p[metric.key],metric.key)" r="3"><title>{{p.date}}: {{p[metric.key].toLocaleString()}} · {{p.days}} {{zh?'已采集天数':'recorded days'}}</title></circle>
    <text x="42" y="207">{{points[0].date}}</text><text v-if="points.length>1" x="630" y="207" text-anchor="end">{{points.at(-1)?.date}}</text>
   </svg>
  </figure>
 </div>
 <p v-if="stats.updatedAt" class="muted">{{zh?'更新于':'Updated'}} {{stats.updatedAt.slice(0,10)}} · UTC <span v-if="stale">· {{zh?'数据更新延迟':'Update delayed'}}</span></p>
 <p class="stats-note">{{zh?'基于 GitHub 对':'Estimated from GitHub clone statistics for the empty'}} <a href="https://github.com/xmake-io/xmake-stats">xmake-stats</a> {{zh?'空仓库的克隆统计估算，月／年 UV 为日均值。设置':'repository; monthly/yearly UV is a daily average. Set'}} <code>XMAKE_STATS=false</code> {{zh?'可禁用统计。':'to opt out.'}} <a :href="(zh?'/zh':'')+'/guide/extras/environment-variables.html#xmake-stats'">{{zh?'了解更多':'Learn more'}}</a></p>
 <details v-if="points.length"><summary>{{zh?'查看数据':'View data'}}</summary><div class="table-wrap"><table><thead><tr><th>{{zh?'日期':'Period'}}</th><th>{{metrics[0].title}}</th><th>{{metrics[1].title}}</th><th>{{zh?'已采集天数':'Recorded days'}}</th></tr></thead><tbody><tr v-for="p in points" :key="p.date"><td>{{p.date}}</td><td>{{p.uniques.toLocaleString()}}</td><td>{{p.clones.toLocaleString()}}</td><td>{{p.days}}</td></tr></tbody></table></div></details>
</section>
</template>
<style scoped>
.usage-stats { margin:24px 0 36px; }
.filters { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px; }
label { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--vp-c-text-2); }
select { border:1px solid var(--vp-c-divider); border-radius:6px; padding:5px 26px 5px 10px; background:var(--vp-c-bg-soft); color:var(--vp-c-text-1); }
figure { margin:0 0 16px; padding:16px; border:1px solid var(--vp-c-divider); border-radius:12px; background:var(--vp-c-bg-soft); }
figcaption { font-weight:600; font-size:15px; }
svg { display:block; width:100%; height:auto; overflow:visible; }
svg text { fill:var(--vp-c-text-2); font-size:12px; }
.grid { stroke:var(--vp-c-divider); fill:none; }
.line { stroke:var(--vp-c-brand-1); stroke-width:2; fill:none; stroke-linejoin:round; }
circle { fill:var(--vp-c-brand-1); }
.muted { color:var(--vp-c-text-2); font-size:13px; line-height:1.7; }
.stats-note { color:var(--vp-c-text-3); font-size:12px; line-height:1.6; }
.stats-note code { font-size:inherit; }
summary { cursor:pointer; color:var(--vp-c-brand-1); }
.table-wrap { overflow-x:auto; }
@media(max-width:640px) { figure { padding:10px 6px; } svg text { font-size:15px; } }
</style>
