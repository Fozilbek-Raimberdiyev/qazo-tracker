<script setup lang="ts">
import EmptyStateForm from './components/EmptyStateForm.vue';
import {useList} from "./composables/useList"
const {} = useList()
</script>

<template>
  <EmptyStateForm></EmptyStateForm>
</template>
