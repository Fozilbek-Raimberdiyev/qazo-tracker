<script setup lang="ts">
import { provide, ref, watch } from 'vue'

interface TabItem {
  key: string | number
  label: string
}

interface Props {
  items: TabItem[]
  modelValue?: string | number
  defaultValue?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeKey = ref(props.modelValue || props.defaultValue || props.items[0]?.key || '')

// Provide active key to TabPane children
provide('activeKey', activeKey)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    activeKey.value = newValue
  }
})

const handleTabClick = (key: string | number) => {
  activeKey.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

const isActive = (key: string | number) => {
  return activeKey.value === key
}
</script>

<template>
  <div class="segmented-tabs">
    <!-- Tab Headers -->
    <div class="segmented-control">
      <button
        v-for="tab in items"
        :key="tab.key"
        :class="['segmented-item', { active: isActive(tab.key) }]"
        @click="handleTabClick(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="segmented-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.segmented-tabs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  width: fit-content;
}

:global(.dark) .segmented-control {
  background-color: #1f2937;
}

.segmented-item {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.segmented-item:hover {
  color: #374151;
}

:global(.dark) .segmented-item {
  color: #9ca3af;
}

:global(.dark) .segmented-item:hover {
  color: #d1d5db;
}

.segmented-item.active {
  color: #111827;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:global(.dark .segmented-item.active)  {
  color: #f9fafb;
  background-color: #374151;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
}

.segmented-content {
  width: 100%;
}
</style>
