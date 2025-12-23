<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import confetti from '@hiseb/confetti'
import {useDownloadAsPdfAllPrayersMutation} from "../composables/useDownloadAsPdfAllPrayersMutation"
import dayjs from 'dayjs'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { CircleProgressBar } from 'circle-progress.vue'
import { useThemeStore } from '@/stores/theme'
import {
  TypographyTitle,
  TypographyText,
  Calendar,
  Badge,
  Alert,
  Descriptions,
  DescriptionsItem,
} from 'ant-design-vue'
import BaseTab from '@/components/BaseTab/BaseTab.vue'
import { computed, h, onMounted, ref } from 'vue'
import BaseTabItem from '@/components/BaseTab/BaseTabItem.vue'
import Forest from '../components/Forest.vue'
import type { Dayjs } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/uz-latn' // O'zbek tili uchun locale
import { useList } from '../composables/useList'
import { usePrayerCompleteMutation } from '../composables/usePrayerCompleteMutation'
import { hexToRgba } from '@/utils/color.util'
import BaseModal from '@/components/BaseModal/BaseModal.vue'
import { useUserStore } from '@/stores/user.store'
import { useCalendarData } from '../composables/useCalendarData'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseSpin from '@/components/BaseSpin/BaseSpin.vue'
import type { Prayer } from '@/types/prayer.types'
import { storeToRefs } from 'pinia'
const { user } = storeToRefs(useUserStore())
const { uzbekLocale } = useCalendarData()
const { primaryColor } = storeToRefs(useThemeStore())
const {isPending : isPendingDownload, mutateAsync: downloadPdf} = useDownloadAsPdfAllPrayersMutation()
// Dayjs konfiguratsiyasi
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.locale('uz-latn')
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
dayjs.Ls['uz-latn'] ? (dayjs.Ls['uz-latn'].weekStart = 1) : undefined
const maxPrayerDate = computed(() => {
  return user.value?.maxPrayerDate
})

const minPrayerDate = computed(() => {
  return user.value?.minPrayerDate
})

// **YANGI: disabledDate funksiyasi qo'shildi**
const disabledDate = (current: Dayjs) => {
  if (!minPrayerDate.value || !maxPrayerDate.value) {
    return false
  }

  const min = dayjs(minPrayerDate.value).startOf('day')
  const max = dayjs(maxPrayerDate.value).startOf('day')

  // minPrayerDate dan oldingi yoki maxPrayerDate dan keyingi sanalarni disable qilish
  return current.isBefore(min, 'day') || current.isAfter(max, 'day')
}

// validRange prop uchun
const validRange = computed(() => {
  if (!minPrayerDate.value || !maxPrayerDate.value) {
    return undefined
  }
  return [dayjs(minPrayerDate.value), dayjs(maxPrayerDate.value)] as [Dayjs, Dayjs]
})

const { mutateAsync: completePrayer, isPending: isPendingComplete } = usePrayerCompleteMutation()

const { data, isPending, date } = useList()
const currentTab = ref('calendar')
const tabItems = [
  { label: 'Kalendar', key: 'calendar' },
  { label: 'Daraxt', key: 'tree' },
]

const isLoaded = ref(false)
const selectedPrayer = ref<Prayer | null>(null)
const isModalVisible = ref(false)

onMounted(() => {
  isLoaded.value = true
})

function handleSelect(value: Dayjs) {
  if (!date.value || value.month() !== date.value.month()) {
    date.value = value
  }
}

function handlePanelChange(value: Dayjs | string) {
  date.value = value as Dayjs
}

function showPrayerDetails(prayer: Prayer, event: Event) {
  event.stopPropagation()
  selectedPrayer.value = prayer
  isModalVisible.value = true
}

async function handleCompleteClick() {
  if (selectedPrayer.value) {
    await completePrayer(selectedPrayer.value.id)
    setTimeout(() => {
      if (monthlyProgress.value == 100) {
        confetti({ count: 1000, size: 1, velocity: 500 })
      }
    }, 100)
  }
  isModalVisible.value = false
}

function getPrayersForDate(date: Dayjs): Prayer[] {
  if (!data.value) return []
  const dateStr = date.format('YYYY-MM-DD')
  return (data.value.prayers as Prayer[])
    .filter((prayer: Prayer) => prayer.date === dateStr)
    .sort((a: Prayer, b: Prayer) => a.prayerType?.order_no - b.prayerType?.order_no)
}
const monthlyProgress = computed(() => {
  if (!data.value) return 0
  return Math.floor((Number(data.value?.completedCount) / Number(data.value?.totalPrayers)) * 100)
})

</script>

