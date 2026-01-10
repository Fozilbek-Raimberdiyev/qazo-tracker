import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import type { PrayerType } from '@/types/prayer.types'
import { useQuery } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import { computed } from 'vue'

export function usePrayerTypeList() {
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.prayer.prayerTypes.list],
    queryFn: () => {
      return useGet<PrayerType[]>('/api/prayer-types/list')
    },
    select: (data: AxiosResponse<PrayerType[]>) => data.data,
  })

  const optionsC = computed(() => {
    return data.value?.map((item) => {
      return {
        label: item.name_uz,
        value: item.id,
      }
    })
  })

  return {
    data,
    isPending,
    optionsC,
  }
}
