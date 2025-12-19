import { queryKeys } from '@/config/queryKeys'
import { usePatch } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function usePrayerCompleteMutation() {
  const queryClient = useQueryClient()
  const {mutateAsync,isPending} = useMutation({
    mutationKey: [queryKeys.prayer.singleComplete],
    mutationFn: (id: string) => {
      return usePatch(`/api/prayer/${id}/complete`)
    },
    onSuccess: () => {
      showSuccessMessage('Muvaffaqiyatli saqlandi')
      queryClient.invalidateQueries({ queryKey: [queryKeys.prayer.list] })
    },
  })

  return {
    mutateAsync,
    isPending
  }
}
