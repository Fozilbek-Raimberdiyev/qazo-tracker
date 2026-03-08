import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useQuery } from '@tanstack/vue-query'
import type { Note } from '@/types/note.types'
import type { AxiosResponse } from 'axios'
import { computed } from 'vue'

export function useNotesList() {
  const { data, isPending, refetch } = useQuery({
    queryKey: [queryKeys.notes.list],
    queryFn: () => useGet<Note[]>('/api/notes/my'),
    select: (data: AxiosResponse<Note[]>) => data.data,
  })

  const notes = computed(() => data.value ?? [])

  return { notes, isPending, refetch }
}
