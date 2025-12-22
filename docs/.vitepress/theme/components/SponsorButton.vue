<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: String,
  image: String
})

const show = ref(false)
</script>

<template>
  <span class="sponsor-trigger" @click="show = true">{{ text }}</span>
  
  <div v-if="show" class="sponsor-modal" @click="show = false">
    <div class="sponsor-content" @click.stop>
      <img :src="image" class="sponsor-image" />
    </div>
  </div>
</template>

<style scoped>
.sponsor-trigger {
  color: var(--vp-c-brand);
  cursor: pointer;
  font-weight: 500;
}
.sponsor-trigger:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}
.sponsor-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
}
.sponsor-content {
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
}
.sponsor-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  background-color: white;
  padding: 10px;
}
</style>
