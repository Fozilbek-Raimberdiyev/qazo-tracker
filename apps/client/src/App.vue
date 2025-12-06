<script setup lang="ts">
import {ConfigProvider} from "ant-design-vue"
import {useThemeStore} from "@/stores/theme"
import { storeToRefs } from "pinia";
const {themeConfig} = storeToRefs(useThemeStore())
const {initTheme} = useThemeStore()
initTheme()
</script>

<template>
  <ConfigProvider :theme="themeConfig">
     <RouterView></RouterView>
  </ConfigProvider>

</template>
