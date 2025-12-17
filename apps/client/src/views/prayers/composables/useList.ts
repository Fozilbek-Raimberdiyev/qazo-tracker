import { queryKeys } from "@/config/queryKeys";
import { useGet } from "@/services/api.service";
import { useQuery } from "@tanstack/vue-query";
import dayjs, { Dayjs } from "dayjs";
import { ref } from "vue";

export function useList() {
  const date = ref<Dayjs>(dayjs())
  const {data,isPending} = useQuery({
    queryKey : [queryKeys.prayer.list, date],
    queryFn : () => {
      const startDateOfMonth = dayjs(date.value).startOf('month').format('YYYY-MM-DD')
      const endDateOfMonth = dayjs(date.value).endOf('month').format('YYYY-MM-DD')
      return useGet(`/api/prayer/my?fromDate=${startDateOfMonth}&toDate=${endDateOfMonth}`)
    },
    select : (data) => {
      return data.data
    }
  })

  return {
    data,isPending,date
  }
}
