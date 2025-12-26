<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { usePrayersCountByPrayerTypes } from '../composables/usePrayersCountByPrayerTypes'

const { data, isPending } = usePrayersCountByPrayerTypes()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = async (): Promise<void> => {
  if (!chartRef.value || !data.value || data.value.length === 0) {
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

    // Ma'lumotlarni tayyorlash
    const prayerNames = data.value.map((item) => item.prayerType.name_uz)
    const completedData = data.value.map((item) => item.completedPrayers)
    const uncompletedData = data.value.map((item) => item.uncompletedPrayers)

    // Maksimal qiymatni hisoblash
    const maxValue = Math.max(...data.value.map((item) => item.totalPrayers))

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue}</strong><br/>`
          params.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`
          })
          return result
        },
      },
      legend: {
        data: ['Bajarilgan', 'Qoldirilgan'],
        top: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        max: maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100,
        axisLabel: {
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'category',
        data: prayerNames,
        axisLabel: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'Bajarilgan',
          type: 'bar',
          stack: 'total',
          data: completedData,
          itemStyle: {
            color: '#10b981',
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              return params.value > 0 ? params.value : ''
            },
          },
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'Qoldirilgan',
          type: 'bar',
          stack: 'total',
          data: uncompletedData,
          itemStyle: {
            color: '#ef4444',
          },
          label: {
            show: true,
            position: 'inside',
            formatter: (params: any) => {
              return params.value > 0 ? params.value : ''
            },
          },
          emphasis: {
            focus: 'series',
          },
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

// Ma'lumot kelganda chartni chizish
watch(
  () => data.value,
  async (newData) => {
    if (newData && newData.length > 0) {
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
<template>
  <BaseBox>
    <TypographyTitle :level="3"> Namoz vaqtlari bo'yicha bajarilish tahlili</TypographyTitle>
    <div
      v-if="isPending"
      style="height: 350px; display: flex; align-items: center; justify-content: center"
    >
      <span>Yuklanmoqda...</span>
    </div>
    <div
      v-else-if="!data || data.length === 0"
      style="height: 350px; display: flex; align-items: center; justify-content: center"
    >
      <span>Ma'lumot topilmadi</span>
    </div>
    <div v-else ref="chartRef" style="height: 350px; width: 100%"></div>
  </BaseBox>
</template>
