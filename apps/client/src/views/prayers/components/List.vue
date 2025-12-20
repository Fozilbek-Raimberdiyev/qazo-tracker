<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
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
import { onMounted, ref } from 'vue'
import BaseTabItem from '@/components/BaseTab/BaseTabItem.vue'
import Forest from '../components/Forest.vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/uz-latn' // O'zbek tili uchun locale
import { useList } from '../composables/useList'
import { usePrayerCompleteMutation } from '../composables/usePrayerCompleteMutation'
import { hexToRgba } from '@/utils/color.util'
import BaseModal from '@/components/BaseModal/BaseModal.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseSpin from '@/components/BaseSpin/BaseSpin.vue'

// Dayjs konfiguratsiyasi
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.locale('uz-latn') // O'zbek tilini o'rnatish
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
dayjs.Ls['uz-latn'] ? (dayjs.Ls['uz-latn'].weekStart = 1) : undefined

// Ant Design Calendar uchun o'zbek locale
const uzbekLocale = {
  lang: {
    locale: 'uz',
    placeholder: 'Sanani tanlang',
    rangePlaceholder: ['Boshlanish', 'Tugash'],
    today: 'Bugun',
    now: 'Hozir',
    backToToday: 'Bugunga qaytish',
    ok: 'OK',
    clear: 'Tozalash',
    month: 'Oy',
    year: 'Yil',
    timeSelect: 'Vaqtni tanlash',
    dateSelect: 'Sanani tanlash',
    monthSelect: 'Oyni tanlang',
    yearSelect: 'Yilni tanlang',
    decadeSelect: "O'n yillikni tanlang",
    yearFormat: 'YYYY',
    dateFormat: 'DD.MM.YYYY',
    dayFormat: 'D',
    dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    previousMonth: 'Oldingi oy (PageUp)',
    nextMonth: 'Keyingi oy (PageDown)',
    previousYear: 'Oldingi yil (Control + left)',
    nextYear: 'Keyingi yil (Control + right)',
    previousDecade: "Oldingi o'n yillik",
    nextDecade: "Keyingi o'n yillik",
    previousCentury: 'Oldingi asr',
    nextCentury: 'Keyingi asr',
    shortWeekDays: [
      'Yakshanba',
      'Dushanba',
      'Seshanba',
      'Chorshanba',
      'Payshanba',
      'Juma',
      'Shanba',
    ],
    shortMonths: [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentabr',
      'Oktabr',
      'Noyabr',
      'Dekabr',
    ],
  },
  timePickerLocale: {
    placeholder: 'Vaqtni tanlang',
  },
  dateFormat: 'DD.MM.YYYY',
  dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
  weekFormat: 'YYYY-wo',
  monthFormat: 'YYYY-MM',
}

// Dayjs locale sozlamalari (agar kerak bo'lsa qo'shimcha sozlash)
// if (dayjs.Ls['uz-latn']) {
//   dayjs.Ls['uz-latn'].weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
//   dayjs.Ls['uz-latn'].weekdaysShort = ['Yakshanba', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
//   dayjs.Ls['uz-latn'].weekdaysMin = ['Ya', 'Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha']
//   dayjs.Ls['uz-latn'].months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
//   dayjs.Ls['uz-latn'].monthsShort = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
// }

const { mutateAsync: completePrayer, isPending: isPendingComplete } = usePrayerCompleteMutation()

// Types
interface PrayerType {
  name_uz: string
  name_ru: string
  name_en: string
  name_ar: string
  icon: string
  order_no: number
  id: string
}
interface Prayer {
  id: string
  date: string
  prayerType: PrayerType
  isCompleted: boolean
  createdAt: string
  userId: string
}

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

function handleCompleteClick() {
  if (selectedPrayer.value) {
    completePrayer(selectedPrayer.value.id)
  }
  isModalVisible.value = false
}

