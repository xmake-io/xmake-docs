<template>
  <div class="xmake-build-art" aria-hidden="true">
    <svg viewBox="0 0 520 420" fill="none">
      <defs>
        <linearGradient id="xmake-glass-top" x1="-65" y1="0" x2="60" y2="70" gradientUnits="userSpaceOnUse">
          <stop class="glass-light" stop-opacity=".65" />
          <stop offset="1" class="glass-tint" stop-opacity=".28" />
        </linearGradient>
        <linearGradient id="xmake-glass-left" x1="-64" y1="37" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop class="glass-tint" stop-opacity=".34" />
          <stop offset="1" class="glass-shade" stop-opacity=".25" />
        </linearGradient>
        <linearGradient id="xmake-glass-right" x1="64" y1="37" x2="0" y2="130" gradientUnits="userSpaceOnUse">
          <stop class="glass-tint" stop-opacity=".23" />
          <stop offset="1" class="glass-shade" stop-opacity=".39" />
        </linearGradient>
        <filter id="xmake-soft-shadow" x="-50%" y="-120%" width="200%" height="340%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="xmake-soft-haze" x="-50%" y="-70%" width="200%" height="240%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <g id="xmake-glass-block" stroke-linejoin="round">
          <path d="M-64 37 0 74v57l-64-37Z" fill="url(#xmake-glass-left)" />
          <path d="M0 74 64 37v57L0 131Z" fill="url(#xmake-glass-right)" />
          <path d="M0 0 64 37 0 74-64 37Z" fill="url(#xmake-glass-top)" />
          <path d="m-64 37 64 37 64-37M0 74v57" class="glass-edge" />
          <path d="m-64 37 64-37 64 37v57L0 131l-64-37Z" class="glass-outline" />
        </g>
      </defs>

      <!-- A static assembly snapshot: the raised module is aligned with its seat. -->
      <ellipse cx="264" cy="245" rx="96" ry="63" class="haze" filter="url(#xmake-soft-haze)" />
      <g class="shadows" filter="url(#xmake-soft-shadow)">
        <ellipse cx="214" cy="293" rx="49" ry="13" />
        <ellipse cx="269" cy="326" rx="52" ry="15" />
      </g>
      <use href="#xmake-glass-block" transform="translate(210 180) scale(.85)" />
      <use href="#xmake-glass-block" transform="translate(264.4 211.45) scale(.85)" />
      <path d="m264.4 211.45 54.4 31.45-54.4 31.45-54.4-31.45Z" class="assembly-slot" />
      <path d="M210 204.9v38M318.8 204.9v38" class="assembly-guide" />
      <use href="#xmake-glass-block" transform="translate(264.4 125) scale(.85)" />

    </svg>
  </div>
</template>

<style scoped>
.xmake-build-art {
  position: relative;
  width: 100%;
  max-width: 520px;
  --glass-light: #effbf5;
  --glass-tint: #a2dbc5;
  --glass-shade: #71b49e;
  --glass-line: #87bca9;
}

svg { display: block; width: 100%; height: auto; }
.glass-light { stop-color: var(--glass-light); }
.glass-tint { stop-color: var(--glass-tint); }
.glass-shade { stop-color: var(--glass-shade); }
.glass-edge { stroke: #f2fff8; stroke-opacity: .75; stroke-width: 1; }
.glass-outline { stroke: var(--glass-line); stroke-opacity: .25; stroke-width: .7; }
.haze { fill: #83d8b8; fill-opacity: .12; }
.shadows { fill: #588d7c; fill-opacity: .16; }

.assembly-slot {
  stroke: var(--glass-line);
  stroke-opacity: .35;
  stroke-width: .8;
  stroke-dasharray: 3 5;
}
.assembly-guide {
  stroke: var(--glass-line);
  stroke-opacity: .25;
  stroke-width: .8;
  stroke-dasharray: 2 5;
}

:global(.dark .xmake-build-art) {
  --glass-light: #accfbd;
  --glass-tint: #79b99d;
  --glass-shade: #589a7f;
  --glass-line: #a7d3bc;
}
:global(.dark .xmake-build-art .glass-edge) { stroke: #c3e8d5; stroke-opacity: .3; }
:global(.dark .xmake-build-art .haze) { fill-opacity: .06; }
:global(.dark .xmake-build-art .shadows) { fill: #0b2117; fill-opacity: .4; }
</style>
