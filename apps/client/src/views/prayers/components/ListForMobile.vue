<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import confetti from '@hiseb/confetti'
import { useDownloadAsPdfAllPrayersMutation } from '../composables/useDownloadAsPdfAllPrayersMutation'
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
  Dropdown,
  MenuItem,
  Menu,
  CheckboxGroup,
  Drawer,
} from 'ant-design-vue'
import BaseTab from '@/components/BaseTab/BaseTab.vue'
import { computed, h, onMounted, ref } from 'vue'
import BaseTabItem from '@/components/BaseTab/BaseTabItem.vue'
import Forest from '../components/Forest.vue'
import type { Dayjs } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/uz-latn'
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
import MarkedItemsSection from './MarkedItemsSection.vue'
import BaseCheckbox from '@/components/BaseCheckbox/BaseCheckbox.vue'
import AddPrayerForm from './AddPrayerForm.vue'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'

const { user } = storeToRefs(useUserStore())
const { uzbekLocale } = useCalendarData()
const { primaryColor } = storeToRefs(useThemeStore())
const markMode = ref(false)
const markedPrayers = ref<string[]>([])
const isVisibleAddPrayer = ref<boolean>(false)
const statsDrawerVisible = ref(false)
const { isPending: isPendingDownload, mutateAsync: downloadPdf } =
  useDownloadAsPdfAllPrayersMutation()

dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.locale('uz-latn')
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
dayjs.Ls['uz-latn'] ? (dayjs.Ls['uz-latn'].weekStart = 1) : undefined

const maxPrayerDate = computed(() => {
  return user.value?.maxPrayerDate
})
const isMarkedAll = ref(false)

const minPrayerDate = computed(() => {
  return user.value?.minPrayerDate
})

const disabledDate = (current: Dayjs) => {
  if (!minPrayerDate.value || !maxPrayerDate.value) {
    return false
  }

  const min = dayjs(minPrayerDate.value).startOf('day')
  const max = dayjs(maxPrayerDate.value).startOf('day')

  return current.isBefore(min, 'day') || current.isAfter(max, 'day')
}

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

function handleMarkedSectionSuccess() {
  markMode.value = false
  markedPrayers.value = []
}

function handleMarkedSectionCancel() {
  markedPrayers.value = []
  markMode.value = false
}

function handleMarkedAllChange(value: boolean) {
  if (value) {
    markedPrayers.value = data.value?.prayers.map((prayer: Prayer) => prayer.id) as string[]
  } else {
    markedPrayers.value = []
  }
}
</script>

