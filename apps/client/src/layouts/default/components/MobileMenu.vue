<script setup lang="ts">
import { useMenuItemsList } from '../composables/useMenuItemsList'
const { menuItemsList } = useMenuItemsList()
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 z-10">
    <nav class="flex justify-between gap-2">
      <RouterLink
        v-for="(item, index) in menuItemsList"
        :key="index"
        class="flex items-center gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        :to="item.path"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
      </RouterLink>
    </nav>
  </div>
</template>
