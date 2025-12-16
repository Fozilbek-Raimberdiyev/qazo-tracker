<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { TableColumnProps } from 'ant-design-vue'
import { Popover, Tooltip } from 'ant-design-vue'
// import BaseIcon from '../BaseIcon.vue'

interface Item {
  key: string
  label: string
  icon: string
  visible?: boolean
  onClick: (record?: any, column?: TableColumnProps) => void
}

const props = withDefaults(
  defineProps<{
    items: Item[]
    record: Record<string, any>
    column: TableColumnProps
  }>(),
  {},
)
</script>

<template>
  <!-- More than 4 actions → show Popover -->
  <Popover v-if="items.length > 4" trigger="click" placement="left" class="relative">
    <template #content>
      <div class="flex flex-col gap-2">
        <div
          v-for="item in props.items.filter((i) => i.visible !== false)"
          :key="item.key"
          class="flex gap-2 items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
          @click="item.onClick(record, column)"
        >
          <span class="material-symbols-outlined"> {{ item.icon }} </span>
          <span class="text-sm text-gray-800">{{ item.label }}</span>
        </div>
      </div>
    </template>

    <button class="h-5 w-5 flex items-center justify-center cursor-pointer">
      <!-- 3 dots icon -->
      <svg xmlns="http://www.w3.org/2000/svg" width="3" height="11" viewBox="0 0 3 11" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.666016 1.04167C0.666016 0.46637 1.13239 0 1.70768 0C2.28298 0 2.74935 0.46637 2.74935 1.04167C2.74935 1.61696 2.28298 2.08333 1.70768 2.08333C1.13239 2.08333 0.666016 1.61696 0.666016 1.04167ZM0.666016 5.20833C0.666016 4.63304 1.13239 4.16667 1.70768 4.16667C2.28298 4.16667 2.74935 4.63304 2.74935 5.20833C2.74935 5.78363 2.28298 6.25 1.70768 6.25C1.13239 6.25 0.666016 5.78363 0.666016 5.20833ZM1.70768 8.33333C1.13239 8.33333 0.666016 8.7997 0.666016 9.375C0.666016 9.9503 1.13239 10.4167 1.70768 10.4167C2.28298 10.4167 2.74935 9.9503 2.74935 9.375C2.74935 8.7997 2.28298 8.33333 1.70768 8.33333Z"
          fill="#181818"
        />
      </svg>
    </button>
  </Popover>

  <!-- ≤ 4 actions → show inline with Tooltip -->
  <div v-else class="flex gap-1">
    <Tooltip
      v-for="item in props.items.filter((i) => i.visible !== false)"
      :key="item.key"
      :title="item.label"
      placement="top"
    >
      <div
        class="bg-[#F8F8F9] p-2 rounded-sm cursor-pointer hover:bg-gray-100"
        @click="item.onClick(record, column)"
      >
        <BaseIcon :name="item.icon" />
      </div>
    </Tooltip>
  </div>
</template>

<style scoped>
:global(.ant-popover) {
  z-index: 10 !important;
}
</style>
