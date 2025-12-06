<script setup lang="ts">
import { ref } from 'vue'
import { useMenuItemsList } from './composables/useMenuItemsList'

const { menuItemsList } = useMenuItemsList()
const isExpanded = ref(true)

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="flex min-h-screen font-display bg-background-light dark:bg-background-dark">
    <!-- Side Navigation Bar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-screen shrink-0 p-4 flex flex-col justify-between sidebar border-r border-solid border-(--color-border-light) dark:border-(--color-border-dark) transition-all duration-300 z-10',
        isExpanded ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Toggle Button - Positioned on border -->
      <button
        @click="toggleSidebar"
        class="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-800 border border-solid border-(--color-border) rounded-full shadow-md hover:shadow-lg transition-all dark:text-white/70 dark:hover:text-white z-20"
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

        <nav class="flex flex-col gap-2">
          <RouterLink
            v-for="(item, index) in menuItemsList"
            :key="index"
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
        </nav>
      </div>

      <div class="flex flex-col gap-1 pb-2">
        <div
          :class="[
            'flex items-center gap-4 p-3 border-t border-white/10',
            !isExpanded && 'justify-center',
          ]"
        >
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            data-alt="User avatar image"
            style="
              background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCcTQnXUatckdJ09_7CEZcm5-n85ZHypQ7Y7Am49kc0N7wdbuTpymfkH-CmPPOsOKPx1HFBwhixLYQQu-w_28P5xE6M3BlewnspqPS0rGwN4OcWHZvfAtMebCkkZ4fye7XUPmIEFnqaKB3iwE7c_zLTWDUZZNgceQQ6jrW4JTeaznj7S8PeVHr-p-cq8G4vIeU5pM9j0UwUsnHu17duPXUvLzDUuytrxlKkoWdbbcfm384tAFUQnzv2GwNPwC-Payl__xht2dgb3GY');
            "
          ></div>
          <div v-show="isExpanded" class="flex flex-col overflow-hidden">
            <h3 class="dark:text-white text-base font-medium leading-normal whitespace-nowrap">
              Aisha Khan
            </h3>
            <span class="dark:text-white/60 text-sm font-normal leading-normal whitespace-nowrap">
              aisha.khan@email.com
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
            Settings
          </span>
        </RouterLink>

        <RouterLink  to="/auth/login"
          @click="$router.push('/auth/login')"
          class="flex items-center gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          :title="!isExpanded ? 'Log Out' : ''"
        >
          <span class="material-symbols-outlined">logout</span>
          <span v-show="isExpanded" class="text-sm font-medium leading-normal whitespace-nowrap dark:text-white/70">
            Log Out
          </span>
        </RouterLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main :class="['w-full py-6 transition-all duration-300', isExpanded ? 'ml-64' : 'ml-20']">
      <RouterView></RouterView>
    </main>
  </div>
</template>

<style>
.router-link-active,
.router-link-exact-active {
  background-color: var(--color-primary);
  border-radius: 8px;
  color: white;
}
</style>
