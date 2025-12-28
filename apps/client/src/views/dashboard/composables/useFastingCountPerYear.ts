import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
interface IFastingCountPerYear {
  year: string
  totalFasting: string
  completedFasting: string
  uncompletedFasting: string
}
export function useFastingCountPerYear() {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.dashboard.fastingCountPerYear],
    queryFn: () => {
      return useGet<IFastingCountPerYear[]>('/api/statistic/fasting-count-per-year')
    },
    select: (data: AxiosResponse<IFastingCountPerYear[]>) => data.data,
  })

  return {
    data,
    isPending,
  }
}
