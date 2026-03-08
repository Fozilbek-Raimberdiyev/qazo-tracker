import { apiClient } from './client'

export type Fasting = {
  id: string
  date: string
  hijri_date: string
  day_of_ramadan: number
  hijri_year: number
  gregorian_year: number
  isCompleted: boolean
  completedAt: string | null
}

export type FastingListResponse = {
  completedCount: number
  totalCount: number
  uncompletedCount: number
  fastingList: Fasting[]
}

export const fastingApi = {
  list: (year: number) =>
    apiClient.get<FastingListResponse>('/fasting/my', { params: { year } }).then((r) => r.data),

  complete: (id: string) =>
    apiClient.patch(`/fasting/${id}/complete`).then((r) => r.data),

  completeMultiple: (fastingIds: string[]) =>
    apiClient.put('/fasting/complete', { fastingIds }).then((r) => r.data),

  uncompleteMultiple: (fastingIds: string[]) =>
    apiClient.put('/fasting/uncomplete', { fastingIds }).then((r) => r.data),
}