function getPrayersForDate(date: Dayjs): Prayer[] {
  if (!data.value) return []
  const dateStr = date.format('YYYY-MM-DD')
  return (data.value as Prayer[])
    .filter((prayer: Prayer) => prayer.date === dateStr)
    .sort((a: Prayer, b: Prayer) => a.prayerType.order_no - b.prayerType.order_no)
}
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
      <div class="flex justify-end">
        <BaseTab v-model="currentTab" :items="tabItems">
          <BaseTabItem tab-key="calendar" label="Kalendar">
            <Teleport v-if="isLoaded" to=".main-content">
              <BaseBox class="custom-calendar">
                <Calendar
                  @select="handleSelect"
                  @panelChange="handlePanelChange"
                  :value="date"
                  :locale="uzbekLocale as any"
                >
                  <template #dateCellRender="{ current }">
                    <div class="events">
                      <template v-for="prayer in getPrayersForDate(current)" :key="prayer.id">
                        <div
                          class="event-item flex items-center gap-2 px-2 py-1! rounded bg-primary/10 cursor-pointer group/item transition-colors border-l-2"
                          :class="[prayer.isCompleted ? 'completed' : 'pending']"
                          :title="`${prayer.prayerType.name_uz} - ${prayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'}`"
                          @click="showPrayerDetails(prayer, $event)"
                        >
                          <span class="material-symbols-outlined">{{
                            prayer.prayerType.icon
                          }}</span>
                          <span class="event-name">{{ prayer.prayerType.name_uz }}</span>
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

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
      <div class="lg:col-span-3 main-content"></div>
      <div class="lg:col-span-1">
        <div class="space-y-6">
          <BaseBox>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">This Month's Progress</h3>
            <div class="mt-4 flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <div class="relative size-24">
                  <svg
                    class="size-full -rotate-90"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      class="text-gray-700"
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="4"
                    ></path>
                    <path
                      class="text-primary"
                      d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      stroke-dasharray="31, 100"
                      stroke-width="4"
                    ></path>
                  </svg>
                  <div
                    class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 text-center"
                  >
                    <span class="text-xl font-bold text-gray-500 dark:text-white">31%</span>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-primary"></span>
                    <span class="text-sm text-gray-500"
                      >Completed: <span class="font-bold text-white">57</span></span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-red-500"></span>
                    <span class="text-sm text-gray-500"
                      >Pending: <span class="font-bold text-white">123</span></span
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Total Prayers: <span class="text-gray-300">180</span>
                  </p>
                </div>
              </div>
              <div class="space-y-4 pt-4 border-t border-white/10">
                <h4 class="text-sm font-semibold text-gray-300 mb-2">Completion by Prayer</h4>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">wb_twilight</span>
                      Bomdod</span
                    >
                    <span class="text-white">45%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 45%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">light_mode</span>
                      Peshin</span
                    >
                    <span class="text-white">60%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 60%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">wb_sunny</span> Asr</span
                    >
                    <span class="text-white">20%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 20%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">nights_stay</span>
                      Shom</span
                    >
                    <span class="text-white">15%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 15%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">bedtime</span>
                      Xufton</span
                    >
                    <span class="text-white">35%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 35%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-400 flex items-center gap-1"
                      ><span class="material-symbols-outlined text-[14px]">star</span> Vitr</span
                    >
                    <span class="text-white">10%</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="bg-primary h-1.5 rounded-full" style="width: 10%"></div>
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

.grid > div {
  animation: slideIn 0.3s ease-out forwards;
}

.grid > div:nth-child(1) {
  animation-delay: 0.05s;
}
.grid > div:nth-child(2) {
  animation-delay: 0.1s;
}
.grid > div:nth-child(3) {
  animation-delay: 0.15s;
}
.grid > div:nth-child(4) {
  animation-delay: 0.2s;
}
.grid > div:nth-child(5) {
  animation-delay: 0.25s;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 2px;
  height: 100%;
  overflow: hidden;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
  cursor: pointer;
}

.event-item:hover {
  transform: translateX(2px);
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

.space-y-3 > * + * {
  margin-top: 0.75rem;
}
.space-y-4 > * + * {
  margin-top: 1rem;
}

.custom-calendar :deep(.ant-picker-calendar-date-content) {
  height: auto !important;
  min-height: 50px;
}
</style>
