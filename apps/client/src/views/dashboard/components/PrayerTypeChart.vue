<template>
  <BaseBox>
    <TypographyTitle :level="3"> Namoz vaqtlari taqsimoti </TypographyTitle>
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

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { usePrayersCountByPrayerTypes } from '../composables/usePrayersCountByPrayerTypes'

const { data, isPending } = usePrayersCountByPrayerTypes()

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// Namoz turlari uchun ranglar (6 ta)
const prayerColors: string[] = [
  '#3b82f6', // ko'k
  '#10b981', // yashil
  '#f59e0b', // sariq
  '#8b5cf6', // binafsha
  '#ec4899', // pushti
  '#06b6d4', // turkuaz
]

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

    // Pie chart uchun ma'lumotlarni tayyorlash
    const chartData = data.value.map((item, index) => ({
      value: item.totalPrayers,
      name: item.prayerType.name_uz, // prayerType object ichidan name olamiz
      itemStyle: {
        color: prayerColors[index % prayerColors.length], // index bo'yicha rang
      },
    }))

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const dataItem = data.value?.find((d) => d.prayerType.name_uz === params.name)
          if (!dataItem) return params.name

          return `
            <strong>${params.name}</strong><br/>
            Bajarilgan: ${dataItem.completedPrayers}<br/>
            Qoldirilgan: ${dataItem.uncompletedPrayers}<br/>
            Jami: ${dataItem.totalPrayers}<br/>
            Foiz: ${params.percent}%
          `
        },
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left',
      //   top: 'center',
      //   data: data.value.map(item => item.prayerType.name_uz)
      // },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
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
          data: chartData,
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
