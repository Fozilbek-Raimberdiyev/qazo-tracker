import type { UserProfile } from '@/types/user.types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile>()
  function setUser(payload: UserProfile) {
    user.value = payload
  }

  function clearUser() {
    user.value = undefined
  }

  const yearIntervalPrayer = computed(() => {
    const fromYear = user.value?.minPrayerDate
      ? new Date(user.value.minPrayerDate).getFullYear()
      : new Date().getFullYear()
    const toYear = user.value?.maxPrayerDate
      ? new Date(user.value.maxPrayerDate).getFullYear()
      : new Date().getFullYear()
    return { fromYear, toYear }
  })

  const yearIntervalFasting = computed(() => {
    const fromYear = user.value?.minFastingDate
      ? new Date(user.value.minFastingDate).getFullYear()
      : new Date().getFullYear()
    const toYear = user.value?.maxFastingDate
      ? new Date(user.value.maxFastingDate).getFullYear()
      : new Date().getFullYear()
    return { fromYear, toYear }
  })
  const yearsOptionsPrayer = computed(() => {
    const options = []
    for (let i = yearIntervalPrayer.value.fromYear; i <= yearIntervalPrayer.value.toYear; i++) {
      options.push({ label: i, value: i })
    }

    return options
  })
  const yearsOptionsFasting = computed(() => {
    const options = []
    for (let i = yearIntervalFasting.value.fromYear; i <= yearIntervalFasting.value.toYear; i++) {
      options.push({ label: i, value: i })
    }

    return options
  })
  return {
    user,
    setUser,
    clearUser,
    yearIntervalPrayer,
    yearIntervalFasting,
    yearsOptionsPrayer,
    yearsOptionsFasting,
  }
})
