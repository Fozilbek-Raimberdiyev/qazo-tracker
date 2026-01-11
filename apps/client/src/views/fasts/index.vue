<script setup lang="ts">
import { storeToRefs } from 'pinia'
import EmptyStateForm from './components/EmptyStateForm.vue'
import List from './components/List.vue'
import { useUserStore } from '@/stores/user.store'
import ListForMobile from './components/ListForMobile.vue';
const { user } = storeToRefs(useUserStore())
</script>

<template>
  <List v-if="user?.hasQazoFasting"></List>
  <!-- <ListForMobile v-if="user?.hasQazoFasting"></ListForMobile> -->
  <EmptyStateForm v-else></EmptyStateForm>
</template>
