<template>
  <InputPassword v-model:value="model" size="large"> </InputPassword>
</template>

<script setup lang="ts">
import { InputPassword } from 'ant-design-vue'
const model = defineModel<string | undefined>()
</script>

<style scoped></style>
