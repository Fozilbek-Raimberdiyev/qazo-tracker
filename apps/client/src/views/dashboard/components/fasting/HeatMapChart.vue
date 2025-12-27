<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { useLast24MonthCompletedCount } from '../../composables/useCompletedCountByYear'

const { data, isPending } = useLast24MonthCompletedCount()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// Hozirgi sana va 2 yil oldingi sanani hisoblash
const dateRange = computed(() => {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setMonth(startDate.getMonth() - 24)

  return {
    start: startDate.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  }
})

// API dan kelgan ma'lumotlarni heatmap formatiga o'tkazish
const heatmapData = computed(() => {
  if (!data.value || data.value.length === 0) return []

  return data.value.map((item) => {
    // Yil va oydan sana yaratish (oyning 1-kuni)
    const dateStr = `${item.year}-${String(item.month).padStart(2, '0')}-01`
    return [dateStr, item.completedCount]
  })
})

// Maksimal qiymatni topish (visualMap uchun)
const maxValue = computed(() => {
  if (!data.value || data.value.length === 0) return 100
  return Math.max(...data.value.map((item) => item.completedCount))
})

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

    const option: echarts.EChartsOption = {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const date = new Date(params.data[0])
          const monthNames = [
            'Yanvar',
            'Fevral',
            'Mart',
            'Aprel',
            'May',
            'Iyun',
            'Iyul',
            'Avgust',
            'Sentabr',
            'Oktabr',
            'Noyabr',
            'Dekabr',
          ]
          return `
            <strong>${monthNames[date.getMonth()]} ${date.getFullYear()}</strong><br/>
            Bajarilgan: ${params.data[1]}
          `
        },
      },
      visualMap: {
        min: 0,
        max: maxValue.value,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#fee2e2', '#fca5a5', '#f87171', '#dc2626', '#991b1b'],
        },
        text: ["Ko'p", 'Kam'],
        textStyle: {
          fontSize: 11,
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      calendar: {
        top: 50,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: [dateRange.value.start, dateRange.value.end],
        dayLabel: {
          firstDay: 1, // Dushanbadan boshlash (0=Yakshanba, 1=Dushanba)
          nameMap: ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'],
          fontSize: 10,
        },
        monthLabel: {
          nameMap: [
            'Yan',
            'Fev',
            'Mar',
            'Apr',
            'May',
            'Iyun',
            'Iyul',
            'Avg',
            'Sen',
            'Okt',
            'Noy',
            'Dek',
          ],
          fontSize: 11,
        },
        yearLabel: {
          show: true,
          fontSize: 14,
        },
        itemStyle: {
          borderWidth: 0.5,
          borderColor: '#ccc',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e0e0e0',
            width: 1,
          },
        },
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: heatmapData.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
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

// Ma'lumot kelganda yoki o'zgarganda chartni chizish
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
    <TypographyTitle :level="3">Yillik bajarilish xaritasi (Oxirgi 24 oy)</TypographyTitle>
    <div
      v-if="isPending"
      style="height: 200px; display: flex; align-items: center; justify-content: center"
    >
      <span>Yuklanmoqda...</span>
    </div>
    <div
      v-else-if="!data || data.length === 0"
      style="height: 200px; display: flex; align-items: center; justify-content: center"
    >
      <span>Ma'lumot topilmadi</span>
    </div>
    <div v-else ref="chartRef" style="height: 200px; width: 100%"></div>
  </BaseBox>
</template>
