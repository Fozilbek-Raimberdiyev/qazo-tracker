<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuItemsList } from './composables/useMenuItemsList'
import { useLocalStorage } from '@vueuse/core'
import { useAuth } from '@/composables/useAuth'
import { useDeviceStore } from '@/stores/device.store'
import { storeToRefs } from 'pinia'
import MobileMenu from './components/MobileMenu.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
const { user, isPending } = useAuth()
const { isMobile } = storeToRefs(useDeviceStore())
const router = useRouter()
const { menuItemsList } = useMenuItemsList()
const originPosition = ref({ x: 0, y: 0 })
const isExpanded = useLocalStorage('isExpanded', true)
const defaultTransition = ref('circle-expand')
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const setOriginFromButton = () => {
  // Get main content area position instead of button
  const mainContent = document.querySelector('main') as HTMLElement
  if (mainContent) {
    const rect = mainContent.getBoundingClientRect()
    originPosition.value = {
      x: rect.left + rect.width / 2, // Center horizontally
      y: rect.top, // Top of main content
    }
  }
}

// Set origin position before each navigation
router.beforeEach(() => {
  setOriginFromButton()
})
</script>

<template>
  <div class="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
    <!-- Side Navigation Bar -->
    <aside
      v-if="!isMobile"
      :class="[
        'fixed top-0 left-0 h-screen shrink-0 p-4 flex flex-col justify-between sidebar border-r border-solid border-(--color-border-light) dark:border-(--color-border-dark) transition-all duration-300 z-10 bg-white dark:bg-transparent',
        isExpanded ? 'w-80' : 'w-20',
      ]"
    >
      <!-- Toggle Button - Positioned on border -->
      <button
        @click="toggleSidebar"
        class="toggle-button absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-800 border border-solid border-(--color-border) rounded-full shadow-md hover:shadow-lg transition-all dark:text-white/70 dark:hover:text-white z-20 cursor-pointer"
      >
        <span class="material-symbols-outlined text-base">
          {{ isExpanded ? 'chevron_left' : 'chevron_right' }}
        </span>
      </button>

      <div class="flex flex-col gap-8">
        <div class="flex items-center gap-3 px-3 pt-3">
          <div class="bg-primary/20 rounded-lg p-2">
            <span class="material-symbols-outlined text-primary text-2xl">mosque</span>
          </div>
          <h2
            v-show="isExpanded"
            class="dark:text-white text-lg font-bold whitespace-nowrap overflow-hidden transition-all"
          >
            Qazo Tracker
          </h2>
        </div>

        <nav>
          <div class="flex flex-col gap-2" v-for="(item, index) in menuItemsList" :key="index">
            <RouterLink
              v-if="item.visible && !item.badge"
              class="flex items-center gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              :to="item.path"
              :title="!isExpanded ? item.label : ''"
            >
                <span class="material-symbols-outlined">{{ item.icon }}</span>
                <span
                  v-show="isExpanded"
                  class="text-sm font-medium leading-normal whitespace-nowrap overflow-hidden"
                >
                  {{ item.label }}
                </span>
            </RouterLink>
            <!-- <Badge v-else color="red" status="success" :count="item.badgeContent"> -->
               <RouterLink disabled :to="item.path" v-else-if="item.visible && item.badge" view-transition

                 :title="!isExpanded ? item.label : ''"
               >
               <BaseButton :disabled="item.badge" type="text" block class="flex! items-center  gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors text-black! w-full" >
               <span class="material-symbols-outlined">{{ item.icon }}</span>
                 <span
                   v-show="isExpanded"
                   class="text-sm font-medium leading-normal whitespace-nowrap overflow-hidden"
                 >
                   {{ item.label }}
                 </span>
              </BaseButton>

               </RouterLink>
               <!-- </Badge> -->
          </div>
        </nav>
      </div>

      <div class="flex flex-col gap-1 pb-2">
        <div
          :class="[
            'flex items-center gap-4 p-3 border-t border-white/10',
            !isExpanded && 'justify-center',
          ]"
        >
          <span v-if="!user?.picture" class="material-symbols-outlined text-3xl!">
            account_circle
          </span>
          <div
            v-else
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User avatar image"
            :style="{ backgroundImage: `url(${user?.picture})` }"
          ></div>
          <div v-show="isExpanded" class="flex flex-col overflow-hidden">
            <h3 class="dark:text-white text-base font-medium leading-normal whitespace-nowrap">
              {{ user?.firstName + ' ' + user?.lastName }}
            </h3>
            <span class="dark:text-white/60 text-sm font-normal leading-normal whitespace-nowrap">
              {{ user?.email }}
            </span>
          </div>
        </div>

        <RouterLink
          to="/settings"
          class="flex items-center gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5 rounded-lg transition-colors"
          :title="!isExpanded ? 'Settings' : ''"
        >
          <span class="material-symbols-outlined">settings</span>
          <span v-show="isExpanded" class="text-sm font-medium leading-normal whitespace-nowrap">
            Sozlamalar
          </span>
        </RouterLink>

        <RouterLink
          to="/auth/login"
          @click="$router.push('/auth/login')"
          class="flex items-center gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          :title="!isExpanded ? 'Tizimdan chiqish' : ''"
        >
          <span class="material-symbols-outlined">logout</span>
          <span
            v-show="isExpanded"
            class="text-sm font-medium leading-normal whitespace-nowrap dark:text-white/70"
          >
            Tizimdan chiqish
          </span>
        </RouterLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main
      v-if="!isPending"
      :class="[
        'w-full 2xl:px-12 p-6 transition-all duration-300 overflow-hidden relative',
        isMobile ? 'ml-0' : isExpanded ? 'ml-80' : 'ml-20',
      ]"
    >
      <RouterView v-slot="{ Component, route }">
        <Transition :name="(route.meta.transition as string) || defaultTransition">
          <div :key="route.path" class="page-wrapper">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>
  </div>
  <MobileMenu v-if="isMobile"></MobileMenu>
</template>

<style>
.router-link-active,
.router-link-exact-active {
  background-color: var(--color-primary);
  border-radius: 8px;
  color: white;
}

/* Page Transitions */
.page-wrapper {
  width: 100%;
  overflow-x: hidden;
}
</style>
