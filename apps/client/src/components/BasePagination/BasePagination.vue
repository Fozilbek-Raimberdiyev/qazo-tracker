<template>
  <Pagination
    :defaultCurrent="modelValue"
    :responsive="true"
    @change="onChange"
    :total="total"
    :defaultPageSize="pageSize"
    :current="modelValue"
  />
</template>

<script setup lang="ts">
import { Pagination } from 'ant-design-vue'

defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 50,
  },
})
const emit = defineEmits(['update:modelValue', 'changed'])

function onChange(current: number) {
  emit('update:modelValue', current)
  emit('changed', current)
}
</script>

<style>
.ant-pagination-item,
.ant-pagination-next,
.ant-pagination-prev {
  display: flex;
  width: max-content !important;
  height: 32px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 0px !important;
  /* border: 1px solid #eeeef0 !important;
  color: #737687 !important;
  background: #fff !important; */
  font-size: 14px !important;
  transition: all 0.3s ease;
  margin-inline-end: 0px !important;
}
/*
.ant-pagination-item:hover,
.ant-pagination-next:hover,
.ant-pagination-prev:hover {
  border-color: #745CC9 !important;
  color: #fff !important;
  background: #745CC9 !important;
} */

/* .ant-pagination-item-active {
  border-color: #745CC9 !important;
} */

.ant-pagination-item-ellipsis {
  font-size: 16px;
}
.ant-pagination-prev {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}
.ant-pagination-next {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}
:where(.ant-pagination .ant-pagination-options) {
  display: none !important;
  margin-inline-start: 16px;
  vertical-align: middle;
}

</style>
