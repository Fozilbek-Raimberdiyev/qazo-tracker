<template>
  <Drawer
    :title
    :contentWrapperStyle="contentWrapperStyle"
    v-model:open="model"
    :placement="placement"
    :width="width"
    :height="height"
    :closable="closable"
    :mask="mask"
    :maskClosable="maskClosable"
    :destroyOnClose="destroyOnClose"
    :getContainer="getContainer"
    :keyboard="keyboard"
    :size="size"
    :extra="null"
    :headerStyle="headerStyle"
    :bodyStyle="bodyStyle"
    :footerStyle="footerStyle"
    :class="drawerClass"
    @close="handleClose"
    @afterOpenChange="handleAfterOpenChange"
    :zIndex
  >
    <!-- Custom Title Slot -->
    <template #title>
      <slot name="title">
        {{ title }}
      </slot>
    </template>

    <!-- Extra header slot -->
    <template #extra>
      <slot name="extra" />
    </template>

    <!-- Main content -->
    <div class="drawer-content">
      <slot />
    </div>

    <!-- Footer -->
    <template #footer>
      <slot name="footer">
        <div v-if="showDefaultFooter" class="drawer-footer">
          <Space>
            <Button @click="handleClose">{{ cancelText }}</Button>
            <Button type="primary" @click="handleConfirm" :loading="confirmLoading">
              {{ confirmText }}
            </Button>
          </Space>
        </div>
      </slot>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'
import { Drawer, Button, Space } from 'ant-design-vue'
const model = defineModel<boolean>()
 defineProps({
  title: String,
  placement: {
    type: String as () => 'left' | 'right' | 'top' | 'bottom' | undefined,
    default: 'right',
  },
  width: { type: [String, Number], default: 378 },
  height: { type: [String, Number], default: 378 },
  closable: { type: Boolean, default: true },
  mask: { type: Boolean, default: true },
  maskClosable: { type: Boolean, default: true },
  destroyOnClose: { type: Boolean, default: false },
  keyboard: { type: Boolean, default: true },
  zIndex: { type: Number, default: 1000 },
  size: {
    type: String as () => 'default' | 'large' | undefined,
    default: 'default',
  },
  headerStyle: { type: Object, default: () => ({}) },
  bodyStyle: { type: Object, default: () => ({}) },
  footerStyle: { type: Object, default: () => ({}) },
  drawerClass: { type: String, default: '' },

  showDefaultFooter: Boolean,
  confirmText: { type: String, default: 'OK' },
  cancelText: { type: String, default: 'Bekor qilish' },
  confirmLoading: Boolean,

  getContainer: {
    type: [String, Function] as PropType<
      string | false | HTMLElement | (() => HTMLElement) | undefined
    >,
    default: 'body',
  },

  contentWrapperStyle: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close', 'confirm', 'afterOpenChange'])

const handleClose = () => {
  model.value = false
  emit('close')
}
const handleConfirm = () => emit('confirm')
const handleAfterOpenChange = (open: boolean) => emit('afterOpenChange', open)
</script>

<style scoped>
.drawer-footer {
  text-align: right;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  margin-top: 16px;
}

@media (max-width: 768px) {
  :deep(.ant-drawer) {
    width: 100% !important;
  }
}
</style>
