<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import confetti from '@hiseb/confetti'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CircleProgressBar } from 'circle-progress.vue'
import { computed, ref } from 'vue'
import { useList } from '../composables/useList'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user.store'
import { hexToRgba } from '@/utils/color.util'
import { useCompleteFastingMutation } from '../composables/useCompleteFastingMutation'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import BaseSpin from '@/components/BaseSpin/BaseSpin.vue'
import { Collapse, CollapsePanel, Tag, TypographyText, TypographyTitle } from 'ant-design-vue'
import BaseModal from '@/components/BaseModal/BaseModal.vue'
import type { IFasting } from '@/types/fasting.types'

const { user } = storeToRefs(useUserStore())
const { fastingList: data, year, isPending, data: stats } = useList()
const { isPending: isPendingComplete, mutateAsync } = useCompleteFastingMutation()

const fastingMinYear = computed(() => {
  return new Date(user.value?.minFastingDate || '').getFullYear()
})

const { primaryColor } = storeToRefs(useThemeStore())

const fastingMaxYear = computed(() => {
  return new Date(user.value?.maxFastingDate || '').getFullYear()
})

const monthlyProgress = computed(() => {
  if (!stats.value) return 0
  const total = stats.value.totalCount
  const completed = stats.value.completedCount
  if (total === 0) return 0
  return Math.floor((completed / total) * 100)
})

// Modal state
const showModal = ref(false)
const selectedDay = ref<IFasting | null>(null)

// Duolar
const saharlikDuosi = `Навайту ан асума савма шаҳри Рамазона мина л-фажри ила л-мағриби, холисан лиллаҳи таъала, Аллоҳумма инний лака сумту ва бика оманту ва алайка таваккалту ва ала ризқика афтарту.

(Маъноси: Эртага тонг отишидан то қуёш ботгунча Рамазон ойининг рўзасини тутмоқни ният қилдим, холис Аллоҳ таоло учун. Эй Аллоҳ, Сенинг учун рўза тутдим, Сенга иймон келтирдим, Сенга таваккал қилдим ва Сенинг ризқинг билан ифтор қилдим.)`

const iftorlikDuosi = `Аллоҳумма лака сумту ва бика аманту ва алайка таваккалту ва ала ризқика афтарту, фағфирлий ма қоддамту ва ма аххорту, биррохматика я арҳама р-роҳимийн.

(Маъноси: Эй Аллоҳ, Сен учун рўза тутдим, Сенга иймон келтирдим, Сенга таваккал қилдим ва Сенинг ризқинг билан ифтор қилдим. Энг раҳмли, раҳматинг ила илдим-кейинлик қилган гуноҳларимни мағфират қил.)`

const openDayModal = (day: IFasting) => {
  selectedDay.value = day
  showModal.value = true
}

function handleCompleteClick() {
  if (!selectedDay.value) return
  mutateAsync(selectedDay.value.id).then(() => {
    setTimeout(() => {
      if (monthlyProgress.value == 100) {
        confetti({ count: 1000, size: 1, velocity: 500 })
      }
    }, 100)
    showModal.value = false
  })
}
</script>

