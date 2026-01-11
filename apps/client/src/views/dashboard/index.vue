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
import { Empty, TypographyText, TypographyTitle } from 'ant-design-vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { useRouteQuery } from '@vueuse/router'
import BaseTab from '@/components/BaseTab/BaseTab.vue'
import Fasting from './fasting.vue'
const { isMobile } = storeToRefs(useDeviceStore())
const { user } = storeToRefs(useUserStore())
enum Mode {
  Prayer = 'prayer',
  Fast = 'fast',
}
const dashboardMode = useRouteQuery<Mode>('mode', Mode.Prayer)
const yearInterval = computed(() => {
  const fromYear = user.value!.minPrayerDate
    ? new Date(user.value!.minPrayerDate).getFullYear()
    : new Date().getFullYear()
  const toYear = user.value!.maxPrayerDate
    ? new Date(user.value!.maxPrayerDate).getFullYear()
    : new Date().getFullYear()
  return { fromYear, toYear }
})

const modes = computed(() => {
  return [
    { key: Mode.Prayer, label: 'Qazo namozlar tahlili', visible: user.value?.hasQazoPrayers },
    {
      key: Mode.Fast,
      label: 'Qazo ro`zalar tahlili',
      visible: user.value?.hasQazoFasting,
    },
  ]
})
</script>

<template>
  <div v-if="!user?.hasQazoFasting && !user?.hasQazoPrayers" class="flex items-center flex-col h-[calc(100vh-64px)] justify-center">
    <Empty description="Sizning tizimda qazo namozlaringiz yoki ro'zalaringiz mavjud emas"></Empty>
  </div>
  <div v-else>
    <BaseTab :items="modes" v-model="dashboardMode"></BaseTab>
    <TransitionGroup name="fade">
      <div class="flex flex-col gap-6" v-if="dashboardMode === Mode.Prayer && user?.hasQazoPrayers">
        <!-- Header -->
        <BaseBox>
          <div class="flex justify-between items-center">
            <div>
              <TypographyTitle :level="2"> Qazo namozlar tahlili </TypographyTitle>
              <TypographyText type="secondary">
                {{ yearInterval.toYear - yearInterval.fromYear }} yillik qazo namoz ma'lumotlari
                tahlili ({{ yearInterval.fromYear }}-{{ yearInterval.toYear }})
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
      <Fasting v-if="dashboardMode === Mode.Fast && user?.hasQazoFasting"></Fasting>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
