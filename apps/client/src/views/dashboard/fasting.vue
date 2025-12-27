<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
const { yearIntervalFasting } = storeToRefs(useUserStore())
import { useDeviceStore } from '@/stores/device.store'
import { TypographyText, TypographyTitle } from 'ant-design-vue'
import StatsCard from './components/fasting/StatsCard.vue'
import PieChart from './components/fasting/PieChart.vue'
import YearlyTrendChart from './components/fasting/YearlyTrendChart.vue'
import HeatMapChart from './components/fasting/HeatMapChart.vue'
import StatsTable from './components/fasting/StatsTable.vue'
const { isMobile } = storeToRefs(useDeviceStore())
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <BaseBox>
      <div class="flex justify-between items-center">
        <div>
          <TypographyTitle :level="2"> Qazo ro'zalar tahlili </TypographyTitle>
          <TypographyText type="secondary">
            {{ yearIntervalFasting.toYear - yearIntervalFasting.fromYear }} yillik qazo ro'za
            ma'lumotlari tahlili ({{ yearIntervalFasting.fromYear }}-{{
              yearIntervalFasting.toYear
            }})
          </TypographyText>
        </div>
        <div class="text-right" v-if="!isMobile">
          <TypographyTitle :level="5"> Davr </TypographyTitle>
          <TypographyText type="secondary">
            {{ yearIntervalFasting.fromYear }} - {{ yearIntervalFasting.toYear }}
          </TypographyText>
          <br />
        </div>
      </div>
    </BaseBox>
    <!-- stats -->
    <StatsCard></StatsCard>
    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <YearlyTrendChart />
      </div>
      <PieChart />
    </div>
    <!-- Heatmap -->
    <HeatMapChart class="" />

    <!-- Table -->
    <StatsTable />
  </div>
</template>
