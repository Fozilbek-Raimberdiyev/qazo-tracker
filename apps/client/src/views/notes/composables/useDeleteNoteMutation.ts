import { queryKeys } from '@/config/queryKeys'
import { useDelete } from '@/services/api.service'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { showSuccessMessage } from '@/utils/message.util'

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.notes.delete],
    mutationFn: (id: string) => useDelete(`/api/notes/${id}`),
    onSuccess: () => {
      showSuccessMessage("Qayd muvaffaqiyatli o'chirildi")
      queryClient.invalidateQueries({ queryKey: [queryKeys.notes.list] })
    },
  })
}
