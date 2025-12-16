<script setup lang="ts">
const props = defineProps<{
  for?: string
  required?: boolean
}>();
</script>
<template>
   <label :for="props.for" class="text-primary text-sm font-medium leading-[150%] mb-2 inline-block" ><slot></slot>
   <span v-if="required" class="text-[#E62E2E]">*</span>
   </label>
</template>
