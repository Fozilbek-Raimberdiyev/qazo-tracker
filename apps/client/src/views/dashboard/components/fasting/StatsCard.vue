<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <BaseBox v-for="stat in stats" :key="stat.id">
      <div class="flex items-center justify-between mb-2">
        <TypographyParagraph>
          {{ stat.label }}
        </TypographyParagraph>
        <p class="text-white/80 text-sm"></p>

        <span class="material-symbols-outlined">
          {{ stat.icon }}
        </span>
      </div>
      <TypographyText>
        {{ stat.value }}
      </TypographyText>
      <p class="text-xs mt-2">{{ stat.subtitle }}</p>
    </BaseBox>
  </div>
</template>

<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import { TypographyParagraph, TypographyText } from 'ant-design-vue'
import { computed } from 'vue'
import {useUserStore} from "@/stores/user.store"
import { formatNumber } from '@/utils/number.util'
import { useFastingListCount } from '../../composables/useFastingListCount'
import { storeToRefs } from 'pinia'
const {yearIntervalFasting} = storeToRefs(useUserStore())
const { data } = useFastingListCount()
const stats = computed(() => {
  return [
    {
      id: 'total',
      label: "Jami ro'zalar",
      value: formatNumber(Number(data.value?.totalFasting)),
      subtitle: `${yearIntervalFasting.value.toYear - yearIntervalFasting.value.fromYear} yillik ro'zalar soni`,
      color: 'from-blue-500 to-blue-600',
      icon: 'monitoring',
    },
    {
      id: 'completed',
      label: 'Bajarilgan',
      value: formatNumber(Number(data.value?.completedFasting)),
      subtitle: 'Tutilgan ro\'zalar soni',
      color: 'from-green-500 to-green-600',
      icon: 'assignment_turned_in',
    },
    {
      id: 'missed',
      label: 'Bajarilmagan',
      value: formatNumber(Number(data.value?.uncompletedFasting)),
      subtitle: 'Tutilmagan ro\'zalar soni',
      color: 'from-red-500 to-red-600',
      icon: 'event_busy',
    },
    {
      id: 'avg',
      label: 'Bajarilish foizi',
      value:
        Math.floor(
          (Number(data.value?.completedFasting) / Number(data.value?.totalFasting)) * 100,
        ) + '%',
      subtitle: 'Jami ro\'zalar bo\'yicha',
      color: 'from-purple-500 to-purple-600',
      icon: 'calendar_month',
    },
  ]
})
</script>
