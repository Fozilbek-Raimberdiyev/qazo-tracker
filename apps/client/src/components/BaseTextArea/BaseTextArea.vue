<template>
  <Textarea
    v-bind="attrs"
    v-model:value="model"
    :allowClear
    :autoSize
    :defaultValue
    :disabled
    :id
    :rows
    :maxlength
    :placeholder
    :showCount
    :status
    :size="size"
    @change="($event: any) => emit('change', $event)"
    @pressEnter="($event: any) => emit('pressEnter', $event)"
    class="w-full"
  >
    <template #addonAfter v-if="slots['addonAfter']"><slot name="addonAfter"></slot> </template>
    <template #prefix v-if="slots['prefix']"><slot name="prefix"></slot> </template>
    <template #suffix v-if="slots['suffix']"><slot name="suffix"></slot> </template>
  </Textarea>
</template>

<script setup lang="ts">
import { Textarea } from 'ant-design-vue'
import type { TextAreaProps } from 'ant-design-vue';
import { useAttrs, useSlots } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slots = useSlots() as Record<string, any>
const { size = 'large' } = defineProps<TextAreaProps>()
const model = defineModel<string | number | undefined>()
const attrs = useAttrs()
const emit = defineEmits(['change','pressEnter'])
</script>

<style scoped>
/* Agar maxsus styling kerak bo'lsa shu yerga qo'shing */
</style>
