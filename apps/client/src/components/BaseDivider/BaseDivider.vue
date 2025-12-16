<template>
  <Divider
    :dashed="dashed"
    :orientation="orientation"
    :orientation-margin="orientationMargin"
    :plain="plain"
    :type="type"
  />
</template>

<script setup lang="ts">
import { Divider } from 'ant-design-vue'

defineProps({
  dashed: {
    type: Boolean,
    default: false,
  },
  orientation: {
    type: String as () => 'left' | 'right' | 'center' | undefined,
    default: 'center',
  },
  orientationMargin: {
    type: [String, Number],
    default: '0',
  },
  plain: {
    type: Boolean,
    default: false,
  },
    type: {
        type: String as () => '' | 'horizontal' | 'vertical' | undefined,
        default: 'horizontal',
    },
})
</script>

<style scoped>
</style>
