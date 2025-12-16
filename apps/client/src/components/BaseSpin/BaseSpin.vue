<script setup lang="ts">
import { Spin } from 'ant-design-vue'
defineProps<{ spinning: boolean; }>()
</script>
<template>
  <Spin class="w-full min-h-full flex items-center justify-center" :spinning>
    <slot></slot>
  </Spin>
</template>
