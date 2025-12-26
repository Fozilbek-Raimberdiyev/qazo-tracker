import { ref } from 'vue'
import { useDeviceStore } from '@/stores/device.store'
import { storeToRefs } from 'pinia'
export function useMenuItemsList() {
  const { isMobile } = storeToRefs(useDeviceStore())
  const menuItemsList = ref([
    {
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/dashboard',
      visible: true,
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
      label: 'Sozlamalar',
      icon: 'settings',
      path: '/settings',
      visible: !!isMobile.value,
    },
  ])

  return {
    menuItemsList,
  }
}
