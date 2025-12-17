<script setup lang="ts">
import { setLocalStorage } from "@/utils/localStorage.util";
import {useRouteQuery} from "@vueuse/router"
import { useRouter } from "vue-router";
const accessToken = useRouteQuery('token', '')
const router = useRouter()

if (accessToken.value) {
  setLocalStorage('access_token', accessToken.value)
  router.push('/dashboard')
}
</script>

<template>
<div class="flex items-center justify-center h-screen">
  Yuklanmoqda...
</div>
</template>
