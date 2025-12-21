<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { computed, ref } from 'vue'
import { useList } from '../composables/useList'
import { useUserStore } from '@/stores/user.store'
import { hexToRgba } from '@/utils/color.util'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import BaseSpin from '@/components/BaseSpin/BaseSpin.vue'
const { user } = storeToRefs(useUserStore())
const { data, year,isPending } = useList()
const fastingMinYear = computed(() => {
  return new Date(user.value?.minFastingDate || '').getFullYear()
})

const fastingMaxYear = computed(() => {
  return new Date(user.value?.maxFastingDate || '').getFullYear()
})
interface FastingDay {
  day: number
  hijriDate: string
  gregorianDate: string
  isCompleted: boolean
  prayers: {
    fajr: boolean
    dhuhr: boolean
    asr: boolean
    maghrib: boolean
    isha: boolean
  }
}

const props = defineProps<{
  fastingDays?: FastingDay[]
}>()

const emit = defineEmits<{
  toggleFast: [day: number]
}>()

// Mock data
const days = ref<FastingDay[]>(
  props.fastingDays ||
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      hijriDate: `1445/09/${(i + 1).toString().padStart(2, '0')}`,
      gregorianDate: `Mar ${11 + i}, 2024`,
      isCompleted: i === 0, // Faqat birinchi kun completed
      prayers: {
        fajr: i === 0,
        dhuhr: i === 0,
        asr: i === 0,
        maghrib: false,
        isha: false,
      },
    })),
)

const toggleFasting = (dayNum: number) => {
  const day = days.value.find((d) => d.day === dayNum)
  if (day) {
    day.isCompleted = !day.isCompleted
    emit('toggleFast', dayNum)
  }
}
</script>

<template>
  <BaseSpin :spinning="isPending">
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
              <h3
                class="font-display text-3xl font-bold text-primary tracking-widest drop-shadow-md"
              >
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
            class="group relative flex flex-col items-center"
          >
            <div
              :class="[
                'relative w-full aspect-3/4 rounded-t-[50%] rounded-b-lg overflow-hidden transition-all duration-300',
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
                    'font-display text-5xl font-bold mt-2',
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
                :class="[
                  'h-[65%] p-4 flex flex-col justify-between',
                  day.isCompleted ? 'bg-emerald-900/30' : 'bg-transparent opacity-60',
                ]"
              >
                <!-- Date -->
                <div class="text-center -mt-2 mb-2">
                  <span
                    :class="[
                      'text-xs font-mono',
                      day.isCompleted ? 'text-primary/60' : 'text-slate-600',
                    ]"
                  >
                    {{ dayjs(day.date).format('DD MMMM, YYYY') }}
                  </span>
                </div>

                <!-- Fast Toggle -->
                <div
                  :class="[
                    'mt-2 rounded-lg p-2 flex items-center justify-between',
                    day.isCompleted
                      ? 'bg-black/20 border border-primary/10'
                      : 'bg-black/10 border border-slate-700/50',
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'material-symbols-outlined text-sm',
                        day.isCompleted ? 'text-primary' : 'text-slate-600',
                      ]"
                    >
                      nightlight
                    </span>
                    <span
                      :class="[
                        'text-xs font-bold',
                        day.isCompleted ? 'text-slate-300' : 'text-slate-500',
                      ]"
                    >
                      Fast
                    </span>
                  </div>

                  <button
                    v-if="day.isCompleted"
                    @click="toggleFasting(day.day_of_ramadan)"
                    class="relative inline-block w-8 h-4"
                  >
                    <input
                      type="checkbox"
                      :checked="day.isCompleted"
                      class="toggle-checkbox absolute block w-4 h-4 rounded-full bg-primary border-4 appearance-none cursor-pointer checked:right-0 checked:border-primary"
                      :id="`toggle${day.day_of_ramadan}`"
                    />
                    <label
                      class="toggle-label block overflow-hidden h-4 rounded-full bg-emerald-950 cursor-pointer border border-primary/30"
                      :for="`toggle${day.day_of_ramadan}`"
                    ></label>
                  </button>
                  <span v-else class="material-symbols-outlined text-slate-600 text-lg">
                    lock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseBox>
  </BaseSpin>

</template>

<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #d4af37;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #164b44;
}

.toggle-checkbox {
  right: 0;
  z-index: 1;
  transition: all 0.3s;
}

.toggle-label {
  width: 32px;
  height: 16px;
}

.completed {
  border: 1px solid #13ec5b;
  background-color: v-bind(hexToRgba('#13ec5b', 0.1));
}

.uncompleted {
  border: 1px solid v-bind(hexToRgba('#6b7280', 0.5));
  background-color: v-bind(hexToRgba('#6b7280', 0.1));
}
</style>
