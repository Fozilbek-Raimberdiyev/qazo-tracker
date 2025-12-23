export interface IFasting {
  id: string
  date: string
  hijri_date: string
  day_of_ramadan: number
  gregorian_year: number
  hijri_year: number
  isCompleted: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ResponseFastingList {
  completedCount: number
  fastingList: IFasting[]
  totalCount: number
  uncompletedCount: number
}
