<template>
  <BaseBox>
    <TypographyTitle :level="3">Batafsil ma'lumot</TypographyTitle>
    <BaseTable :columns :data-source="data" :loading="isPending" :currentPage="1">
      <template #bodyCell="{ record, column }">
        <div v-if="column.key === 'prayer'">
          <span class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {{ record.year }}
          </span>
        </div>
        <div v-if="column.key === 'completed'">
          <span class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
            {{ record.completedFasting }}
          </span>
        </div>
        <div v-if="column.key === 'uncompleted'">
          <span class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
            {{ record.uncompletedFasting }}
          </span>
        </div>
        <div v-if="column.key === 'percentage'" class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div
                class="bg-green-500 h-2 rounded-full"
                :style="{ width: `${(record.completedFasting / record.totalFasting) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-medium"
              >{{ Math.floor((record.completedFasting / record.totalFasting) * 100) }}%</span
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
import { useFastingCountPerYear } from '../../composables/useFastingCountPerYear'
import BaseTable from '@/components/BaseTable/BaseTable.vue'
const { data, isPending } = useFastingCountPerYear()
const columns = [
  { title: 'Ibodat yili', key: 'prayer', dataIndex: 'prayerType.name_uz' },
  { title: 'Jami', key: 'total', dataIndex: 'totalFasting' },
  { title: 'Bajarilgan', key: 'completed', dataIndex: 'completedPrayers' },
  { title: 'Qoldirilgan', key: 'uncompleted', dataIndex: 'uncompletedPrayers' },
  { title: 'Foiz', key: 'percentage', dataIndex: '' },
]
</script>
