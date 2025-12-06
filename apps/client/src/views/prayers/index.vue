<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle, TypographyText, Calendar } from 'ant-design-vue'
import BaseTab from '@/components/BaseTab/BaseTab.vue'
import { onMounted, ref } from 'vue'
import BaseTabItem from '@/components/BaseTab/BaseTabItem.vue'
import Forest from './components/Forest.vue'
const currentTab = ref('calendar')

const tabItems = [
  { label: 'Kalendar', key: 'calendar' },
  { label: 'Daraxt', key: 'tree' },
]

const isLoaded = ref(false)
onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <div class="">
    <!-- PageHeading -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col gap-2">
        <TypographyTitle :level="2"> Qazo namozlar </TypographyTitle>
        <TypographyText type="secondary">
          Qazo namozlaringizni ko‘ring va ularni o‘zgartiring
        </TypographyText>
      </div>
      <div class="flex justify-end">
        <BaseTab v-model="currentTab" :items="tabItems">
          <BaseTabItem tab-key="calendar" label="Kalendar">
            <Teleport v-if="isLoaded" to=".main-content">
              <BaseBox class="">
                <Calendar></Calendar>
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
        <!-- contents -->
      </div>
    </div>
  </div>
</template>
