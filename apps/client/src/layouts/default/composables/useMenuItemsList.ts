import { computed } from 'vue'
import { useDeviceStore } from '@/stores/device.store'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'
export function useMenuItemsList() {
  const { isMobile } = storeToRefs(useDeviceStore())
  const { user } = storeToRefs(useUserStore())
  const menuItemsList = computed(() => {
    return [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
        visible: user.value?.hasQazoFasting || user.value?.hasQazoPrayers,
      },
      {
        label: 'Qazo namozlar',
        icon: 'mosque',
        path: '/prayers',
        visible: true,
      },
      {
        label: 'Qazo ro‘zalar',
        icon: 'prayer_times',
        path: '/fasts',
        visible: true,
      },

      {
        label: 'Qaydlar',
        icon: 'notes',
        path: '/notes',
        visible: true,
        badge: true,
        badgeContent: 'Tez kunda',
      },
      {
        label: 'Sozlamalar',
        icon: 'settings',
        path: '/settings',
        visible: !!isMobile.value,
      },
    ]
  })

  return {
    menuItemsList,
  }
}
