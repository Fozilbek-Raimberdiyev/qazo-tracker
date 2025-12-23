import { queryKeys } from '@/config/queryKeys'
import { usePatch } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useCompleteFastingMutation() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [queryKeys.fasting.singleComplete],
    mutationFn: (fastingId: string) => {
      return usePatch(`/api/fasting/${fastingId}/complete`)
    },
    onSuccess: () => {
      showSuccessMessage('Muvaffaqiyatli saqlandi')
      queryClient.invalidateQueries({ queryKey: [queryKeys.fasting.list] })
    },
  })

  return {
    mutateAsync,
    isPending,
  }
}
