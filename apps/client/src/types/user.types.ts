export interface GoogleRaw {
  sub: string
  name: string
  email: string
  picture: string
  given_name: string
  family_name: string
  email_verified: boolean
  locale?: string
  hd?: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  picture: string
  locale: string | null
  googleRaw: GoogleRaw
  hasQazoPrayers: boolean
  qazoPrayersCount: number
}
