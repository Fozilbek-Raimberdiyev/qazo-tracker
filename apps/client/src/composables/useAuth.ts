import { queryKeys } from '@/config/queryKeys'
import type { UserProfile } from '@/types/user.types'
import { useQuery } from '@tanstack/vue-query'
import { useUserStore } from '@/stores/user.store'
import { useGet } from '@/services/api.service'
import { removeLocalStorage } from '@/utils/localStorage.util'
export function useAuth() {
  const { setUser, clearUser } = useUserStore()
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: [queryKeys.user.me],
    queryFn: () => {
      return useGet<UserProfile>('/api/auth/profile')
    },
    select: (data) => {
      setUser(data.data)
      return data.data
    },
  })

  function logOut() {
    clearUser()
    removeLocalStorage('access_token')
  }

  return {
    user,
    isPending,
    logOut,
    error,
  }
}
