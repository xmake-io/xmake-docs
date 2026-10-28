<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useData } from 'vitepress'
import stats from '../../data/usage-stats.json'
const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const selectedMetric = ref<'uniques'|'clones'>('uniques')
const unit = ref('day')
const year = ref('all')
const month = ref('all')
const filtersOpen = ref(false)
const filterRoot = ref<HTMLElement>()
const filterButton = ref<HTMLButtonElement>()
const units = computed(() => [
 { value:'day', label:zh.value?'按天':'Daily' },
 { value:'month', label:zh.value?'按月':'Monthly' },
 { value:'year', label:zh.value?'按年':'Yearly' },
])
const filterLabel = computed(() => [units.value.find(u=>u.value===unit.value)?.label,
 year.value==='all'?(zh.value?'全部时间':'All time'):year.value,
 unit.value==='day' && month.value!=='all' ? (zh.value?Number(month.value)+'月':month.value) : '',
].filter(Boolean).join(' · '))
function outsideFilter(event: PointerEvent) {
 if (filterRoot.value && !filterRoot.value.contains(event.target as Node)) filtersOpen.value = false
}
function closeFilters() { filtersOpen.value = false; filterButton.value?.focus() }
onMounted(() => document.addEventListener('pointerdown', outsideFilter))
onBeforeUnmount(() => document.removeEventListener('pointerdown', outsideFilter))
const years = [...new Set(stats.days.map((d: any) => d.date.slice(0, 4)))].sort().reverse()
const today = new Date().toISOString().slice(0, 10)
const dailyAverage = computed(() => {
 const cutoff = new Date(Date.parse(today) - 30 * 86400000).toISOString().slice(0, 10)
 const days = (stats.days as {date:string;clones:number;uniques:number}[])
  .filter(day => day.date >= cutoff && day.date < today)
 if (!days.length) return null
 return {
  uniques: Math.round(days.reduce((sum, day) => sum + day.uniques, 0) / days.length),
  clones: Math.round(days.reduce((sum, day) => sum + day.clones, 0) / days.length),
 }
})
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
const plotWidth = ref(650)
const plotSpan = computed(() => plotWidth.value - 62)
const x = (i:number) => 42 + (points.value.length <= 1 ? plotSpan.value / 2 : i * plotSpan.value / (points.value.length-1))
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
const hovered = ref<number | null>(null)
const plot = ref<SVGSVGElement>()
let plotObserver: ResizeObserver | undefined
watch(plot, element => {
 plotObserver?.disconnect()
 if (!element) return
 const resize = () => { plotWidth.value = Math.max(220, element.getBoundingClientRect().width) }
 resize()
 plotObserver = new ResizeObserver(resize)
 plotObserver.observe(element)
}, { flush:'post' })
onBeforeUnmount(() => plotObserver?.disconnect())
const hoveredPoint = computed(() => hovered.value === null ? null : points.value[hovered.value])
const tooltipLeft = computed(() => {
 const position = x(hovered.value ?? 0) / plotWidth.value * 100
 return Math.max(25, Math.min(75, position))
})
function inspectPoint(event: PointerEvent) {
 if (!plot.value || !points.value.length) return
 const matrix = plot.value.getScreenCTM()
 if (!matrix) return
 const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse())
 hovered.value = points.value.length === 1 ? 0 : Math.max(0, Math.min(points.value.length - 1, Math.round((point.x - 42) / plotSpan.value * (points.value.length - 1))))
}
watch([points, selectedMetric], () => { hovered.value = null })
const stale = computed(()=>stats.updatedAt && Date.now()-Date.parse(stats.updatedAt)>3*86400000)
</script>
<template>
<section class="usage-stats">
 <p v-if="dailyAverage" class="usage-summary">{{zh?'平均每天约有 ':'On average, about '}}<strong>{{dailyAverage.uniques.toLocaleString()}}</strong>{{zh?' 位用户、':' users and '}}<strong>{{dailyAverage.clones.toLocaleString()}}</strong>{{zh?' 个项目在使用 Xmake。':' projects use Xmake each day.'}}</p>
 <figure>
  <div class="chart-toolbar">
   <div class="metric-switch" role="group" :aria-label="zh?'统计指标':'Metric'"><button v-for="metric in metrics" :key="metric.key" type="button" :class="'series-'+metric.key" :aria-pressed="selectedMetric === metric.key" @click="selectedMetric = metric.key"><span class="full-label">{{metric.title}}</span><span class="short-label">{{metric.key==='uniques'?(zh?'用户数':'Users'):(zh?'项目数':'Projects')}}</span></button></div>
   <div ref="filterRoot" class="filters" @keydown.esc.stop.prevent="closeFilters" @focusout="event => { if (!filterRoot?.contains(event.relatedTarget as Node)) filtersOpen = false }">
    <button ref="filterButton" class="filter-trigger" type="button" :aria-expanded="filtersOpen" @click="filtersOpen = !filtersOpen">
     <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 4h12M4 8h8M6 12h4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
     <span class="full-label">{{filterLabel}}</span><span class="short-label">{{units.find(u=>u.value===unit)?.label}}</span><span aria-hidden="true">⌄</span>
    </button>
    <div v-if="filtersOpen" class="filter-panel" role="group" :aria-label="zh?'时间筛选':'Date filters'">
     <div class="filter-options" role="group" :aria-label="zh?'统计周期':'Group by'"><button v-for="u in units" :key="u.value" type="button" :aria-pressed="unit===u.value" @click="unit=u.value">{{u.label}}</button></div>
     <span class="filter-label">{{zh?'年份':'Year'}}</span>
     <div class="filter-options year-options"><button type="button" :aria-pressed="year==='all'" @click="year='all'">{{zh?'全部':'All'}}</button><button v-for="v in years" :key="v" type="button" :aria-pressed="year===v" @click="year=v">{{v}}</button></div>
     <template v-if="unit==='day'">
      <span class="filter-label">{{zh?'月份':'Month'}}</span>
      <div class="filter-options month-options"><button type="button" :aria-pressed="month==='all'" @click="month='all'">{{zh?'全部':'All'}}</button><button v-for="m in 12" :key="m" type="button" :aria-pressed="month===String(m).padStart(2,'0')" @click="month=String(m).padStart(2,'0')">{{zh?m+'月':new Date(2000,m-1).toLocaleString('en',{month:'short'})}}</button></div>
     </template>
     <button type="button" class="filter-done" @click="closeFilters">{{zh?'完成':'Done'}}</button>
    </div>
   </div>
  </div>
  <p v-if="!stats.days.length" class="empty muted">{{zh?'暂无统计数据。':'No statistics available yet.'}}</p>
  <p v-else-if="!points.length" class="empty muted">{{zh?'所选时间范围暂无完整日期的数据。':'No completed daily records in this period.'}}</p>
  <div v-else class="plot" @pointerleave="hovered = null">
  <svg ref="plot" @pointermove="inspectPoint" @pointerdown="inspectPoint" :viewBox="`0 0 ${plotWidth} 215`" role="img" :aria-label="activeMetric.title">
   <title>{{activeMetric.title}}</title>
   <path class="grid" :d="`M42 30H${plotWidth-20} M42 105H${plotWidth-20} M42 180H${plotWidth-20}`"/>
   <text x="4" y="24">{{maximum.toLocaleString()}}</text><text x="20" y="184">0</text>
   <g :class="'series-'+activeMetric.key">
    <path v-for="(path,i) in segments(activeMetric.key)" :key="i" class="line" :d="path"/>
    <circle v-for="(p,i) in points" :key="p.date" :cx="x(i)" :cy="y(p[activeMetric.key])" r="3"><title>{{p.date}} · {{activeMetric.title}}: {{p[activeMetric.key].toLocaleString()}}</title></circle>
   </g>
   <g v-if="hoveredPoint && hovered !== null" class="plot-cursor" :class="'series-'+activeMetric.key" aria-hidden="true">
    <line :x1="x(hovered)" :x2="x(hovered)" y1="30" y2="180" />
    <circle :cx="x(hovered)" :cy="y(hoveredPoint[activeMetric.key])" r="5" />
   </g>
   <text x="42" y="207">{{points[0].date}}</text><text v-if="points.length>1" :x="plotWidth-20" y="207" text-anchor="end">{{points.at(-1)?.date}}</text>
  </svg>
  <div v-if="hoveredPoint" class="plot-tooltip" :style="{ left: tooltipLeft + '%' }" role="status">
   <strong>{{hoveredPoint.date}}</strong>
   <span>{{activeMetric.title}}：{{hoveredPoint[activeMetric.key].toLocaleString()}}</span>
  </div>
  </div>
 </figure>
 <p v-if="stats.updatedAt" class="muted">{{zh?'更新于':'Updated'}} {{stats.updatedAt.slice(0,10)}} · UTC <span v-if="stale">· {{zh?'数据更新延迟':'Update delayed'}}</span></p>
 <p class="stats-note">{{zh?'基于 GitHub 对':'Estimated from GitHub clone statistics for the empty'}} <a href="https://github.com/xmake-io/xmake-stats">xmake-stats</a> {{zh?'空仓库的克隆统计估算，月／年用户数为日均值。设置':'repository; monthly/yearly users are daily averages. Set'}} <code>XMAKE_STATS=false</code> {{zh?'可禁用统计。':'to opt out.'}} <a :href="(zh?'/zh':'')+'/guide/extras/environment-variables.html#xmake-stats'">{{zh?'了解更多':'Learn more'}}</a></p>

