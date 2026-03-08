import { queryKeys } from '@/config/queryKeys'
import { usePost, usePatch } from '@/services/api.service'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { showSuccessMessage } from '@/utils/message.util'
import type { CreateNotePayload, UpdateNotePayload } from '@/types/note.types'

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.notes.create],
    mutationFn: (payload: CreateNotePayload) => usePost('/api/notes', payload),
    onSuccess: () => {
      showSuccessMessage("Qayd muvaffaqiyatli saqlandi")
      queryClient.invalidateQueries({ queryKey: [queryKeys.notes.list] })
    },
  })
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [queryKeys.notes.update],
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      usePatch(`/api/notes/${id}`, payload),
    onSuccess: () => {
      showSuccessMessage("Qayd muvaffaqiyatli yangilandi")
      queryClient.invalidateQueries({ queryKey: [queryKeys.notes.list] })
    },
  })
}
