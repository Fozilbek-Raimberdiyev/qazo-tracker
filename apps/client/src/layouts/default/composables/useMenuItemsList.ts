import { ref } from "vue";

export function useMenuItemsList() {
  const menuItemsList = ref([
    {
      label : 'Dashboard',
      icon : 'dashboard',
      path : '/dashboard'
    },
    {
      label : "Qazo namozlar",
      icon : 'mosque',
      path : '/prayers'
    },
    {
      label : "Qazo ro‘zalar",
      icon : 'prayer_times',
      path : '/fasts'
    },
  ])

  return {
    menuItemsList
  }
}