<template>
  <BaseSpin :spinning="isPending">

    <!-- PageHeading -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col gap-2">
        <TypographyTitle :level="2"> Qazo namozlar </TypographyTitle>
        <TypographyText type="secondary">
          Qazo namozlaringizni ko'ring va ularni o'zgartiring
        </TypographyText>
      </div>
      <div>
        <BaseButton :loading="isPendingDownload" @click="downloadPdf()" type="primary">
          <span class="material-symbols-outlined">download</span>
        </BaseButton>
      </div>
      <div class="flex justify-end">
        <BaseTab v-model="currentTab" :items="tabItems">
          <BaseTabItem tab-key="calendar" label="Kalendar">
            <Teleport v-if="isLoaded" to=".main-content">
              <BaseBox class="custom-calendar">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <BaseButton
                    :icon="
                      h('span', { class: 'material-symbols-outlined text-base!' }, 'arrow_back_ios')
                    "
                    :disabled="
                      date.toDate().getTime() <= new Date(user?.minPrayerDate as string).getTime()
                    "
                    @click="handlePanelChange(dayjs(date).subtract(1, 'month'))"
                    >Avvalgi oy</BaseButton
                  >
                  <span class="text-lg">
                    {{ dayjs(date).format('MMMM YYYY') }}
                  </span>
                  <BaseButton
                    :icon="
                      h(
                        'span',
                        { class: 'material-symbols-outlined text-base!' },
                        'arrow_forward_ios',
                      )
                    "
                    :disabled="
                      date.toDate().getTime() >= new Date(user?.maxPrayerDate as string).getTime()
                    "
                    @click="handlePanelChange(dayjs(date).add(1, 'month'))"
                    >Keyingi oy</BaseButton
                  >
                </div>

                <Calendar
                  @select="handleSelect"
                  @panelChange="handlePanelChange"
                  :value="date"
                  :locale="uzbekLocale as any"
                  :disabledDate="disabledDate"
                  :validRange="validRange"
                >
                  <template #dateCellRender="{ current }">
                    <div class="events">
                      <template v-for="prayer in getPrayersForDate(current)" :key="prayer.id">
                        <div
                          class="event-item flex items-center gap-2 px-2 py-1! rounded bg-primary/10 cursor-pointer group/item transition-colors border-l-2"
                          :class="[prayer.isCompleted ? 'completed' : 'pending']"
                          :title="`${prayer.prayerType?.name_uz} - ${prayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'}`"
                          @click="showPrayerDetails(prayer, $event)"
                        >
                          <span class="material-symbols-outlined">{{
                            prayer.prayerType?.icon
                          }}</span>
                          <span class="event-name">{{ prayer.prayerType?.name_uz }}</span>
                        </div>
                      </template>
                    </div>
                  </template>
                </Calendar>
              </BaseBox>
            </Teleport>
          </BaseTabItem>
          <BaseTabItem tab-key="tree" label="Daraxt">
            <Teleport v-if="isLoaded" to=".main-content">
              <BaseBox class="">
                <Forest></Forest>
              </BaseBox>
            </Teleport>
          </BaseTabItem>
        </BaseTab>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4 relative">
      <div class="main-content lg:col-span-3"></div>
      <div class="lg:col-span-1 sticky top-0 h-full">
        <div class="space-y-6">
          <BaseBox>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Oylik samaradorlik</h3>
            <div class="mt-4 flex flex-col gap-6">
              <div class="flex items-center justify-between">
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
                      >O'qilgan:
                      <span class="font-bold">{{ data?.completedCount }}</span></span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-red-500"></span>
                    <span class="text-sm text-gray-500"
                      >O'qilmagan:
                      <span class="font-bold">{{ data?.uncompletedCount }}</span></span
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Jami namozlar: <span class="">{{ data?.totalPrayers }}</span>
                  </p>
                </div>
              </div>
              <div class="space-y-4 pt-4 border-t border-white/10">
                <h4 class="text-sm font-semibold mb-2">Namoz turlari</h4>
                <div v-for="(item, index) in data?.countsByType" :key="index">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">{{
                        item.prayerType.icon
                      }}</span>
                      {{ item.prayerType.name_uz }}
                    </span>

                    <span class="dark:text-white"
                      >{{ Math.floor((item.completed / item.total) * 100) }} %</span
                    >
                  </div>
                  <div class="w-full dark:bg-gray-700 bg-gray-200 rounded-full h-1.5">
                    <div
                      class="bg-primary h-1.5 rounded-full"
                      :style="{ width: `${Math.floor((item.completed / item.total) * 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </BaseBox>
        </div>
      </div>
    </div>

    <!-- Prayer Details Modal -->
    <BaseModal
      v-model="isModalVisible"
      :confirm-loading="isPendingComplete"
      :title="selectedPrayer ? `${selectedPrayer.prayerType.name_uz} namozi` : ''"
      :okText="selectedPrayer?.isCompleted ? 'O\'qilmagan qilish' : 'O\'qilgan qilish'"
      cancelText="Yopish"
      :footer="true"
      centered
    >
      <div v-if="selectedPrayer" class="py-4 flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <span class="material-symbols-outlined">
            {{ selectedPrayer.prayerType.icon }}
          </span>
          <div>
            <TypographyTitle :level="3">
              {{ selectedPrayer.prayerType.name_uz }} namozi
            </TypographyTitle>
            <Badge
              :status="selectedPrayer.isCompleted ? 'success' : 'default'"
              :text="selectedPrayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'"
            />
          </div>
        </div>
        <Descriptions bordered :column="1">
          <DescriptionsItem label="Sana">
            {{ dayjs(selectedPrayer.date).format('DD MMMM, YYYY') }}
          </DescriptionsItem>
          <DescriptionsItem label="Holati">
            {{ selectedPrayer.isCompleted ? "✅ O'qilgan" : "⏳ O'qilmagan" }}
          </DescriptionsItem>
          <DescriptionsItem label="Yaratilgan:">
            {{ dayjs(selectedPrayer.createdAt).format('DD.MM.YYYY HH:mm') }}
          </DescriptionsItem>
          <DescriptionsItem label="Namoz uchun niyat:">
            {{
              `Qibla tarafga yuzlandim, ${dayjs(selectedPrayer.date).format('YYYY')} yil ${dayjs(selectedPrayer.date).format('D')}- ${dayjs(selectedPrayer.date).format('MMMM')} kungi qazo ${selectedPrayer.prayerType.name_uz} namozini o'qishni niyat qildim, xolis Alloh roziligi uchun o'qishni niyat qildim`
            }}
          </DescriptionsItem>
        </Descriptions>

        <Alert
          message="Eslatma"
          description="Qazo namozlarni imkon qadar tezroq o'qib, o'z zimmangizdan soqit qiling. Alloh Taolo
            qabul qilsin!"
          type="info"
          show-icon
        />
      </div>
      <div class="btns flex items-center gap-2 justify-end" v-if="!selectedPrayer?.isCompleted">
        <BaseButton @click="isModalVisible = false">Bekor qilish</BaseButton>
        <BaseButton @click="handleCompleteClick" :loading="isPendingComplete" type="primary"
          >O'qilgan qilish</BaseButton
        >
      </div>
    </BaseModal>
  </BaseSpin>
