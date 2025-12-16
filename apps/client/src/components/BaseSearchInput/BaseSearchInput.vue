<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
// import BaseIcon from '../BaseIcon/BaseIcon.vue'
import BaseInput from '../BaseInput/BaseInput.vue'
import { computed } from 'vue'
const props = defineProps({
  modelValue: { type: String, default: '' },
})
const debouncedEmit = useDebounceFn((value: string) => emit('update:modelValue', value), 500)
const emit = defineEmits(['update:modelValue'])

const modelValueC = computed({
  get: () => props.modelValue,
  set: (value) => {
    debouncedEmit(value)
  },
})
</script>
<template>
  <BaseInput v-bind="$attrs" v-model="modelValueC" lazy placeholder="Izlash">
    <template #prefix>
      <!-- <BaseIcon class="w-5 h-5" color="#181818" name="search"></BaseIcon> -->
    </template>
  </BaseInput>
</template>
