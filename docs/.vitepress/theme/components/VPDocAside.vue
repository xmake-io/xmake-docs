<script setup lang="ts">
import VPDocAsideOutline from 'vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue'

</script>

<template>
  <div class="VPDocAside">
    <slot name="aside-top" />

    <slot name="aside-outline-before" />
    <VPDocAsideOutline />
    <slot name="aside-outline-after" />

    <div class="spacer" />

    <slot name="aside-bottom" />
  </div>
</template>

