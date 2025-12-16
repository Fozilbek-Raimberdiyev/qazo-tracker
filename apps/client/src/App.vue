<script setup lang="ts">
import {ConfigProvider} from "ant-design-vue"
import {useThemeStore} from "@/stores/theme"
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { storeToRefs } from "pinia";
const {themeConfig} = storeToRefs(useThemeStore())
const {initTheme} = useThemeStore()
initTheme()
</script>

<template>
  <ConfigProvider :theme="themeConfig">
     <RouterView></RouterView>
  </ConfigProvider>
<VueQueryDevtools initialIsOpen></VueQueryDevtools>
</template>