<template>
  <BaseSpin :spinning="isPending">
    <!-- Header - Responsive -->
    <div class="flex flex-col gap-2 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
      <TypographyTitle :level="2" class="!text-xl sm:!text-2xl md:!text-3xl">
        Qazo ro'zalar
      </TypographyTitle>
      <TypographyText type="secondary" class="text-sm sm:text-base">
        Qazo ro'zalaringizni ko'ring va ularni o'zgartiring
      </TypographyText>
    </div>

    <!-- Main Grid - Responsive Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 px-2 sm:px-0">
      <!-- Calendar Section -->
      <div class="lg:col-span-3 order-2 lg:order-1">
        <BaseBox>
          <div>
            <!-- Calendar Header - Responsive -->
            <div class="py-4 sm:py-6 px-2 sm:px-4">
              <div class="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <!-- Previous Button -->
                <BaseButton
                  @click="year--"
                  :disabled="year === fastingMinYear"
                  class="w-full sm:w-auto order-1 sm:order-1"
                  size="small"
                >
                  <span class="hidden sm:inline">Avvalgi yil</span>
                  <span class="sm:hidden">← Avvalgi</span>
                </BaseButton>

                <!-- Title -->
                <div class="text-center order-2 sm:order-2">
                  <h3 class="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary tracking-widest">
                    Ramazon
                  </h3>
                  <div class="flex items-center justify-center gap-2 mt-1">
                    <span class="h-px w-4 sm:w-8 bg-primary/50"></span>
                    <span class="font-body text-base sm:text-xl text-slate-300">
                      {{ data?.[0]?.hijri_year }} Hijri
                    </span>
                    <span class="h-px w-4 sm:w-8 bg-primary/50"></span>
                  </div>
                </div>

                <!-- Next Button -->
                <BaseButton
                  @click="year++"
                  :disabled="year === fastingMaxYear"
                  class="w-full sm:w-auto order-3 sm:order-3"
                  size="small"
                >
                  <span class="hidden sm:inline">Keyingi yil</span>
                  <span class="sm:hidden">Keyingi →</span>
                </BaseButton>
              </div>
            </div>

            <!-- Days Grid - Responsive -->
            <div class="p-4 sm:p-6 md:p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              <div
                v-for="day in data"
                :key="day.day_of_ramadan"
                class="group relative flex flex-col items-center cursor-pointer"
                @click="openDayModal(day)"
              >
                <div
                  :class="[
                    'relative w-full aspect-3/4 rounded-t-[50%] rounded-b-lg overflow-hidden transition-all duration-300 hover:scale-105',
                    day.isCompleted ? 'completed' : 'uncompleted',
                  ]"
                >
                  <!-- Inner Border -->
                  <div :class="['absolute inset-1 rounded-t-[48%] rounded-b-md pointer-events-none']"></div>

                  <!-- Top Section with Day Number -->
                  <div
                    :class="[
                      'h-[35%] flex flex-col items-center justify-center border-b relative',
                      day.isCompleted
                        ? 'border-primary/30 bg-linear-to-b from-primary/20 to-transparent'
                        : 'border-primary/10 bg-linear-to-b from-white/5 to-transparent',
                    ]"
                  >
                    <div
                      :class="[
                        'absolute top-1 sm:top-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full',
                        day.isCompleted ? 'bg-primary shadow-glow' : 'bg-primary/30',
                      ]"
                    ></div>
                    <span
                      :class="[
                        'font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mt-2 sm:mt-3 md:mt-4',
                        day.isCompleted ? 'text-primary' : 'text-slate-500',
                      ]"
                    >
                      {{ day.day_of_ramadan?.toString().padStart(2, '0') }}
                    </span>
                    <span
                      :class="[
                        'text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] uppercase mt-0.5 sm:mt-1',
                        day.isCompleted ? 'text-slate-300' : 'text-slate-600',
                      ]"
                    >
                      Ramazon
                    </span>
                  </div>

                  <!-- Bottom Section with Details -->
                  <div
                    :style="{
                      backgroundColor: day.isCompleted
                        ? hexToRgba('#13ec5b', 0.1)
                        : hexToRgba('#6b7280', 0.1),
                    }"
                    :class="['h-[65%] p-2 sm:p-3 md:p-4 flex flex-col justify-between']"
                  >
                    <!-- Date -->
                    <div class="text-center -mt-1 sm:-mt-2 mb-1 sm:mb-2">
                      <span :class="['text-[10px] sm:text-xs font-mono']">
                        {{ dayjs(day.date).format('DD MMM, YYYY') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseBox>
      </div>

      <!-- Stats Section - Responsive -->
      <div class="lg:col-span-1 order-1 lg:order-2">
        <div class="lg:sticky lg:top-4">
          <BaseBox>
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Oylik samaradorlik
            </h3>
            <div class="mt-4 flex flex-col gap-4 sm:gap-6">
              <div class="flex items-center justify-between gap-2 sm:gap-4">
                <!-- Progress Circle -->
                <div class="flex-shrink-0">
                  <CircleProgressBar
                    :max="100"
                    :color-unfilled="primaryColor"
                    :value="monthlyProgress"
                    :size="80"
                  >
                    <span class="text-lg sm:text-xl font-bold text-gray-500 dark:text-white">
                      {{ monthlyProgress }}%
                    </span>
                  </CircleProgressBar>
                </div>

                <!-- Stats -->
                <div class="flex flex-col gap-1.5 sm:gap-2 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="size-2.5 sm:size-3 rounded-full bg-primary flex-shrink-0"></span>
                    <span class="text-xs sm:text-sm text-gray-500">
                      Tutilgan: <span class="font-bold">{{ stats?.completedCount }}</span>
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="size-2.5 sm:size-3 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span class="text-xs sm:text-sm text-gray-500">
                      Tutilmagan: <span class="font-bold">{{ stats?.uncompletedCount }}</span>
                    </span>
                  </div>
                  <p class="text-[11px] sm:text-xs text-gray-500 mt-1">
                    Jami ro'zalar: <span class="font-medium">{{ stats?.totalCount }}</span>
                  </p>
                </div>
              </div>
            </div>
          </BaseBox>
        </div>
      </div>
    </div>

    <!-- Modal - Responsive -->
    <BaseModal
      v-model="showModal"
      :title="'Ramazon ' + (selectedDay ? selectedDay.day_of_ramadan + '-kun' : '')"
      :width="'95%'"
      :style="{ maxWidth: '600px' }"
    >
      <div v-if="selectedDay" class="p-4 sm:p-6 md:p-8">
        <!-- Header -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 border-2 border-primary mb-3 sm:mb-4">
            <span class="font-display text-3xl sm:text-4xl font-bold text-primary">
              {{ selectedDay.day_of_ramadan?.toString().padStart(2, '0') }}
            </span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold mb-2">
            Ramazon {{ selectedDay.day_of_ramadan }}-kun
          </h2>
          <p class="text-sm sm:text-base text-slate-400">
            {{ dayjs(selectedDay.date).format('DD MMMM, YYYY') }}
          </p>
        </div>

        <!-- Tag -->
        <div class="flex justify-center my-3 sm:my-4">
          <Tag
            v-if="selectedDay.isCompleted"
            color="success"
            class="h-7 sm:h-8! flex! items-center! justify-center! text-sm sm:text-base! w-full sm:w-1/2"
            bordered
          >
            Ro'za tutilgan
          </Tag>
          <Tag
            v-else
            class="h-7 sm:h-8! flex! items-center! justify-center! text-sm sm:text-base! w-full sm:w-1/2"
            bordered
          >
            Ro'za tutilmagan
          </Tag>
        </div>

        <!-- Duolar - Collapse -->
        <Collapse class="mb-6 sm:mb-8 bg-transparent border-none" expand-icon-position="end">
          <!-- Saharlik Duosi -->
          <CollapsePanel key="saharlik">
            <template #header>
              <div class="flex items-center gap-2 sm:gap-3">
                <span class="material-symbols-outlined text-primary text-xl sm:text-2xl">wb_twilight</span>
                <span class="text-sm sm:text-base md:text-lg font-bold">Saharlik (Og'iz ochish) duosi</span>
              </div>
            </template>
            <div class="p-3 sm:p-4">
              <p class="leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                {{ saharlikDuosi }}
              </p>
            </div>
          </CollapsePanel>

          <!-- Iftorlik Duosi -->
          <CollapsePanel key="iftorlik">
            <template #header>
              <div class="flex items-center gap-2 sm:gap-3">
                <span class="material-symbols-outlined text-primary text-xl sm:text-2xl">nightlight</span>
                <span class="text-sm sm:text-base md:text-lg font-bold">Iftorlik (Og'iz yopish) duosi</span>
              </div>
            </template>
            <div class="p-3 sm:p-4">
              <p class="leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                {{ iftorlikDuosi }}
              </p>
            </div>
          </CollapsePanel>
        </Collapse>

        <!-- Button -->
        <div class="mt-4 sm:mt-6">
          <BaseButton
            @click="handleCompleteClick"
            :loading="isPendingComplete"
            v-if="!selectedDay.isCompleted"
            class="w-full text-sm sm:text-base"
            type="primary"
          >
            Ro'zani o'qilgan qilish
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </BaseSpin>
</template>

<style scoped>
.completed {
  border: 1px solid #13ec5b;
  background-color: v-bind(hexToRgba('#13ec5b', 0.1));
}

.uncompleted {
  border: 1px solid v-bind(hexToRgba('#6b7280', 0.5));
  background-color: v-bind(hexToRgba('#6b7280', 0.1));
}

/* Custom scrollbar for mobile */
@media (max-width: 640px) {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}
</style>
