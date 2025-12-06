<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuItemsList } from './composables/useMenuItemsList'

const router = useRouter()
const { menuItemsList } = useMenuItemsList()
const isExpanded = ref(true)
const originPosition = ref({ x: 0, y: 0 })

// Transition speed control (in seconds)
const transitionSpeed = ref(0.8) // Adjust this value to change animation speed

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const captureOrigin = (event: MouseEvent) => {
  originPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

const setOriginFromButton = () => {
  const button = document.querySelector('.toggle-button') as HTMLElement
  if (button) {
    const rect = button.getBoundingClientRect()
    originPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }
}

// Set origin position before each navigation
router.beforeEach(() => {
  setOriginFromButton()
})
</script>

<template>
  <div class="flex min-h-screen font-display bg-background-light dark:bg-background-dark overflow-x-hidden">
    <!-- Side Navigation Bar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-screen shrink-0 p-4 flex flex-col justify-between sidebar border-r border-solid border-(--color-border) transition-all duration-300 z-10',
        isExpanded ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Toggle Button - Positioned on border -->
      <button
        @click="toggleSidebar"
        class="toggle-button absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-800 border border-solid border-(--color-border) rounded-full shadow-md hover:shadow-lg transition-all dark:text-white/70 dark:hover:text-white z-20"
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
            @click="captureOrigin"
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
            !isExpanded && 'justify-center'
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
          @click="captureOrigin"
        >
          <span class="material-symbols-outlined">settings</span>
          <span v-show="isExpanded" class="text-sm font-medium leading-normal whitespace-nowrap">
            Settings
          </span>
        </RouterLink>

        <button
          @click="router.push('/auth/login')"
          class="flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          :title="!isExpanded ? 'Log Out' : ''"
        >
          <span class="material-symbols-outlined">logout</span>
          <span v-show="isExpanded" class="text-sm font-medium leading-normal whitespace-nowrap">
            Log Out
          </span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main
      :class="[
        'w-full py-6 transition-all duration-300 overflow-hidden relative',
        isExpanded ? 'ml-64' : 'ml-20'
      ]"
      :style="{
        '--origin-x': `${originPosition.x}px`,
        '--origin-y': `${originPosition.y}px`,
        '--transition-duration': `${transitionSpeed}s`,
        '--transition-duration-out': `${transitionSpeed * 0.7}s`
      }"
    >
      <RouterView v-slot="{ Component, route }">
        <Transition
          :name="route.meta.transition as string || 'zoom-origin'"
          mode="out-in"
        >
          <div :key="route.path" class="page-wrapper">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
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

.sidebar {
  background-color: var(--color-background-dark, #1a1a1a);
}

/* Page Transitions */
.page-wrapper {
  width: 100%;
  overflow-x: hidden;
}

/* Ant Design Modal-style Zoom Origin with Circular Reveal */
.zoom-origin-enter-active {
  animation: antZoomIn var(--transition-duration, 0.65s) cubic-bezier(0.23, 1, 0.32, 1);
  animation-fill-mode: both;
}

.zoom-origin-leave-active {
  animation: antZoomOut var(--transition-duration-out, 0.45s) cubic-bezier(0.23, 1, 0.32, 1);
  animation-fill-mode: both;
}

@keyframes antZoomIn {
  0% {
    opacity: 0;
    transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);
    transform: scale(0.1);
    clip-path: circle(2% at var(--origin-x, 50%) var(--origin-y, 50%));
  }
  1% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);
    transform: scale(1);
    clip-path: circle(150% at var(--origin-x, 50%) var(--origin-y, 50%));
  }
}

@keyframes antZoomOut {
  0% {
    opacity: 1;
    transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);
    transform: scale(1);
    clip-path: circle(150% at var(--origin-x, 50%) var(--origin-y, 50%));
  }
  99% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform-origin: var(--origin-x, 50%) var(--origin-y, 50%);
    transform: scale(0.1);
    clip-path: circle(2% at var(--origin-x, 50%) var(--origin-y, 50%));
  }
}

/* Fade + Slide Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Fade Only Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale Transition */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Slide Up Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

/* Zoom Transition */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
