export interface PrayerType {
  name_uz: string
  name_ru: string
  name_en: string
  name_ar: string
  icon: string
  order_no: number
  id: string
}
export interface Prayer {
  id: string
  date: string
  prayerType: PrayerType
  isCompleted: boolean
  createdAt: string
  userId: string
}
