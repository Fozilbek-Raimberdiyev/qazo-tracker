import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
interface IPrayerCountPerYear {
  year: string
  totalPrayers: string
  completedPrayers: string
  uncompletedPrayers: string
}
export function usePrayerCountPerYear() {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.dashboard.prayerCountPerYear],
    queryFn: () => {
      return useGet<IPrayerCountPerYear[]>('/api/statistic/prayers-count-per-year')
    },
    select: (data: AxiosResponse<IPrayerCountPerYear[]>) => data.data,
  })

  return {
    data,
    isPending,
  }
}
