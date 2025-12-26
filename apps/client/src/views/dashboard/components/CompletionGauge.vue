<template>
  <BaseBox>
    <TypographyTitle :level="3"> Bajarilish foizi</TypographyTitle>
    <div
      v-if="isPending"
      style="height: 300px; display: flex; align-items: center; justify-content: center"
    >
      <span>Yuklanmoqda...</span>
    </div>
    <div
      v-else-if="!data"
      style="height: 300px; display: flex; align-items: center; justify-content: center"
    >
      <span>Ma'lumot topilmadi</span>
    </div>
    <div v-else ref="chartRef" style="height: 300px; width: 100%"></div>
  </BaseBox>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { usePrayersListCount } from '../composables/usePrayersListCount'

const { data, isPending } = usePrayersListCount()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// Bajarilish foizini hisoblash
const completionRate = computed(() => {
  if (!data.value) return 0

  const total = Number(data.value.totalPrayers) || 0
  const completed = Number(data.value.completedPrayers) || 0

  if (total === 0) return 0

  return Number(((completed / total) * 100).toFixed(1))
})

const initChart = async (): Promise<void> => {
  if (!chartRef.value || !data.value) {
    return
  }

  // Avvalgi chart instance'ni tozalash
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }

  // DOM elementini kutish
  await nextTick()

  try {
    chartInstance = echarts.init(chartRef.value)

    const option: echarts.EChartsOption = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          itemStyle: {
            color: '#10b981',
          },
          progress: {
            show: true,
            width: 18,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 18,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: '#999',
            },
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 12,
          },
          anchor: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '70%'],
            fontSize: 30,
            fontWeight: 'bold',
            formatter: '{value}%',
            color: 'inherit',
          },
          data: [
            {
              value: completionRate.value,
              name: 'Bajarilish',
            },
          ],
        },
      ],
    }

    chartInstance.setOption(option)
  } catch (error) {
    console.error('Chart yaratishda xatolik:', error)
  }
}

const handleResize = (): void => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

// Ma'lumot kelganda yoki o'zgarganda chartni chizish
watch(
  [() => data.value, completionRate],
  async ([newData]) => {
    if (newData) {
      await nextTick()
      initChart()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>
