<template>
  <InputPassword :placeholder v-model:value="model" size="large"> </InputPassword>
</template>

<script setup lang="ts">
import { InputPassword } from 'ant-design-vue'
const model = defineModel<string | undefined>()
defineProps({
  height : {
    type : String
  },
  placeholder : {
    type : String
  }
})
</script>

<style scoped>
:global(.ant-input-password) {
  height : v-bind(height) !important;
}
</style>
