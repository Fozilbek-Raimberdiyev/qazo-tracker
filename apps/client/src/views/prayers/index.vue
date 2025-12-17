<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import EmptyStateForm from './components/EmptyStateForm.vue'
import List from './components/List.vue'
const { user } = storeToRefs(useUserStore())

const isLoaded = ref(false)
onMounted(() => {
  isLoaded.value = true
})
</script>

<template>
  <List class="" v-if="user?.qazoPrayers.length" :key="user.id"> </List>
  <EmptyStateForm v-else></EmptyStateForm>
</template>
