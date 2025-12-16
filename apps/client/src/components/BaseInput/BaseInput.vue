<template>
  <Input
    v-bind="attrs"
    v-model:value="model"
    :addonAfter
    :addonBefore
    :allowClear
    :bordered="true"
    :clearIcon
    :defaultValue
    :disabled
    :id
    :maxlength
    :prefix
    :showCount
    :status
    :size
    :suffix
    :type
    :placeholder
    @change="($event: any) => emit('change', $event)"
    @input="($event: any) => emit('input', $event)"
    :readonly
  >
    <template #addonAfter v-if="slots['addonAfter']"><slot name="addonAfter"></slot> </template>
    <template #prefix v-if="slots['prefix']"><slot name="prefix"></slot> </template>
    <template #suffix v-if="slots['suffix']"><slot name="suffix"></slot> </template>
  </Input>
</template>

<script setup lang="ts">
import { Input } from 'ant-design-vue'
import type { InputProps } from 'ant-design-vue/es/vc-input/inputProps'
import { useAttrs, useSlots } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slots = useSlots() as Record<string, any>
interface Props extends InputProps {
  readonly?: boolean
}
const { size = 'large' } = defineProps<Props>()
const model = defineModel<string | number | undefined>()
const attrs = useAttrs()
const emit = defineEmits(['change','input'])
</script>

<style scoped></style>
