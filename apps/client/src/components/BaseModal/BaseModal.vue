<script setup lang="ts">
import { useAttrs } from 'vue'
import { Modal } from 'ant-design-vue'
import { type ModalProps } from 'ant-design-vue/es/modal/Modal'
const model = defineModel<boolean>()
const attrs = useAttrs()
const { closable = true, mask = true, maskClosable = true,footer=null } = defineProps<ModalProps>()
const emit = defineEmits(['cancel'])
</script>
<template>
  <Modal
    v-bind="attrs"
    :afterClose
    :bodyStyle
    :cancelButtonProps
    :cancelText
    :centered="true"
    :closable
    :closeIcon
    :confirmLoading
    :destroyOnClose
    :footer
    :forceRender
    :getContainer
    :mask
    :maskClosable
    :maskStyle
    :okButtonProps
    :okText
    :okType
    :title
    :width
    :wrapClassName
    :zIndex
    v-model:open="model"
    @cancel="(e) => emit('cancel', e)"
  >
    <slot></slot>
  </Modal>
</template>
<style scoped></style>
