<script setup lang="ts">
import { Select } from 'ant-design-vue'
import { type SelectProps, type SelectValue } from 'ant-design-vue/es/select'
import { computed } from 'vue'
const model = defineModel<SelectValue>()
const emit = defineEmits([
  'select',
  'deselect',
  'blur',
  'change',
  'dropdownVisibleChange',
  'focus',
  'inputKeyDown',
  'mouseenter',
  'mouseleave',
  'popupScroll',
  'search',
  'loadMore',
  'update:modelValue',
])
const popupScroll = (e: UIEvent) => {
  const target = e.target as HTMLDivElement | null
  if (target && target.scrollTop + target.clientHeight >= target.scrollHeight) {
    if (loading) return
    emit('loadMore')
  }
}

interface Props extends SelectProps {
  modelValue?: string | number
  id?: string
}
const {
  fieldNames,
  bordered = true,
  showSearch = true,
  allowClear = true,
  showAction = ['click'],
  size = 'large',
  showArrow = true,
  loading = false,
  options
} = defineProps<Props>()

const optionsC = computed(() => {
  return options?.map((item) => {
    return {
      ...item,
      value : item.value
    }
  })
})
</script>
<template>
  <Select
    @select="($event: SelectValue) => emit('select', $event)"
    @deselect="($event: any) => emit('deselect', $event)"
    @blur="($event: any) => emit('blur', $event)"
    @change="($event: any) => emit('change', $event)"
    @dropdown-visible-change="($event: any) => emit('dropdownVisibleChange', $event)"
    @focus="($event: any) => emit('focus', $event)"
    @input-key-down="($event: any) => emit('inputKeyDown', $event)"
    @mouseenter="($event: any) => emit('mouseenter', $event)"
    @mouseleave="($event: any) => emit('mouseleave', $event)"
    @popup-scroll="popupScroll"
    @search="($event: any) => emit('search', $event)"
    :allowClear
    :autoClearSearchValue
    :autofocus
    :bordered
    :clearIcon
    :defaultActiveFirstOption
    :defaultOpen
    :disabled
    :fieldNames
    :filterOption
    :filterSort
    :loading
    :showArrow
    :showSearch
    :showAction
    :status
    :virtual
    :size
    :options="optionsC"
    style="width: 100%"
    v-model:value="model"
    :placeholder
    :mode
    v-bind="$attrs"
    :id
  >
  </Select>
</template>

<style scoped></style>
