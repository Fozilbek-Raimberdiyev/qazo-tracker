<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import { TypographyTitle, TypographyText, Calendar, TypographyParagraph } from 'ant-design-vue'
</script>

<template>
  <div class="">
    <!-- PageHeading -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <TypographyTitle :level="2"> Qazo ro‘zalar </TypographyTitle>
        <TypographyText type="secondary">
          Qazo ro‘zalaringizni ko‘ring va ularni o‘zgartiring
        </TypographyText>
      </div>
    </div>
    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Calendar Section -->
      <div class="lg:col-span-2">
        <BaseBox class="">
          <Calendar></Calendar>
        </BaseBox>
      </div>
      <!-- Sidebar with Legend and Stats -->
      <div class="lg:col-span-1">
        <div class="space-y-6">
          <!-- Legend Card -->
          <BaseBox>
            <TypographyTitle :level="4">Legend</TypographyTitle>
            <div class="mt-4 space-y-3">
              <div class="flex items-center gap-3">
                <div class="size-4 rounded-full bg-red-500"></div>
                <div>
                  <TypographyParagraph>Pending</TypographyParagraph>
                  <TypographyText type="secondary">
                    Prayers that need to be completed.
                  </TypographyText>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="size-4 rounded-full bg-primary"></div>
                <div>
                  <TypographyParagraph>Completed</TypographyParagraph>
                  <TypographyText type="secondary">
                    Prayers that have been marked as done.
                  </TypographyText>
                </div>
              </div>
            </div>
          </BaseBox>
          <!-- Stats Card -->
          <BaseBox>
            <TypographyTitle :level="4">This Month's Progress</TypographyTitle>
            <div class="mt-4 grid grid-cols-2 gap-4">
              <div
                class="flex flex-col items-center justify-center rounded-lg dark:bg-black/20 p-4"
              >
                <p class="text-3xl font-black text-red-500">23</p>
                <p class="text-sm font-medium text-gray-500 dark:text-[#9db9a6]">Pending</p>
              </div>
              <div
                class="flex flex-col items-center justify-center rounded-lg dark:bg-black/20 p-4"
              >
                <p class="text-3xl font-black text-primary">12</p>
                <p class="text-sm font-medium text-gray-500 dark:text-[#9db9a6]">Completed</p>
              </div>
            </div>
          </BaseBox>
        </div>
      </div>
    </div>
  </div>
</template>
