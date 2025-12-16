<script setup lang="ts">
import { Button } from 'ant-design-vue'
// import BaseIcon from '../BaseIcon/BaseIcon.vue'
// import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
// const { t } = useI18n()
const router = useRouter()
</script>
<template>
  <div class="back-button">
    <Button size="large" @click="router.go(-1)">
      <div class="flex items-center gap-1.5">
        <div>
          <span class="material-symbols-outlined"> arrow_forward </span>
        </div>
        <div>
          <span>Orqaga </span>
        </div>
      </div>
    </Button>
  </div>
</template>

<style scoped>
:global(.back-button .ant-btn) {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
/*
:global(.back-button .ant-btn-default) {
  border-color: #d5d6db !important;
}
:global(.back-button .ant-btn-default:hover) {
  border-color: var(--primary-color) !important;
} */
.back-button span {
  color: #181818;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 21px */
}
</style>
