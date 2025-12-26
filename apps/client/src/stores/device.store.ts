import { useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
export const useDeviceStore = defineStore('device', () => {
  const { width, height } = useWindowSize()
  const isMobile = computed(() => width.value < 768)
  return {
    width,
    height,
    isMobile,
  }
})