<template>
  <BaseSpin :spinning="isPending">
    <!-- PageHeading - Responsive -->
    <div class="prayer-heading">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex flex-col gap-2 flex-1">
          <TypographyTitle :level="2" class="mb-0! text-xl! sm:text-2xl!">
            Qazo namozlar
          </TypographyTitle>
          <TypographyText type="secondary" class="text-sm sm:text-base">
            Qazo namozlaringizni ko'ring va ularni o'zgartiring
          </TypographyText>
          <div v-if="markMode" class="flex items-start gap-1">
            <BaseCheckbox
              id="isMarkedAll"
              :is-bordered="false"
              v-model="isMarkedAll"
              @change="handleMarkedAllChange"
            ></BaseCheckbox>
            <BaseFormLabel for="isMarkedAll" class="text-sm">
              Hammasini belgilash(oylik)
            </BaseFormLabel>
          </div>
        </div>

        <!-- Mobile: Stats button + Menu -->
        <div class="flex items-center gap-2 sm:hidden">
          <BaseButton @click="statsDrawerVisible = true" type="primary" size="small">
            <template #icon>
              <span class="material-symbols-outlined text-base">insights</span>
            </template>
            Statistika
          </BaseButton>

          <Dropdown trigger="click">
            <button class="cursor-pointer p-2">
              <span class="material-symbols-outlined">more_vert</span>
            </button>
            <template #overlay>
              <Menu>
                <MenuItem>
                  <BaseButton @click="isVisibleAddPrayer = true" size="small" type="ghost" block>
                    <template #icon>
                      <span class="material-symbols-outlined mr-1 align-top">add</span>
                    </template>
                    Yangi qo'shish
                  </BaseButton>
                </MenuItem>
                <MenuItem>
                  <BaseButton
                    type="ghost"
                    size="small"
                    :loading="isPendingDownload"
                    @click="downloadPdf()"
                    block
                  >
                    <template #icon>
                      <span class="material-symbols-outlined mr-1 align-top">download</span>
                    </template>
                    Yuklab olish
                  </BaseButton>
                </MenuItem>
                <MenuItem>
                  <BaseButton @click="markMode = true" type="ghost" size="small" block>
                    <template #icon>
                      <span class="material-symbols-outlined mr-1 align-top">check_circle</span>
                    </template>
                    Belgilash
                  </BaseButton>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>

        <!-- Desktop: Menu only -->
        <div class="hidden sm:block">
          <Dropdown trigger="click">
            <button class="cursor-pointer">
              <span class="material-symbols-outlined">more_horiz</span>
            </button>
            <template #overlay>
              <Menu>
                <MenuItem>
                  <BaseButton @click="isVisibleAddPrayer = true" size="small" type="ghost">
                    <template #icon>
                      <span class="material-symbols-outlined mr-1 align-top">add</span>
                    </template>
                    Yangi qo'shish
                  </BaseButton>
                </MenuItem>
                <MenuItem>
                  <BaseButton
                    type="ghost"
                    size="small"
                    :loading="isPendingDownload"
                    @click="downloadPdf()"
                  >
                    <template #icon>
                      <span class="material-symbols-outlined mr-1 align-top">download</span>
                      Yuklab olish
                    </template>
                  </BaseButton>
                </MenuItem>
                <MenuItem>
                  <BaseButton @click="markMode = true" type="ghost" size="small">
                    <template #icon>
                      <span class="material-symbols-outlined mr-1 align-top">check_circle</span>
                    </template>
                    Belgilash
                  </BaseButton>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>

      <!-- Tab section - Mobile optimized -->
      <div class="mt-4">
        <BaseTab v-model="currentTab" :items="tabItems">
          <BaseTabItem tab-key="calendar" label="Kalendar">
            <Teleport v-if="isLoaded" to=".main-content">
              <BaseBox class="custom-calendar">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                  <BaseButton
                    size="small"
                    class="w-full sm:w-auto"
                    :icon="
                      h(
                        'span',
                        { class: 'material-symbols-outlined text-base!' },
                        'arrow_back_ios',
                      )
                    "
                    :disabled="
                      date.toDate().getTime() <=
                        new Date(user?.minPrayerDate as string).getTime() || markMode
                    "
                    @click="handlePanelChange(dayjs(date).subtract(1, 'month'))"
                  >
                    Avvalgi oy
                  </BaseButton>
                  <span class="text-base sm:text-lg font-semibold text-center w-full sm:w-auto">
                    {{ dayjs(date).format('MMMM YYYY') }}
                  </span>
                  <BaseButton
                    size="small"
                    class="w-full sm:w-auto"
                    :icon="
                      h(
                        'span',
                        { class: 'material-symbols-outlined text-base!' },
                        'arrow_forward_ios',
                      )
                    "
                    :disabled="
                      date.toDate().getTime() >=
                        new Date(user?.maxPrayerDate as string).getTime() || markMode
                    "
                    @click="handlePanelChange(dayjs(date).add(1, 'month'))"
                  >
                    Keyingi oy
                  </BaseButton>
                </div>
                <CheckboxGroup v-model:value="markedPrayers">
                  <Calendar
                    @select="handleSelect"
                    @panelChange="handlePanelChange"
                    :value="date"
                    :locale="uzbekLocale as any"
                    :disabledDate="disabledDate"
                    :validRange="validRange"
                    :fullscreen="false"
                    class="mobile-calendar"
                  >
                    <template #dateCellRender="{ current }">
                      <div class="events">
                        <template v-for="prayer in getPrayersForDate(current)" :key="prayer.id">
                          <div
                            class="event-item flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-1! rounded bg-primary/10 cursor-pointer group/item transition-colors border-l-2"
                            :class="[prayer.isCompleted ? 'completed' : 'pending']"
                            :title="`${prayer.prayerType?.name_uz} - ${prayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'}`"
                            @click="markMode ? null : showPrayerDetails(prayer, $event)"
                          >
                            <BaseCheckbox
                              v-if="markMode"
                              :value="prayer.id"
                              :is-bordered="false"
                            ></BaseCheckbox>
                            <span class="material-symbols-outlined text-sm sm:text-base">{{
                              prayer.prayerType?.icon
                            }}</span>
                            <span class="event-name text-xs sm:text-sm">{{ prayer.prayerType?.name_uz }}</span>
                          </div>
                        </template>
                      </div>
                    </template>
                  </Calendar>
                </CheckboxGroup>
              </BaseBox>
            </Teleport>
          </BaseTabItem>
          <BaseTabItem tab-key="tree" label="Daraxt">
            <Teleport v-if="isLoaded" to=".main-content">
              <BaseBox>
                <Forest></Forest>
              </BaseBox>
            </Teleport>
          </BaseTabItem>
        </BaseTab>
      </div>
    </div>

    <!-- Main content area - Responsive grid -->
    <div class="mt-4 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-4 relative">
      <div class="main-content lg:col-span-3"></div>

      <!-- Desktop sidebar -->
      <div class="hidden lg:block lg:col-span-1 sticky top-0 h-full">
        <div class="space-y-6">
          <BaseBox>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Oylik samaradorlik</h3>
            <div class="mt-4 flex flex-col gap-6">
              <div class="flex items-center justify-between">
                <div>
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
                      >O'qilgan: <span class="font-bold">{{ data?.completedCount }}</span></span
                    >
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="size-3 rounded-full bg-red-500"></span>
                    <span class="text-sm text-gray-500"
                      >O'qilmagan: <span class="font-bold">{{ data?.uncompletedCount }}</span></span
                    >
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    Jami namozlar: <span>{{ data?.totalPrayers }}</span>
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

    <!-- Mobile Statistics Drawer -->
    <Drawer
      v-model:open="statsDrawerVisible"
      title="Oylik samaradorlik"
      placement="bottom"
      :height="'80vh'"
      class="lg:hidden"
    >
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
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
                >O'qilgan: <span class="font-bold">{{ data?.completedCount }}</span></span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="size-3 rounded-full bg-red-500"></span>
              <span class="text-sm text-gray-500"
                >O'qilmagan: <span class="font-bold">{{ data?.uncompletedCount }}</span></span
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Jami namozlar: <span>{{ data?.totalPrayers }}</span>
            </p>
          </div>
        </div>
        <div class="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
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
    </Drawer>

    <!-- Prayer Details Modal - Responsive -->
    <BaseModal
      v-model="isModalVisible"
      :confirm-loading="isPendingComplete"
      :title="selectedPrayer ? `${selectedPrayer.prayerType.name_uz} namozi` : ''"
      :okText="selectedPrayer?.isCompleted ? 'O\'qilmagan qilish' : 'O\'qilgan qilish'"
      cancelText="Yopish"
      :footer="true"
      centered
      :width="'90%'"
      class="sm:w-[600px]!"
    >
      <div v-if="selectedPrayer" class="py-4 flex flex-col gap-4">
        <div class="flex items-center gap-4">
          <span class="material-symbols-outlined text-2xl sm:text-3xl">
            {{ selectedPrayer.prayerType.icon }}
          </span>
          <div>
            <TypographyTitle :level="3" class="text-lg! sm:text-xl!">
              {{ selectedPrayer.prayerType.name_uz }} namozi
            </TypographyTitle>
            <Badge
              :status="selectedPrayer.isCompleted ? 'success' : 'default'"
              :text="selectedPrayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'"
            />
          </div>
        </div>
        <Descriptions bordered :column="1" size="small">
          <DescriptionsItem label="Sana">
            {{ dayjs(selectedPrayer.date).format('DD MMMM, YYYY') }}
          </DescriptionsItem>
          <DescriptionsItem label="Holati">
            {{ selectedPrayer.isCompleted ? "✅ O'qilgan" : "⏳ O'qilmagan" }}
          </DescriptionsItem>
          <DescriptionsItem label="Yaratilgan:">
            {{ dayjs(selectedPrayer.createdAt).format('DD.MM.YYYY HH:mm') }}
          </DescriptionsItem>
          <DescriptionsItem label="Namoz uchun niyat:" class="text-xs sm:text-sm">
            {{
              `Qibla tarafga yuzlandim, ${dayjs(selectedPrayer.date).format('YYYY')} yil ${dayjs(selectedPrayer.date).format('D')}- ${dayjs(selectedPrayer.date).format('MMMM')} kungi qazo ${selectedPrayer.prayerType.name_uz} namozini o'qishni niyat qildim, xolis Alloh roziligi uchun o'qishni niyat qildim`
            }}
          </DescriptionsItem>
        </Descriptions>

        <Alert
          message="Eslatma"
          description="Qazo namozlarni imkon qadar tezroq o'qib, o'z zimmangizdan soqit qiling. Alloh Taolo qabul qilsin!"
          type="info"
          show-icon
          class="text-xs sm:text-sm"
        />
      </div>
      <div class="btns flex flex-col sm:flex-row items-center gap-2 justify-end" v-if="!selectedPrayer?.isCompleted">
        <BaseButton @click="isModalVisible = false" class="w-full sm:w-auto">Bekor qilish</BaseButton>
        <BaseButton @click="handleCompleteClick" :loading="isPendingComplete" type="primary" class="w-full sm:w-auto"
          >O'qilgan qilish</BaseButton
        >
      </div>
    </BaseModal>

    <MarkedItemsSection
      @success="handleMarkedSectionSuccess"
      @cancel="handleMarkedSectionCancel"
      @clear="markedPrayers = []"
      v-model:visible="markMode"
      :markedPrayers
    ></MarkedItemsSection>

    <BaseModal width="90%" class="sm:w-[50%]!" v-model="isVisibleAddPrayer" title="Yangi qo'shish">
      <AddPrayerForm></AddPrayerForm>
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

/* Mobile optimizations */
@media (max-width: 640px) {
  .custom-calendar :deep(.ant-picker-calendar-date-content) {
    min-height: 40px;
    font-size: 12px;
  }

  .custom-calendar :deep(.ant-picker-calendar-date) {
    padding: 2px;
  }

  .custom-calendar :deep(.ant-picker-cell-inner) {
    padding: 4px;
  }

  .events {
    gap: 1px;
    padding: 1px;
  }
}

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
</style>
