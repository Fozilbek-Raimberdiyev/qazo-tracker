<script lang="ts" setup>
import { computed, useAttrs } from 'vue';
import { Checkbox } from 'ant-design-vue';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface'


interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  autofocus?: boolean;
  size?: 'small' | 'middle' | 'large';
  label?: string;
  value?: string | number;
  isBordered?: boolean;
}


const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  indeterminate: false,
  autofocus: false,
  size: 'middle',
  label: '',
  value: undefined,
  isBordered: true
});


const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'change': [checked: boolean, event: CheckboxChangeEvent];
}>();


const attrs = useAttrs();


const isChecked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});


const handleChange = (e: CheckboxChangeEvent) => {
  const checked = e.target.checked;

  emit('update:modelValue', checked);
  emit('change', checked, e as CheckboxChangeEvent);
};
</script>

<template>
  <Checkbox
    :checked="isChecked"
    :disabled="disabled"
    :indeterminate="indeterminate"
    :autofocus="autofocus"
    :value="value"
    v-bind="attrs"
    @change="handleChange"
    :class="isBordered ? 'border border-[#E3E4E7] border-solid h-10' : ''"
    class=" rounded-lg  px-1! flex items-center!"
  >
    <slot>
         {{ label }}
    </slot>
  </Checkbox>
</template>

<style scoped>
</style>
