<script setup lang="ts">
import { Button, type ButtonProps } from 'ant-design-vue'
interface PropsInterface extends ButtonProps {
  bgColor?: string
  borderColor?: string
  form?: string
}
const { size = 'large', bgColor } = defineProps<PropsInterface>()
</script>

<template>
  <Button
    :form
    @click="$emit('click')"
    v-bind="$attrs"
    :class="[
      bgColor ? 'has-own-bg' : '',
      borderColor ? 'has-own-border' : '',
      icon ? 'hasIcon' : '',
    ]"
    :block
    :danger
    :disabled
    :ghost
    :href
    :htmlType
    :icon
    :loading
    :shape
    :size
    :target
    :type
  >
    <template #icon>
      <slot name="icon"></slot>
    </template>
    <slot></slot>
  </Button>
</template>

<style>
.ant-btn.hasIcon {
  padding-left: 12px !important;
  padding-right: 12px !important;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ant-btn {
  padding-left: 20px !important;
  padding-right: 20px !important;
}
.ant-btn.has-own-bg {
  background: v-bind('bgColor') !important;
}
.ant-btn.has-own-border {
  background: v-bind('borderColor') !important;
}
</style>
