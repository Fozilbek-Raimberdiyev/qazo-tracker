<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

// Theme mode: 'light', 'dark'
const themeMode = ref<'light' | 'dark'>(isDark.value ? 'dark' : 'light')

const setTheme = (mode: 'light' | 'dark') => {
  themeMode.value = mode

  if (mode === 'light') {
    if (isDark.value) {
      themeStore.toggleTheme()
    }
  } else if (mode === 'dark') {
    if (!isDark.value) {
      themeStore.toggleTheme()
    }
  }
}

const isActiveMode = (mode: 'light' | 'dark') => {
  return themeMode.value === mode
}
</script>

<template>
  <div class="w-full md:w-3/4">
    <div class="flex flex-col gap-8">
      <header>
        <h1
          class="text-2xl font-bold leading-tight tracking-tight text-text-light dark:text-text-dark"
        >
          Appearance
        </h1>
        <p class="mt-1 text-subtle-light dark:text-subtle-dark">
          Customize the look and feel of the application.
        </p>
      </header>

      <section class="flex flex-col gap-4">
        <div class="border-b border-border-light dark:border-border-dark pb-4">
          <h2
            class="text-xl font-semibold leading-tight text-text-light dark:text-text-dark"
          >
            Theme
          </h2>
          <p class="mt-1 text-sm text-subtle-light dark:text-subtle-dark">
            Select your preferred interface theme.
          </p>
        </div>

        <div
          class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <p class="font-medium">Theme mode</p>
          <div
            class="flex items-center gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          >
            <button
              @click="setTheme('light')"
              :class="[
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer',
                isActiveMode('light')
                  ? 'bg-white text-gray-900 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              <span class="material-symbols-outlined !text-base">light_mode</span>
              Light
            </button>

            <button
              @click="setTheme('dark')"
              :class="[
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer',
                isActiveMode('dark')
                  ? 'bg-gray-700 text-white shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              ]"
            >
              <span class="material-symbols-outlined !text-base">dark_mode</span>
              Dark
            </button>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <div class="border-b border-border-light dark:border-border-dark pb-4">
          <h2
            class="text-xl font-semibold leading-tight text-text-light dark:text-text-dark"
          >
            Preferences
          </h2>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-text-light dark:text-text-dark">
              Show avatars
            </h3>
            <p class="text-sm text-subtle-light dark:text-subtle-dark">
              Display user avatars throughout the application.
            </p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input checked class="peer sr-only" type="checkbox" />
            <div
              class="peer h-6 w-11 rounded-full bg-border-light after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700"
            ></div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-medium text-text-light dark:text-text-dark">
              Compact UI
            </h3>
            <p class="text-sm text-subtle-light dark:text-subtle-dark">
              Reduce spacing to fit more content on the screen.
            </p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input class="peer sr-only" type="checkbox" />
            <div
              class="peer h-6 w-11 rounded-full bg-border-light after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-700"
            ></div>
          </label>
        </div>
      </section>
    </div>
  </div>
</template>
