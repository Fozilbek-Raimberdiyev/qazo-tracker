<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import EmptyStateForm from './components/EmptyStateForm.vue'
import List from './components/List.vue'
import ListForMobile from './components/ListForMobile.vue'
const { user } = storeToRefs(useUserStore())

const isLoaded = ref(false)
onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <List class="" v-if="user?.hasQazoPrayers" :key="user.id"> </List>
   <!-- <ListForMobile v-if="user?.hasQazoPrayers"></ListForMobile> -->
  <EmptyStateForm v-else></EmptyStateForm>
</template>
