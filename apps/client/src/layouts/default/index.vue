<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuItemsList } from './composables/useMenuItemsList'
import { useLocalStorage } from '@vueuse/core'
import { useAuth } from '@/composables/useAuth'
const { user, isPending } = useAuth()
const router = useRouter()
const { menuItemsList } = useMenuItemsList()
const originPosition = ref({ x: 0, y: 0 })
const isExpanded = useLocalStorage('isExpanded', true)
// Transition speed control (in seconds)
const transitionSpeed = ref(0.5) // Adjust this value to change animation speed

// Available transition effects:
// 'circle-expand' - Circle expands from top center (RECOMMENDED)
// 'slide-fade' - Smooth slide with fade
// 'zoom-origin' - Zoom from button position
// 'flip-card' - 3D card flip effect
// 'blur-fade' - Fade with blur effect
// 'slide-vertical' - Slide from bottom
const defaultTransition = ref('blue-fade')

const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

const captureOrigin = () => {
  // Get main content area position
  const mainContent = document.querySelector('main') as HTMLElement
  if (mainContent) {
    const rect = mainContent.getBoundingClientRect()
    originPosition.value = {
      x: rect.left + rect.width / 2, // Center horizontally
      y: rect.top, // Top of main content
    }
  }
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
      :class="[
        'fixed top-0 left-0 h-screen shrink-0 p-4 flex flex-col justify-between sidebar border-r border-solid border-(--color-border-light) dark:border-(--color-border-dark) transition-all duration-300 z-10',
        isExpanded ? 'w-80' : 'w-20',
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
          @click="captureOrigin"
        >
          <span class="material-symbols-outlined">settings</span>
          <span v-show="isExpanded" class="text-sm font-medium leading-normal whitespace-nowrap">
            Settings
          </span>
        </RouterLink>

        <RouterLink
          to="/auth/login"
          @click="$router.push('/auth/login')"
          class="flex items-center gap-3 px-3 py-2 dark:text-white/70 dark:hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          :title="!isExpanded ? 'Log Out' : ''"
        >
          <span class="material-symbols-outlined">logout</span>
          <span
            v-show="isExpanded"
            class="text-sm font-medium leading-normal whitespace-nowrap dark:text-white/70"
          >
            Log Out
          </span>
        </RouterLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main
      v-if="!isPending"
      :class="[
        'w-full 2xl:px-12 p-6 transition-all duration-300 overflow-hidden relative',
        isExpanded ? 'ml-80' : 'ml-20',
      ]"
      :style="{
        '--origin-x': `${originPosition.x}px`,
        '--origin-y': `${originPosition.y}px`,
        '--transition-duration': `${transitionSpeed}s`,
        '--transition-duration-out': `${transitionSpeed * 0.7}s`,
      }"
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

/* CIRCLE EXPAND - From top center of main content (RECOMMENDED) */
.circle-expand-enter-active {
  animation: circleExpandIn var(--transition-duration, 0.7s) cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-fill-mode: both;
}

.circle-expand-leave-active {
  animation: circleExpandOut var(--transition-duration-out, 0.3s) ease-out;
  animation-fill-mode: both;
  position: absolute;
  width: 100%;
}

@keyframes circleExpandIn {
  0% {
    opacity: 0;
    clip-path: circle(0% at 50% 0%);
  }
  1% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    clip-path: circle(150% at 50% 0%);
  }
}

@keyframes circleExpandOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* 1. SLIDE FADE - Gentle and eye-friendly */
.slide-fade-enter-active {
  animation: slideFadeIn var(--transition-duration, 0.4s) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
  animation: slideFadeOut var(--transition-duration-out, 0.3s) cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes slideFadeIn {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFadeOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-30px);
  }
}

/* 2. ZOOM ORIGIN - From button position */
.zoom-origin-enter-active {
  animation: antZoomIn var(--transition-duration, 0.5s) cubic-bezier(0.23, 1, 0.32, 1);
  animation-fill-mode: both;
}

.zoom-origin-leave-active {
  animation: antZoomOut var(--transition-duration-out, 0.35s) cubic-bezier(0.23, 1, 0.32, 1);
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

/* 3. FLIP CARD - 3D card flip effect */
.flip-card-enter-active {
  animation: flipCardIn var(--transition-duration, 0.5s) cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
}

.flip-card-leave-active {
  animation: flipCardOut var(--transition-duration-out, 0.4s) cubic-bezier(0.55, 0.085, 0.68, 0.53);
  transform-style: preserve-3d;
}

@keyframes flipCardIn {
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateY(-90deg);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg);
  }
}

@keyframes flipCardOut {
  0% {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg);
  }
  100% {
    opacity: 0;
    transform: perspective(1000px) rotateY(90deg);
  }
}

/* 4. BLUR FADE - Smooth blur transition */
.blur-fade-enter-active {
  animation: blurFadeIn var(--transition-duration, 0.4s) ease-out;
}

.blur-fade-leave-active {
  animation: blurFadeOut var(--transition-duration-out, 0.3s) ease-in;
}

@keyframes blurFadeIn {
  0% {
    opacity: 0;
    filter: blur(10px);
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
}

@keyframes blurFadeOut {
  0% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
  100% {
    opacity: 0;
    filter: blur(10px);
    transform: scale(0.98);
  }
}

/* 5. SLIDE VERTICAL - Bottom to top */
.slide-vertical-enter-active {
  animation: slideVerticalIn var(--transition-duration, 0.4s) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-vertical-leave-active {
  animation: slideVerticalOut var(--transition-duration-out, 0.3s)
    cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes slideVerticalIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideVerticalOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-40px);
  }
}

/* OLD TRANSITIONS - Keep for backward compatibility */
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