</section>
</template>
<style scoped>
.usage-stats { margin:24px 0 36px; }
.usage-summary { font-size:12px; line-height:1.7; color:var(--vp-c-text-2); }
.usage-summary strong { color:var(--vp-c-brand-1); font-weight:700; font-size:inherit; font-variant-numeric:tabular-nums; }
.chart-toolbar { display:flex; flex-wrap:nowrap; align-items:center; justify-content:space-between; gap:8px; margin-bottom:12px; }
.filters { position:relative; }
.filter-trigger { display:flex; align-items:center; gap:6px; padding:3px 8px; min-height:32px; line-height:20px; white-space:nowrap; border-radius:7px; background:var(--vp-c-bg-alt); font-size:12px; color:var(--vp-c-text-2); cursor:pointer; }
.filter-trigger:hover, .filter-trigger[aria-expanded="true"] { background:var(--vp-c-bg); color:var(--vp-c-brand-1); }
.filter-trigger svg { width:14px; height:14px; flex:none; }
.filter-panel { position:absolute; z-index:5; top:calc(100% + 6px); right:0; width:260px; max-width:calc(100vw - 72px); padding:12px; border:1px solid var(--vp-c-divider); border-radius:10px; background:var(--vp-c-bg); box-shadow:var(--vp-shadow-2); }
.filter-options { display:flex; flex-wrap:wrap; gap:4px; }
.filter-options button { padding:5px 9px; border-radius:5px; font-size:12px; cursor:pointer; color:var(--vp-c-text-2); }
.filter-options button:hover { background:var(--vp-c-bg-soft); }
.filter-options button[aria-pressed="true"] { background:var(--vp-c-brand-soft); color:var(--vp-c-brand-1); }
.filter-label { display:block; margin:10px 0 4px; font-size:11px; color:var(--vp-c-text-3); }
.year-options { max-height:100px; overflow-y:auto; }
.month-options { display:grid; grid-template-columns:repeat(4,1fr); }
.filter-done { display:block; margin:10px 0 0 auto; font-size:12px; color:var(--vp-c-brand-1); cursor:pointer; padding:4px 8px; }
.filters button:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:2px; }
:global(.vp-doc h2#user-statistics) { border-top:0; padding-top:0; }
:global(.vp-doc h2#user-statistics .header-anchor) { top:0; }
.metric-switch { display:flex; flex-wrap:nowrap; gap:2px; padding:2px; border-radius:7px; background:var(--vp-c-bg-alt); min-width:0; }
.metric-switch button { padding:3px 8px; min-height:28px; line-height:20px; white-space:nowrap; border-radius:5px; font-size:12px; color:var(--vp-c-text-2); cursor:pointer; }
.metric-switch button[aria-pressed="true"] { background:var(--vp-c-bg); color:var(--series-color); box-shadow:0 1px 3px #00000012; }
.metric-switch button:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:2px; }
.series-uniques { --series-color:var(--vp-c-brand-1); }
.series-clones { --series-color:#527eb8; }
:global(.dark) .series-clones { --series-color:#8eafe1; }
.series-clones .line { stroke-dasharray:5 3; }
.empty { padding:32px 0; text-align:center; }
label { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--vp-c-text-2); }
figure { margin:0 0 16px; padding:16px; border:1px solid var(--vp-c-divider); border-radius:12px; background:var(--vp-c-bg-soft); }
figcaption { font-weight:600; font-size:15px; }
svg { display:block; width:100%; height:auto; overflow:visible; }
svg text { fill:var(--vp-c-text-2); font-size:12px; }
.plot { position:relative; touch-action:pan-y; }
.plot-tooltip { position:absolute; top:0; transform:translateX(-50%); pointer-events:none; padding:8px 12px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg); box-shadow:0 4px 16px #00000014; font-size:12px; line-height:1.6; white-space:normal; width:max-content; max-width:calc(100% - 16px); color:var(--vp-c-text-1); }
.plot-tooltip strong, .plot-tooltip span { display:block; }
.plot-cursor { pointer-events:none; }
.plot-cursor line { stroke:var(--vp-c-text-3); stroke-dasharray:3 3; }
.plot-cursor circle { stroke:var(--vp-c-bg); stroke-width:2; }
.grid { stroke:var(--vp-c-divider); fill:none; }
.line { stroke:var(--series-color); stroke-width:2; fill:none; stroke-linejoin:round; }
circle { fill:var(--series-color); }
.muted { color:var(--vp-c-text-2); font-size:13px; line-height:1.7; }
.stats-note { color:var(--vp-c-text-3); font-size:12px; line-height:1.6; }
.stats-note code { font-size:inherit; }
.short-label { display:none; }
@media(max-width:640px) {
 .plot-tooltip { left:50% !important; }
 figure { padding:12px; }
 .chart-toolbar { gap:6px; }
 .filters { margin-left:auto; flex:none; }
 .full-label { display:none; }
 .short-label { display:inline; }
 .filter-trigger, .metric-switch button { font-size:12px; }
 .filter-trigger { padding:3px 8px; }
 svg text { font-size:11px; }
}
</style>
