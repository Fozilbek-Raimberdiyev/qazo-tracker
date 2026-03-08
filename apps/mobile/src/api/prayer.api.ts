import { apiClient } from './client'

export type PrayerType = {
  id: string
  key: string
  name_uz: string
  icon: string
  order_no: number
}

export type Prayer = {
  id: string
  date: string
  isCompleted: boolean
  completedAt: string | null
  prayerType: PrayerType
}

export type PrayerListResponse = {
  completedCount: string
  totalPrayers: string
  uncompletedCount: string
  countsByType: { completed: number; total: number; prayerType: PrayerType }[]
  prayers: Prayer[]
}

export const prayerApi = {
  list: (fromDate: string, toDate: string) =>
    apiClient
      .get<PrayerListResponse>('/prayer/my', { params: { fromDate, toDate } })
      .then((r) => r.data),

  complete: (id: string) =>
    apiClient.patch(`/prayer/${id}/complete`).then((r) => r.data),

  completeMultiple: (prayerIds: string[]) =>
    apiClient.put('/prayer/complete', { prayerIds }).then((r) => r.data),

  uncompleteMultiple: (prayerIds: string[]) =>
    apiClient.put('/prayer/uncomplete', { prayerIds }).then((r) => r.data),
}
