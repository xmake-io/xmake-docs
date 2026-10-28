<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import stats from '../../data/usage-stats.json'
const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const selectedMetric = ref<'uniques'|'clones'>('uniques')
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
 {key:'uniques' as const, title:zh.value ? (unit.value==='day'?'每日用户数':'日均用户数') : (unit.value==='day'?'Daily users':'Average daily users')},
 {key:'clones' as const,title:zh.value?(unit.value==='day'?'每日项目数':'项目数（累计）'):(unit.value==='day'?'Daily projects':'Projects (summed daily)')},
])
const activeMetric = computed(() => metrics.value.find(metric => metric.key === selectedMetric.value)!)
const maximum = computed(() => Math.max(1,...points.value.map(p=>p[selectedMetric.value])))
const x = (i:number) => 42 + (points.value.length <= 1 ? 294 : i * 588 / (points.value.length-1))
const y = (value:number) => 180 - value/maximum.value*150
function segments(key:'clones'|'uniques') {
 const segments:string[]=[]; let segment=''
 points.value.forEach((p,i)=>{
  const prev=points.value[i-1]
  const serial=(date:string)=>unit.value==='day'?Date.parse(date)/86400000:unit.value==='month'?Number(date.slice(0,4))*12+Number(date.slice(5)):Number(date)
  if(prev && serial(p.date)-serial(prev.date)>1){segments.push(segment);segment=''}
  segment+=`${segment?' L':'M'}${x(i)},${y(p[key])}`
 });if(segment)segments.push(segment);return segments
}
const stale = computed(()=>stats.updatedAt && Date.now()-Date.parse(stats.updatedAt)>3*86400000)
</script>
<template>
<section class="usage-stats">
 <figure>
  <div class="chart-toolbar">
   <div class="metric-switch" role="group" :aria-label="zh?'统计指标':'Metric'"><button v-for="metric in metrics" :key="metric.key" type="button" :class="'series-'+metric.key" :aria-pressed="selectedMetric === metric.key" @click="selectedMetric = metric.key">{{metric.title}}</button></div>
   <div class="filters">
    <select v-model="unit" :aria-label="zh?'统计周期':'Group by'"><option value="day">{{zh?'按天':'Daily'}}</option><option value="month">{{zh?'按月':'Monthly'}}</option><option value="year">{{zh?'按年':'Yearly'}}</option></select>
    <select v-model="year" :aria-label="zh?'年份':'Year'"><option value="all">{{zh?'全部年份':'All years'}}</option><option v-for="v in years" :key="v">{{v}}</option></select>
    <select v-if="unit==='day'" v-model="month" :aria-label="zh?'月份':'Month'"><option value="all">{{zh?'全部月份':'All months'}}</option><option v-for="m in 12" :key="m" :value="String(m).padStart(2,'0')">{{zh?m+'月':new Date(2000,m-1).toLocaleString('en',{month:'short'})}}</option></select>
   </div>
  </div>
  <p v-if="!stats.days.length" class="empty muted">{{zh?'暂无统计数据。':'No statistics available yet.'}}</p>
  <p v-else-if="!points.length" class="empty muted">{{zh?'所选时间范围暂无完整日期的数据。':'No completed daily records in this period.'}}</p>
  <svg v-else viewBox="0 0 650 215" role="img" :aria-label="activeMetric.title">
   <title>{{activeMetric.title}}</title>
   <path class="grid" d="M42 30H630 M42 105H630 M42 180H630"/>
   <text x="4" y="24">{{maximum.toLocaleString()}}</text><text x="20" y="184">0</text>
   <g :class="'series-'+activeMetric.key">
    <path v-for="(path,i) in segments(activeMetric.key)" :key="i" class="line" :d="path"/>
    <circle v-for="(p,i) in points" :key="p.date" :cx="x(i)" :cy="y(p[activeMetric.key])" r="3"><title>{{p.date}} · {{activeMetric.title}}: {{p[activeMetric.key].toLocaleString()}}</title></circle>
   </g>
   <text x="42" y="207">{{points[0].date}}</text><text v-if="points.length>1" x="630" y="207" text-anchor="end">{{points.at(-1)?.date}}</text>
  </svg>
 </figure>
 <p v-if="stats.updatedAt" class="muted">{{zh?'更新于':'Updated'}} {{stats.updatedAt.slice(0,10)}} · UTC <span v-if="stale">· {{zh?'数据更新延迟':'Update delayed'}}</span></p>
 <p class="stats-note">{{zh?'基于 GitHub 对':'Estimated from GitHub clone statistics for the empty'}} <a href="https://github.com/xmake-io/xmake-stats">xmake-stats</a> {{zh?'空仓库的克隆统计估算，月／年用户数为日均值。设置':'repository; monthly/yearly users are daily averages. Set'}} <code>XMAKE_STATS=false</code> {{zh?'可禁用统计。':'to opt out.'}} <a :href="(zh?'/zh':'')+'/guide/extras/environment-variables.html#xmake-stats'">{{zh?'了解更多':'Learn more'}}</a></p>

</section>
</template>
<style scoped>
.usage-stats { margin:24px 0 36px; }
.chart-toolbar { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px; }
.filters { display:flex; flex-wrap:wrap; gap:6px; }
.metric-switch { display:flex; flex-wrap:wrap; gap:4px; padding:3px; border:1px solid var(--vp-c-divider); border-radius:8px; }
.metric-switch button { padding:6px 10px; border-radius:5px; font-size:12px; color:var(--vp-c-text-2); cursor:pointer; }
.metric-switch button[aria-pressed="true"] { background:var(--vp-c-bg); color:var(--series-color); box-shadow:0 1px 3px #00000012; }
.metric-switch button:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:2px; }
.series-uniques { --series-color:var(--vp-c-brand-1); }
.series-clones { --series-color:#527eb8; }
:global(.dark) .series-clones { --series-color:#8eafe1; }
.series-clones .line { stroke-dasharray:5 3; }
.empty { padding:32px 0; text-align:center; }
label { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--vp-c-text-2); }
select { border:1px solid var(--vp-c-divider); border-radius:6px; padding:5px 26px 5px 10px; background:var(--vp-c-bg); color:var(--vp-c-text-2); font-size:12px; cursor:pointer; }
figure { margin:0 0 16px; padding:16px; border:1px solid var(--vp-c-divider); border-radius:12px; background:var(--vp-c-bg-soft); }
figcaption { font-weight:600; font-size:15px; }
svg { display:block; width:100%; height:auto; overflow:visible; }
svg text { fill:var(--vp-c-text-2); font-size:12px; }
.grid { stroke:var(--vp-c-divider); fill:none; }
.line { stroke:var(--series-color); stroke-width:2; fill:none; stroke-linejoin:round; }
circle { fill:var(--series-color); }
.muted { color:var(--vp-c-text-2); font-size:13px; line-height:1.7; }
.stats-note { color:var(--vp-c-text-3); font-size:12px; line-height:1.6; }
.stats-note code { font-size:inherit; }
@media(max-width:640px) { figure { padding:12px; } .chart-toolbar { gap:10px; } .filters { width:100%; } select { flex:1; min-width:0; padding:6px 16px 6px 5px; font-size:11px; } svg text { font-size:24px; } }
</style>
