import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import type { ResponseFastingList } from '@/types/fasting.types'
export function useList() {
  const { user } = storeToRefs(useUserStore())
  const year = ref(new Date(user.value?.minFastingDate || '').getFullYear())
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.fasting.list, year],
    queryFn: () => {
      return useGet<ResponseFastingList>('/api/fasting/my?year=' + year.value)
    },
    select: (data: AxiosResponse<ResponseFastingList>) => {
      return data.data
    },
    enabled: computed(() => {
      return !!year.value
    }),
  })

  const fastingList = computed(() => data.value?.fastingList || [])

  return {
    data,
    isPending,
    year,
    fastingList,
  }
}
