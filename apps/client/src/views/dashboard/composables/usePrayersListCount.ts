import { queryKeys } from "@/config/queryKeys";
import { useGet } from "@/services/api.service";
import { useQuery } from "@tanstack/vue-query";
import type { AxiosResponse } from "axios";
interface Response {
  totalPrayers : string
  completedPrayers : string
  uncompletedPrayers : string
}
export function usePrayersListCount() {
  const {data,isPending} = useQuery({
    queryKey : [queryKeys.dashboard.prayersCount],
    queryFn : () => {
      return useGet<Response>('/api/statistic/prayers-count');
    },
    select : (data:AxiosResponse<Response>) => data.data
  })

  return {
    data,
    isPending
  }
}
