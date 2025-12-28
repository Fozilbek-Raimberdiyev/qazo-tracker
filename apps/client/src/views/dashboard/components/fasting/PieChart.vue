<template>
  <BaseBox>
    <TypographyTitle :level="3"> Ro'za bajarilish statistikasi </TypographyTitle>
    <div
      v-if="isPending"
      style="height: 350px; display: flex; align-items: center; justify-content: center"
    >
      <span>Yuklanmoqda...</span>
    </div>
    <div
      v-else-if="!data"
      style="height: 350px; display: flex; align-items: center; justify-content: center"
    >
      <span>Ma'lumot topilmadi</span>
    </div>
    <div v-else ref="chartRef" style="height: 350px; width: 100%"></div>
  </BaseBox>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { useFastingListCount } from "../../composables/useFastingListCount"

const { data, isPending } = useFastingListCount()
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// Bajarilgan va bajarilmagan uchun ranglar
const chartColors = {
  completed: '#10b981', // yashil - bajarilgan
  uncompleted: '#ef4444', // qizil - bajarilmagan
}

// Chart uchun ma'lumotlarni tayyorlash
const chartData = computed(() => {
  if (!data.value) return []

  const completed = parseInt(data.value.completedFasting) || 0
  const uncompleted = parseInt(data.value.uncompletedFasting) || 0

  return [
    {
      value: completed,
      name: 'Bajarilgan',
      itemStyle: {
        color: chartColors.completed,
      },
    },
    {
      value: uncompleted,
      name: 'Bajarilmagan',
      itemStyle: {
        color: chartColors.uncompleted,
      },
    },
  ]
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

    const total = parseInt(data.value.totalFasting) || 0

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          return `
            <strong>${params.name}</strong><br/>
            Soni: ${params.value}<br/>
            Jami: ${total}<br/>
            Foiz: ${params.percent}%
          `
        },
      },
      legend: {
        orient: 'horizontal',
        bottom: '10',
        left: 'center',
        data: ['Bajarilgan', 'Bajarilmagan'],
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{c} ta\n({d}%)',
            fontSize: 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          data: chartData.value,
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
