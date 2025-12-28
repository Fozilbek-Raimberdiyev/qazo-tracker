import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import { ref } from 'vue'
interface CountItem {
  year: number
  month: number
  completedCount: number
}
export function useCompletedCountFastingByYear() {
  const year = ref(new Date().getFullYear())
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.dashboard.completedCountFastingByYear, year],
    queryFn: () => {
      return useGet<CountItem[]>(
        `/api/statistic/fasting-count-monthly-completed-by-year?year=${year.value}`,
      )
    },
    select: (data: AxiosResponse<CountItem[]>) => data.data,
  })

  return {
    data,
    isPending,
    year,
  }
}
