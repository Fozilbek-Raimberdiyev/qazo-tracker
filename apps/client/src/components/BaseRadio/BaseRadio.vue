<script setup lang="ts">
import { RadioButton, Radio } from 'ant-design-vue'
const model = defineModel<boolean>()
interface Props {
  mode?: 'radiobutton' | 'radio'
  value?: unknown
  disabled?: boolean
}
const {} = defineProps<Props>()
</script>

<template>
  <Radio v-if="mode == 'radio'" :disabled v-model:checked="model" :value>
    <slot></slot>
  </Radio>
  <RadioButton v-else :value :disabled>
    <slot></slot>
  </RadioButton>
</template>
