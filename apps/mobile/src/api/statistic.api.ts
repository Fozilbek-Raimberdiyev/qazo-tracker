import { apiClient } from './client'

export type PrayerCountStat = {
  totalPrayers: string
  completedPrayers: string
  uncompletedPrayers: string
}

export type FastingCountStat = {
  totalFasting: string
  completedFasting: string
  uncompletedFasting: string
}

export type PerYearStat = {
  year: number
  count: number
  completed: number
  uncompleted: number
}

export const statisticApi = {
  prayersCount: () =>
    apiClient.get<PrayerCountStat>('/statistic/prayers-count').then((r) => r.data),

  fastingCount: () =>
    apiClient.get<FastingCountStat>('/statistic/fasting-count').then((r) => r.data),

  prayersPerYear: () =>
    apiClient.get<PerYearStat[]>('/statistic/prayers-count-per-year').then((r) => r.data),

  fastingPerYear: () =>
    apiClient.get<PerYearStat[]>('/statistic/fasting-count-per-year').then((r) => r.data),
}
