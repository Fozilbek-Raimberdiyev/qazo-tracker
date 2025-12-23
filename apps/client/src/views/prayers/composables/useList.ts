import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import type { Prayer, PrayerType } from '@/types/prayer.types'
import { useQuery } from '@tanstack/vue-query'
import {useUserStore} from "@/stores/user.store"
import dayjs, { Dayjs } from 'dayjs'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
interface CountByType {
  completed: number
  total: number
  prayerType: PrayerType
}
interface Response {
  completedCount: string
  totalPrayers: string
  uncompletedCount: string
  countsByType: CountByType[]
  prayers: Prayer[]
}
export function useList() {
  const { user } = storeToRefs(useUserStore())
  const date = ref<Dayjs>(dayjs(user.value?.maxPrayerUncompletedDate))
  const { data, isPending } = useQuery({
    queryKey: [queryKeys.prayer.list, date],
    queryFn: () => {
      const startDateOfMonth = dayjs(date.value).startOf('month').format('YYYY-MM-DD')
      const endDateOfMonth = dayjs(date.value).endOf('month').format('YYYY-MM-DD')
      return useGet<Response>(
        `/api/prayer/my?fromDate=${startDateOfMonth}&toDate=${endDateOfMonth}`,
      )
    },
    select: (data) => {
      return data.data
    },
  })

  return {
    data,
    isPending,
    date,
  }
}
