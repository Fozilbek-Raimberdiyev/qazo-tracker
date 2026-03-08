import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import { authApi, type UserProfile } from '../api/auth.api'

type AuthState = {
  token: string | null
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  setToken: (token: string) => Promise<void>
  logout: () => Promise<void>
  loadToken: () => Promise<void>
  loadProfile: () => Promise<void>
  setUser: (user: UserProfile) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setToken: async (token: string) => {
    await SecureStore.setItemAsync('access_token', token)
    set({ token, isAuthenticated: true })
    await get().loadProfile()
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('access_token')
    set({ token: null, user: null, isAuthenticated: false })
  },

  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token')
      if (token) {
        set({ token, isAuthenticated: true })
        await get().loadProfile()
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false })
    }
  },

  loadProfile: async () => {
    try {
      const user = await authApi.profile()
      set({ user })
    } catch {
      await get().logout()
    }
  },

  setUser: (user: UserProfile) => set({ user }),
}))
