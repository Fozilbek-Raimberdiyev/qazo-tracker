<template>
  <BaseBox>
    <TypographyTitle :level="3">Batafsil ma'lumot</TypographyTitle>
    <BaseTable :columns :data-source="data" :loading="isPending" :currentPage="1">
      <template #bodyCell="{ record, column }">
        <div v-if="column.key === 'prayer'">
          <span class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ record.prayerType.name_uz }}
          </span>
        </div>
        <div v-if="column.key === 'completed'">
          <span class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
            {{ record.completedPrayers }}
          </span>
        </div>
        <div v-if="column.key === 'uncompleted'">
          <span class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
            {{ record.uncompletedPrayers }}
          </span>
        </div>
        <div v-if="column.key === 'percentage'" class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div
                class="bg-green-500 h-2 rounded-full"
                :style="{ width: `${(record.completedPrayers / record.totalPrayers) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-700"
              >{{ Math.floor((record.completedPrayers / record.totalPrayers) * 100) }}%</span
            >
          </div>
        </div>
      </template>
    </BaseTable>
  </BaseBox>
</template>

<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { usePrayersCountByPrayerTypes } from '../../composables/usePrayersCountByPrayerTypes'
import BaseTable from '@/components/BaseTable/BaseTable.vue'
const { data, isPending } = usePrayersCountByPrayerTypes()
const columns = [
  { title: 'Namoz', key: 'prayer', dataIndex: 'prayerType.name_uz' },
  { title: 'Jami', key: 'total', dataIndex: 'totalPrayers' },
  { title: 'Bajarilgan', key: 'completed', dataIndex: 'completedPrayers' },
  { title: 'Qoldirilgan', key: 'uncompleted', dataIndex: 'uncompletedPrayers' },
  { title: 'Foiz', key: 'percentage', dataIndex: '' },
]
</script>
