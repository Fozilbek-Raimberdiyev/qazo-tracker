<script setup lang="ts">
import { storeToRefs } from 'pinia'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CircleProgressBar } from 'circle-progress.vue'
import { useThemeStore } from '@/stores/theme'
import { watch } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer.vue'
const { primaryColor } = storeToRefs(useThemeStore())
const model = defineModel<boolean>('visible')
interface Props {
  componentMode: 'modal' | 'plain',
  monthlyProgress: number
  data ?: any
}

const { componentMode } = defineProps<Props>()

watch(
  () => componentMode,
  (newVal) => {
    if (newVal === 'plain') {
      model.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <component height="70%" placement="bottom" :is="componentMode === 'modal' ? BaseDrawer : 'div'" v-model="model" title="Oylik samaradorlik">
    <h3 class="text-lg font-bold text-gray-900 dark:text-white" v-if="componentMode==='plain'">Oylik samaradorlik</h3>
    <div class="mt-4 flex flex-col gap-6">
      <div class="flex items-center justify-between">
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
              >O'qilgan: <span class="font-bold">{{ data?.completedCount }}</span></span
            >
          </div>
          <div class="flex items-center gap-2">
            <span class="size-3 rounded-full bg-red-500"></span>
            <span class="text-sm text-gray-500"
              >O'qilmagan: <span class="font-bold">{{ data?.uncompletedCount }}</span></span
            >
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Jami namozlar: <span class="">{{ data?.totalPrayers }}</span>
          </p>
        </div>
      </div>
      <div class="space-y-4 pt-4 border-t border-white/10">
        <h4 class="text-sm font-semibold mb-2">Namoz turlari</h4>
        <div v-for="(item, index) in data?.countsByType" :key="index">
          <div class="flex justify-between text-xs mb-1">
            <span class="text-gray-400 flex items-center gap-1"
              ><span class="material-symbols-outlined text-[14px]">{{ item.prayerType.icon }}</span>
              {{ item.prayerType.name_uz }}
            </span>

            <span class="dark:text-white"
              >{{ Math.floor((item.completed / item.total) * 100) }} %</span
            >
          </div>
          <div class="w-full dark:bg-gray-700 bg-gray-200 rounded-full h-1.5">
            <div
              class="bg-primary h-1.5 rounded-full"
              :style="{ width: `${Math.floor((item.completed / item.total) * 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
