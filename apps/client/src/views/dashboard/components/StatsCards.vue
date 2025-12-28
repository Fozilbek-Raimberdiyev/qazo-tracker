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
import { usePrayersListCount } from '../composables/usePrayersListCount'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { formatNumber } from '@/utils/number.util'
import { storeToRefs } from 'pinia'

const { yearIntervalPrayer } = storeToRefs(useUserStore())
const { data } = usePrayersListCount()

const stats = computed(() => {
  const avgDaily = (
    Number(data.value?.completedPrayers) /
    (365 * yearIntervalPrayer.value.toYear - yearIntervalPrayer.value.fromYear)
  ).toFixed(1)

  return [
    {
      id: 'total',
      label: 'Jami namozlar',
      value: formatNumber(Number(data.value?.totalPrayers)),
      subtitle: `${yearIntervalPrayer.value.toYear - yearIntervalPrayer.value.fromYear} yillik namozlar soni`,
      color: 'from-blue-500 to-blue-600',
      icon: 'monitoring',
    },
    {
      id: 'completed',
      label: 'Bajarilgan',
      value: formatNumber(Number(data.value?.completedPrayers)),
      subtitle: 'O\'qilgan namozlar soni',
      color: 'from-green-500 to-green-600',
      icon: 'assignment_turned_in',
    },
    {
      id: 'missed',
      label: 'Bajarilmagan',
      value: formatNumber(Number(data.value?.uncompletedPrayers)),
      subtitle: 'O\'qilmagan namozlar soni',
      color: 'from-red-500 to-red-600',
      icon: 'event_busy',
    },
    {
      id: 'avg',
      label: "O'rtacha (kunlik)",
      value: avgDaily,
      subtitle: 'namoz per kun',
      color: 'from-purple-500 to-purple-600',
      icon: 'calendar_month',
    },
  ]
})
</script>
