<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { usePrayerCountPerYear } from '../../composables/usePrayerCountPerYear'
import { TypographyTitle } from 'ant-design-vue'

const { data, isPending } = usePrayerCountPerYear()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ECharts | null = null

const initChart = async (): Promise<void> => {
  // Agar element yoki data bo'lmasa, chiqib ketish
  if (!chartRef.value || !data.value || data.value.length === 0) {
    return
  }

  // Avvalgi chart instance'ni to'liq tozalash
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }

  // DOM elementini kutish
  await nextTick()

  try {
    // Yangi chart instance yaratish
    chartInstance = echarts.init(chartRef.value)

    // Ma'lumotlarni tayyorlash
    const years = data.value.map((item) => item.year)
    const completed = data.value.map((item) => Number(item.completedPrayers) || 0)
    const uncompleted = data.value.map((item) => Number(item.uncompletedPrayers) || 0)

    // Bajarilish foizini hisoblash
    const percentages = data.value.map((item) => {
      const totalNum = Number(item.totalPrayers) || 0
      const completedNum = Number(item.completedPrayers) || 0
      return totalNum > 0 ? Number(((completedNum / totalNum) * 100).toFixed(1)) : 0
    })

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter: (params: any) => {
          let result = `<strong>${params[0].axisValue} yil</strong><br/>`
          params.forEach((param: any) => {
            if (param.seriesName === 'Bajarilish Foizi') {
              result += `${param.marker} ${param.seriesName}: ${param.value}%<br/>`
            } else {
              result += `${param.marker} ${param.seriesName}: ${param.value}<br/>`
            }
          })
          return result
        },
      },
      legend: {
        data: ['Bajarilgan', 'Qoldirilgan', 'Bajarilish foizi'],
        top: 0,
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: years,
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Soni',
          position: 'left',
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: 'Foiz',
          position: 'right',
          min: 0,
          max: 100,
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [
        {
          name: 'Bajarilgan',
          type: 'bar',
          stack: 'total',
          data: completed,
          itemStyle: {
            color: '#10b981',
          },
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'Qoldirilgan',
          type: 'bar',
          stack: 'total',
          data: uncompleted,
          itemStyle: {
            color: '#ef4444',
          },
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'Bajarilish foizi',
          type: 'line',
          yAxisIndex: 1,
          data: percentages,
          itemStyle: {
            color: '#f59e0b',
          },
          lineStyle: {
            width: 3,
          },
          smooth: true,
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

// Resize handler
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

// Component unmount bo'lganda tozalash
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
    <TypographyTitle :level="3"> Yillik qazo namoz tahlili </TypographyTitle>
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
