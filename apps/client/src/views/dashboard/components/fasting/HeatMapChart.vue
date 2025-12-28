<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'
import * as echarts from 'echarts'
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle } from 'ant-design-vue'
import { useCompletedCountFastingByYear } from '../../composables/useCompletedCountFastingByYear'
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
const { data, isPending, year } = useCompletedCountFastingByYear()
const { user } = storeToRefs(useUserStore())
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null
const yearsOptions = computed(() => {
  const options = []
  const userSignedYear = new Date(
    user.value?.createdAt ? user.value.createdAt : Date.now(),
  ).getFullYear()
  for (let i = userSignedYear; i <= new Date().getFullYear(); i++) {
    options.push({
      label: i.toString(),
      value: i.toString(),
    })
  }
  return options
})
// Tanlangan yilning yanvar 1-dan dekabr 31-gacha
const dateRange = computed(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const selectedYear = year.value ? parseInt(year.value) : new Date().getFullYear().toString()

  return {
    start: `${selectedYear}-01-01`,
    end: `${selectedYear}-12-31`,
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

// Year o'zgarganda ham chartni qayta chizish
watch(
  () => year.value,
  async () => {
    if (data.value && data.value.length > 0) {
      await nextTick()
      initChart()
    }
  },
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
    <div class="flex justify-between gap-4">
      <TypographyTitle :level="3">Yillik bajarilish xaritasi</TypographyTitle>
      <BaseSelect v-model="year" class="max-w-60" :options="yearsOptions"></BaseSelect>
    </div>
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
