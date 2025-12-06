<script setup lang="ts">
import { ref } from 'vue';
import Events from './components/events.vue';
import Appearence from './components/appearence.vue';
import { Tabs as ATabs } from 'ant-design-vue';
enum Tabs {
  Profile = 'profile',
  Account = 'account',
  Events = 'events',
  Notifications = 'notifications',
  Appearance = 'appearance',
}

const currentTab = ref<Tabs>(Tabs.Profile)
</script>

<template>
  <div  class="  px-4 py-8 md:py-12">
    <ATabs animated v-model:activeKey="currentTab" tab-position="left">

      <!-- PROFILE -->
      <ATabs.TabPane :tab-key="Tabs.Profile" :key="Tabs.Profile">
        <template #tab>
          <button
            class="flex items-center gap-3 rounded-DEFAULT px-3 text-sm font-medium cursor-pointer "
          >
            <span class="material-symbols-outlined text-subtle-light dark:text-subtle-dark">person</span>
            <span>Profile</span>
          </button>
        </template>

        Profile
      </ATabs.TabPane>

      <!-- ACCOUNT -->
      <ATabs.TabPane :key="Tabs.Account">
        <template #tab>
          <button
            class="flex items-center gap-3 rounded-DEFAULT px-3 text-sm font-medium  cursor-pointer"
          >
            <span class="material-symbols-outlined text-subtle-light dark:text-subtle-dark">account_circle</span>
            <span>Account</span>
          </button>
        </template>

        Account
      </ATabs.TabPane>

      <!-- EVENTS -->
      <ATabs.TabPane :key="Tabs.Events">
        <template #tab>
          <button class="flex items-center gap-3 rounded-DEFAULT px-3 text-sm cursor-pointer">
            <span class="material-symbols-outlined">add_circle</span>
            <span>Add Events</span>
          </button>
        </template>

        <Events />
      </ATabs.TabPane>

      <!-- NOTIFICATIONS -->
      <ATabs.TabPane :key="Tabs.Notifications">
        <template #tab>
          <button
            class="flex items-center gap-3 rounded-DEFAULT px-3 text-sm font-medium cursor-pointer "
          >
            <span class="material-symbols-outlined text-subtle-light dark:text-subtle-dark">notifications</span>
            <span>Notifications</span>
          </button>
        </template>

        Notifications
      </ATabs.TabPane>

      <!-- APPEARANCE -->
      <ATabs.TabPane :key="Tabs.Appearance">
        <template #tab>
          <button
            class="flex items-center gap-3 rounded-DEFAULT px-3 text-sm font-medium cursor-pointer "
          >
            <span class="material-symbols-outlined text-subtle-light dark:text-subtle-dark">contrast</span>
            <span>Appearance</span>
          </button>
        </template>

        <Appearence />
      </ATabs.TabPane>

    </ATabs>
  </div>
</template>
