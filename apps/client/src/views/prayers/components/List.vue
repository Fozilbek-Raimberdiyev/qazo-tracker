<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle, TypographyText, Calendar, Badge, Empty, Modal } from 'ant-design-vue'
import BaseTab from '@/components/BaseTab/BaseTab.vue'
import { computed, onMounted, ref } from 'vue'
import BaseTabItem from '@/components/BaseTab/BaseTabItem.vue'
import Forest from '../components/Forest.vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import { useList } from "../composables/useList"
import type { CalendarMode } from 'ant-design-vue/es/calendar/generateCalendar'

// Configure dayjs to start week from Monday
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.Ls.en ? dayjs.Ls.en.weekStart = 1 : undefined

// Types
interface Prayer {
  id: string
  date: string
  prayerName: 'bomdod' | 'peshin' | 'asr' | 'shom' | 'xufton'
  isCompleted: boolean
  createdAt: string
  userId: string
}

const prayerNames: Record<Prayer['prayerName'], string> = {
  bomdod: 'Bomdod',
  peshin: 'Peshin',
  asr: 'Asr',
  shom: "Shom",
  xufton: 'Xufton'
}

const prayerIcons: Record<Prayer['prayerName'], string> = {
  bomdod: '🌅',
  peshin: '☀️',
  asr: '🌤️',
  shom: '🌆',
  xufton: '🌙'
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
  // Only update if month changes
  if (!date.value || value.month() !== date.value.month()) {
    date.value = value
  }
}

function handlePanelChange(value: Dayjs | string,mode:CalendarMode) {
  // Update date when month/year changes via panel navigation
  date.value = value as Dayjs
}

function showPrayerDetails(prayer: Prayer, event: Event) {
  event.stopPropagation()
  selectedPrayer.value = prayer
  isModalVisible.value = true
}

function handleModalOk() {
  if (selectedPrayer.value) {
    togglePrayer(selectedPrayer.value)
  }
  isModalVisible.value = false
}

function handleModalCancel() {
  isModalVisible.value = false
}

// Filter prayers by selected date
const filteredPrayers = computed<Prayer[]>(() => {
  if (!data.value || !date.value) return []

  const selectedDate = date.value.format('YYYY-MM-DD')
  return (data.value as Prayer[]).filter((prayer: Prayer) => prayer.date === selectedDate)
})

// Statistics
const stats = computed(() => {
  const completed = filteredPrayers.value.filter(p => p.isCompleted).length
  const total = filteredPrayers.value.length
  return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
})

function togglePrayer(prayer: Prayer) {
  // Bu yerda API orqali isCompleted holatini o'zgartirish kerak
  prayer.isCompleted = !prayer.isCompleted
}

// Get prayers for a specific date (for calendar cells)
function getPrayersForDate(date: Dayjs): Prayer[] {
  if (!data.value) return []
  const dateStr = date.format('YYYY-MM-DD')
  return (data.value as Prayer[]).filter((prayer: Prayer) => prayer.date === dateStr)
}

</script>

<template>
  <div>
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
              <BaseBox class="">
                <Calendar
                  @select="handleSelect"
                  @panelChange="handlePanelChange"
                  :value="date"
                >
                  <template #dateCellRender="{ current }">
                    <div class="events">
                      <template v-for="prayer in getPrayersForDate(current)" :key="prayer.id">
                        <div
                          class="event-item"
                          :class="prayer.isCompleted ? 'completed' : 'pending'"
                          :title="`${prayerNames[prayer.prayerName]} - ${prayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'}`"
                          @click="showPrayerDetails(prayer, $event)"
                        >
                          <span class="event-icon">{{ prayerIcons[prayer.prayerName] }}</span>
                          <span class="event-name">{{ prayerNames[prayer.prayerName] }}</span>
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

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Calendar Section -->
      <div class="lg:col-span-3 main-content">

      </div>
    </div>

    <!-- Prayer Details Modal -->
    <Modal
      v-model:open="isModalVisible"
      :title="selectedPrayer ? `${prayerNames[selectedPrayer.prayerName]} namozi` : ''"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      :okText="selectedPrayer?.isCompleted ? 'O\'qilmagan qilish' : 'O\'qilgan qilish'"
      cancelText="Yopish"
      centered
    >
      <div v-if="selectedPrayer" class="space-y-4 py-4">
        <!-- Prayer Icon and Name -->
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-purple-50 text-4xl">
            {{ prayerIcons[selectedPrayer.prayerName] }}
          </div>
          <div>
            <div class="text-xl font-semibold text-gray-800">
              {{ prayerNames[selectedPrayer.prayerName] }} namozi
            </div>
            <Badge
              :status="selectedPrayer.isCompleted ? 'success' : 'default'"
              :text="selectedPrayer.isCompleted ? 'O\'qilgan' : 'O\'qilmagan'"
            />
          </div>
        </div>

        <!-- Prayer Details -->
        <div class="space-y-3 rounded-lg bg-gray-50 p-4">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Sana:</span>
            <span class="font-medium text-gray-800">
              {{ dayjs(selectedPrayer.date).format('DD MMMM, YYYY') }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Holati:</span>
            <span
              class="font-medium"
              :class="selectedPrayer.isCompleted ? 'text-green-600' : 'text-orange-600'"
            >
              {{ selectedPrayer.isCompleted ? '✅ O\'qilgan' : '⏳ O\'qilmagan' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Yaratilgan:</span>
            <span class="text-sm text-gray-800">
              {{ dayjs(selectedPrayer.createdAt).format('DD.MM.YYYY HH:mm') }}
            </span>
          </div>
        </div>

        <!-- Prayer Info -->
        <div class="rounded-lg border border-blue-100 bg-blue-50 p-4">
          <div class="mb-2 flex items-center gap-2">
            <span class="text-lg">ℹ️</span>
            <span class="font-medium text-blue-900">Eslatma</span>
          </div>
          <p class="text-sm text-blue-800">
            Qazo namozlarni imkon qadar tezroq o'qib, o'z zimmangizdan soqit qiling.
            Allah taolo qabul qilsin!
          </p>
        </div>
      </div>
    </Modal>
  </div>
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

.grid > div:nth-child(1) { animation-delay: 0.05s; }
.grid > div:nth-child(2) { animation-delay: 0.1s; }
.grid > div:nth-child(3) { animation-delay: 0.15s; }
.grid > div:nth-child(4) { animation-delay: 0.2s; }
.grid > div:nth-child(5) { animation-delay: 0.25s; }

/* Calendar event styles */
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
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s;
  cursor: pointer;
}

.event-item:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-item.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-left: 3px solid #047857;
}

.event-item.pending {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #6b7280;
  border-left: 3px solid #d1d5db;
}

.event-icon {
  font-size: 12px;
  line-height: 1;
}

.event-name {
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Modal spacing utilities */
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
