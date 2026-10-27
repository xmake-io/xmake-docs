// One Carbon script and one ad node per application. Slots keep their existing
// positions; only the visible desktop slot may own or refresh the shared ad.
interface CarbonSlotOptions { code: string; placement: string; path: string; minWidth: number }
interface Slot { element: HTMLElement; options: CarbonSlotOptions; minHeight: string }
const slots = new Set<Slot>()
let host: HTMLDivElement | undefined
let parking: HTMLDivElement | undefined
let owner: Slot | undefined
let requested = false
let loading = false
let lastPath = ''
let timer: ReturnType<typeof setTimeout> | undefined
let observer: ResizeObserver | undefined
let listening = false
const normalize = (path: string) => path.split(/[?#]/)[0].replace(/\/$/, '') || '/'

function visible(slot: Slot) {
  if (document.visibilityState === 'hidden' || window.innerWidth < slot.options.minWidth || !slot.element.isConnected) return false
  const rect = slot.element.getBoundingClientRect()
  if (rect.width <= 0 || rect.right <= 0 || rect.left >= window.innerWidth) return false
  for (let el: HTMLElement | null = slot.element; el; el = el.parentElement) {
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || Number(style.opacity) === 0) return false
  }
  return true
}
function reserve(slot: Slot) {
  const height = slot.element.getBoundingClientRect().height
  if (height > 0) slot.element.style.minHeight = `${Math.ceil(height)}px`
}
function park() {
  if (!host) return
  if (!parking) {
    parking = document.createElement('div')
    parking.hidden = true
    parking.dataset.carbonParking = ''
    document.body.appendChild(parking)
  }
  parking.appendChild(host)
  owner = undefined
}
function reconcile() {
  timer = undefined
  const slot = owner && slots.has(owner) && visible(owner) ? owner : [...slots].find(visible)
  if (!slot) { park(); return }
  if (!host) { host = document.createElement('div'); host.dataset.carbonHost = '' }
  if (owner !== slot) {
    slot.element.appendChild(host)
    owner = slot
  }
  const path = normalize(slot.options.path)
  if (!requested) {
    // Preserve an existing provider node if another entry point loaded it first.
    const existing = document.getElementById('_carbonads_js') as HTMLScriptElement | null
    const script = existing || document.createElement('script')
    const ad = document.getElementById('carbonads')
    if (ad && !host.contains(ad)) host.appendChild(ad)
    requested = true
    lastPath = path
    loading = !existing || !(window as CarbonWindow)._carbonads
    script.addEventListener('load', () => { loading = false; schedule() }, { once: true })
    script.addEventListener('error', () => { loading = false }, { once: true })
    if (!existing) {
      script.id = '_carbonads_js'
      script.src = `https://cdn.carbonads.com/carbon.js?serve=${encodeURIComponent(slot.options.code)}&placement=${encodeURIComponent(slot.options.placement)}`
      script.async = true
    }
    host.appendChild(script)
    return
  }
  if (loading || path === lastPath) return
  const api = (window as CarbonWindow)._carbonads
  if (!api?.refresh) return
  reserve(slot)
  try {
    api.refresh()
    lastPath = path
  } catch {
    // A provider failure must not break navigation or remove the current ad.
  }
}
type CarbonWindow = Window & { _carbonads?: { refresh: () => void } }
function schedule() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(reconcile, 250)
}
export function registerCarbonSlot(element: HTMLElement, options: CarbonSlotOptions) {
  const slot: Slot = { element, options: { ...options }, minHeight: element.style.minHeight }
  slots.add(slot)
  if (!listening) {
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', schedule)
    listening = true
  }
  if (typeof ResizeObserver !== 'undefined') {
    observer ||= new ResizeObserver(schedule)
    observer.observe(element)
  }
  if (!requested) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(reconcile, 0)
  } else schedule()
  return {
    update(path: string) {
      if (normalize(path) === normalize(slot.options.path)) return
      slot.options.path = path
      schedule()
    },
    dispose() {
      slots.delete(slot)
      observer?.unobserve(element)
      if (owner === slot) park()
      element.style.minHeight = slot.minHeight
      schedule()
      if (!slots.size) {
        window.removeEventListener('resize', schedule)
        document.removeEventListener('visibilitychange', schedule)
        observer?.disconnect()
        observer = undefined
        listening = false
      }
    },
  }
}