</template>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px;
  height: 100%;
  overflow: hidden;
}

.event-item:hover {
  transform: translateX(4px);
}

.event-item.completed {
  background: v-bind(hexToRgba('#13ec5b', 0.1));
  color: #6b7280;
  border-left: 4px solid #13ec5b;
}

.event-item.pending {
  background: v-bind(hexToRgba('#d1d5db', 0.1));
  color: #6b7280;
  border-left: 4px solid #d1d5db;
}

.custom-calendar :deep(.ant-picker-calendar-date-content) {
  height: auto !important;
  min-height: 50px;
}

/* Disabled sanalar uchun stil */
.custom-calendar :deep(.ant-picker-cell-disabled) {
  pointer-events: none;
}

.custom-calendar :deep(.ant-picker-cell-disabled .ant-picker-cell-inner) {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: rgba(255, 255, 255, 0.3) !important;
  cursor: not-allowed !important;
}

.custom-calendar :deep(.ant-picker-cell-disabled .events) {
  opacity: 0.3;
  pointer-events: none;
}

:global(.custom-calendar .ant-picker-cell-disabled) {
  visibility: hidden;
}

:global(
  .custom-calendar
    :where(.css-dev-only-do-not-override-16n3tjf).ant-picker-calendar.ant-picker-calendar-full
    .ant-picker-cell-in-view.ant-picker-cell-selected
    .ant-picker-calendar-date,
  :where(.css-dev-only-do-not-override-16n3tjf).ant-picker-calendar.ant-picker-calendar-full
    .ant-picker-cell-in-view.ant-picker-cell-selected
    .ant-picker-calendar-date-today
) {
  background: none;
}

:global(
  .custom-calendar
    :where(.css-dev-only-do-not-override-16n3tjf).ant-picker-calendar.ant-picker-calendar-full
    .ant-picker-cell-in-view.ant-picker-cell-selected
    .ant-picker-calendar-date,
  :where(.css-dev-only-do-not-override-16n3tjf).ant-picker-calendar.ant-picker-calendar-full
    .ant-picker-cell-in-view.ant-picker-cell-selected
    .ant-picker-calendar-date-today
) {
  background: none;
}
</style>
