import { apiClient } from './client'

export type LoginPayload = { email: string; password: string }
export type RegisterPayload = { email: string; password: string; firstName?: string; lastName?: string }
export type AuthResponse = { accessToken: string }

export type UserProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  picture: string | null
  hasQazoPrayers: boolean
  qazoPrayersCount: number
  hasQazoFasting: boolean
  qazoFastingCount: number
  maxPrayerDate: string | null
  minPrayerDate: string | null
  maxFastingDate: string | null
  minFastingDate: string | null
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  profile: () =>
    apiClient.get<UserProfile>('/auth/profile').then((r) => r.data),
}
