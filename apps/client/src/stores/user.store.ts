import type { UserProfile } from '@/types/user.types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile>()
  function setUser(payload: UserProfile) {
    user.value = payload
  }

  function clearUser () {
    user.value = undefined
  }
  return {
    user,
    setUser,
    clearUser
  }
})
