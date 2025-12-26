import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import type { PrayerType } from '@/types/prayer.types'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
interface CountItem {
  prayerType: PrayerType
  prayerTypeId: number
  totalPrayers: number
  completedPrayers: number
  uncompletedPrayers: number
}
export function usePrayersCountByPrayerTypes() {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.dashboard.prayersCountByPrayerTypes],
    queryFn: () => {
      return useGet<CountItem[]>('/api/statistic/prayers-count-by-prayer-types')
    },
    select: (data: AxiosResponse<CountItem[]>) => data.data,
  })

  return {
    data,
    isPending,
  }
}
