<script setup lang="ts">
import { computed } from 'vue'
import StatsCards from './components/StatsCards.vue'
import YearlyTrendChart from './components/YearlyTrendChart.vue'
import PrayerTypeChart from './components/PrayerTypeChart.vue'
import TimeOfDayChart from './components/TimeOfDayChart.vue'
import CompletionGauge from './components/CompletionGauge.vue'
import HeatmapChart from './components/HeatmapChart.vue'
import StatsTable from './components/StatsTable.vue'
import BaseBox from '@/components/BaseBox.vue'
import { useDeviceStore } from '@/stores/device.store'
import { TypographyText, TypographyTitle } from 'ant-design-vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
const { isMobile } = storeToRefs(useDeviceStore())
const { user } = storeToRefs(useUserStore())
const yearInterval = computed(() => {
  const fromYear = user.value!.minPrayerDate
    ? new Date(user.value!.minPrayerDate).getFullYear()
    : new Date().getFullYear()
  const toYear = user.value!.maxPrayerDate
    ? new Date(user.value!.maxPrayerDate).getFullYear()
    : new Date().getFullYear()
  return { fromYear, toYear }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <BaseBox>
      <div class="flex justify-between items-center">
        <div>
          <TypographyTitle :level="2"> Qazo namozlar tahlili </TypographyTitle>
          <TypographyText type="secondary">
            {{ yearInterval.toYear - yearInterval.fromYear }} yillik qazo namoz ma'lumotlari tahlili
            ({{ yearInterval.fromYear }}-{{ yearInterval.toYear }})
          </TypographyText>
        </div>
        <div class="text-right" v-if="!isMobile">
          <TypographyTitle :level="5"> Davr </TypographyTitle>
          <TypographyText type="secondary">
            {{ yearInterval.fromYear }} - {{ yearInterval.toYear }}
          </TypographyText>
          <br />
        </div>
      </div>
    </BaseBox>

    <!-- Stats Cards -->
    <StatsCards />

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <YearlyTrendChart />
      </div>
      <PrayerTypeChart />
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- <MonthlyCompletionChart :prayer-data="prayerData" /> -->
      <CompletionGauge />
      <TimeOfDayChart class="col-span-2" />
    </div>
    <!-- Heatmap -->
    <HeatmapChart class="" />

    <!-- Table -->
    <StatsTable />
  </div>
</template>
