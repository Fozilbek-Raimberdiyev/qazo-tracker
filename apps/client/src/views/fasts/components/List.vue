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
    <div class="flex flex-col gap-2 mb-8">
      <TypographyTitle :level="2"> Qazo ro'zalar </TypographyTitle>
      <TypographyText type="secondary">
        Qazo ro'zalaringizni ko'ring va ularni o'zgartiring
      </TypographyText>
    </div>
    <div class="grid lg:grid-cols-4 gap-4">
      <div class="lg:col-span-3 col-span-4">
        <BaseBox>
          <!-- Calendar Container -->
          <div>
            <!-- Main Calendar Card -->
            <div class="">
              <!-- Calendar Header -->
              <div class="py-6 px-4">
                <div class="flex justify-between items-center">
                  <BaseButton @click="year--" :disabled="year === fastingMinYear">
                    Avvalgi yil
                  </BaseButton>
                  <div class="text-center">
                    <h3 class="font-display text-3xl font-bold text-primary tracking-widest">
                      Ramazon
                    </h3>
                    <div class="flex items-center justify-center gap-2 mt-1">
                      <span class="h-px w-8 bg-primary/50"></span>
                      <span class="font-body text-xl text-slate-300"
                        >{{ data?.[0]?.hijri_year }} Hijri</span
                      >
                      <span class="h-px w-8 bg-primary/50"></span>
                    </div>
                  </div>
                  <BaseButton @click="year++" :disabled="year === fastingMaxYear">
                    Keyingi yil
                  </BaseButton>
                </div>
              </div>

              <!-- Days Grid -->
              <div
                class="p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
              >
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
                    <div
                      :class="['absolute inset-1 rounded-t-[48%] rounded-b-md pointer-events-none']"
                    ></div>

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
                          'absolute top-2 w-2 h-2 rounded-full',
                          day.isCompleted ? 'bg-primary shadow-glow' : 'bg-primary/30',
                        ]"
                      ></div>
                      <span
                        :class="[
                          'font-display 2xl:text-5xl md:text-2xl font-bold 2xl:mt-2 mt-4',
                          day.isCompleted ? 'text-primary' : 'text-slate-500',
                        ]"
                      >
                        {{ day.day_of_ramadan?.toString().padStart(2, '0') }}
                      </span>
                      <span
                        :class="[
                          'text-xs font-bold tracking-[0.2em] uppercase mt-1',
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
                      :class="['h-[65%] p-4 flex flex-col justify-between']"
                    >
                      <!-- Date -->
                      <div class="text-center -mt-2 mb-2">
                        <span :class="['text-xs font-mono']">
                          {{ dayjs(day.date).format('DD MMMM, YYYY') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseBox>
      </div>
      <div class="lg:col-span-1">
        <div class="lg:col-span-1 sticky top-0 h-full">
          <div class="space-y-6">
            <BaseBox>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Oylik samaradorlik</h3>
              <div class="mt-4 flex flex-col gap-6">
                <div class="flex items-center justify-between gap-2">
                  <div class="">
                    <CircleProgressBar
                      :max="100"
                      :color-unfilled="primaryColor"
                      :value="monthlyProgress"
                    >
                      <span class="text-xl font-bold text-gray-500 dark:text-white"
                        >{{ monthlyProgress }}%</span
                      >
                    </CircleProgressBar>
                  </div>
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                      <span class="size-3 rounded-full bg-primary"></span>
                      <span class="text-sm text-gray-500"
                        >Tutilgan: <span class="font-bold">{{ stats?.completedCount }}</span></span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="size-3 rounded-full bg-red-500"></span>
                      <span class="text-sm text-gray-500"
                        >Tutilmagan:
                        <span class="font-bold">{{ stats?.uncompletedCount }}</span></span
                      >
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                      Jami ro'zalar: <span class="">{{ stats?.totalCount }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </BaseBox>
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      v-model="showModal"
      :title="'Ramazon ' + (selectedDay ? selectedDay.day_of_ramadan + '-kun' : '')"
    >
      <!-- Modal Content -->
      <div v-if="selectedDay" class="p-8">
        <!-- Header -->
        <div class="text-center">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-2 border-primary mb-4"
          >
            <span class="font-display text-4xl font-bold text-primary">
              {{ selectedDay.day_of_ramadan?.toString().padStart(2, '0') }}
            </span>
          </div>
          <h2 class="text-2xl font-bold mb-2">Ramazon {{ selectedDay.day_of_ramadan }}-kun</h2>
          <p class="text-slate-400">
            {{ dayjs(selectedDay.date).format('DD MMMM, YYYY') }}
          </p>
        </div>
        <div class="flex justify-center my-4">
          <Tag
            v-if="selectedDay.isCompleted"
            color="success"
            class="h-8! flex! items-center! justify-center! text-base! w-1/2"
            bordered
            >Ro'za tutilgan</Tag
          >
          <Tag v-else class="h-8! flex! items-center! justify-center! text-base! w-1/2" bordered
            >Ro'za tutilmagan</Tag
          >
        </div>

        <!-- Duolar - Collapse -->
        <Collapse class="mb-8 bg-transparent border-none" expand-icon-position="end">
          <!-- Saharlik Duosi -->
          <CollapsePanel key="saharlik">
            <template #header>
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-2xl">wb_twilight</span>
                <span class="text-lg font-bold">Saharlik (Og'iz ochish) duosi</span>
              </div>
            </template>
            <div class="p-4">
              <p class="leading-relaxed whitespace-pre-line text-sm">
                {{ saharlikDuosi }}
              </p>
            </div>
          </CollapsePanel>

          <!-- Iftorlik Duosi -->
          <CollapsePanel key="iftorlik">
            <template #header>
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-2xl">nightlight</span>
                <span class="text-lg font-bold">Iftorlik (Og'iz yopish) duosi</span>
              </div>
            </template>
            <div class="p-4">
              <p class="leading-relaxed whitespace-pre-line text-sm">
                {{ iftorlikDuosi }}
              </p>
            </div>
          </CollapsePanel>
        </Collapse>

        <div class="mt-6">
          <BaseButton
            @click="handleCompleteClick"
            :loading="isPendingComplete"
            v-if="!selectedDay.isCompleted"
            class="w-full"
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
</style>
