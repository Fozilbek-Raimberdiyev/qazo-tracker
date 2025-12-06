<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { inject, computed } from 'vue'

interface Props {
  tabKey: string | number
}

const props = defineProps<Props>()

const activeKey = inject<any>('activeKey')

const isActive = computed(() => {
  return activeKey?.value === props.tabKey
})
</script>

<template>
  <div v-if="isActive" class="tab-pane">
    <slot />
  </div>
</template>

<style scoped>
.tab-pane {
  width: 100%;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
