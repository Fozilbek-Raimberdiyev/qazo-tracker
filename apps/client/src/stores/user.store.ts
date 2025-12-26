import type { UserProfile } from '@/types/user.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile>()
  function setUser(payload: UserProfile) {
    user.value = payload
  }

  function clearUser () {
    user.value = undefined
  }

  const yearIntervalPrayer = computed(() => {
  const fromYear = user.value?.minPrayerDate
    ? new Date(user.value.minPrayerDate).getFullYear()
    : 2005
  const toYear = user.value?.maxPrayerDate ? new Date(user.value.maxPrayerDate).getFullYear() : 2025
  return { fromYear, toYear }
})
  return {
    user,
    setUser,
    clearUser,
    yearIntervalPrayer
  }
})
