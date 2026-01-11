<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CircleProgressBar } from 'circle-progress.vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer.vue'
const model = defineModel<boolean>('visible')
const { primaryColor } = storeToRefs(useThemeStore())
interface Props {
  componentMode: 'modal' | 'plain'
  stats: any
  monthlyProgress: number
}

const { stats, monthlyProgress } = defineProps<Props>()
</script>

<template>
  <component  height="70%" placement="bottom" :is="componentMode === 'modal' ? BaseDrawer : 'div'" v-model="model" title="Oylik samaradorlik">
    <h3 v-if="componentMode === 'plain'" class="text-lg font-bold text-gray-900 dark:text-white">
      Oylik samaradorlik
    </h3>
    <div class="mt-4 flex flex-col gap-6">
      <div class="flex items-center justify-between gap-2">
        <div class="">
          <CircleProgressBar :max="100" :color-unfilled="primaryColor" :value="monthlyProgress">
            <span class="text-xl font-bold text-gray-500 dark:text-white"
              >{{ monthlyProgress }}%</span
            >
          </CircleProgressBar>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="size-3 rounded-full bg-primary"></span>
            <span class="text-sm text-gray-500"
              >Tutilgan: <span class="font-bold">{{ stats?.completedCount }}</span></span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="size-3 rounded-full bg-red-500"></span>
            <span class="text-sm text-gray-500"
              >Tutilmagan: <span class="font-bold">{{ stats?.uncompletedCount }}</span></span
            >
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Jami ro'zalar: <span class="">{{ stats?.totalCount }}</span>
          </p>
        </div>
      </div>
    </div>
  </component>
</template>
