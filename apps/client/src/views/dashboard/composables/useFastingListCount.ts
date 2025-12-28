import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
interface Response {
  totalFasting: string
  completedFasting: string
  uncompletedFasting: string
}
export function useFastingListCount() {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.dashboard.fastingCount],
    queryFn: () => {
      return useGet<Response>('/api/statistic/fasting-count')
    },
    select: (data: AxiosResponse<Response>) => data.data,
  })

  return {
    data,
    isPending,
  }
}
