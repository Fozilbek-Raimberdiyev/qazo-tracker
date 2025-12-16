<script setup lang="ts">
import { Switch } from 'ant-design-vue'
import {   useAttrs } from 'vue'
import { type SwitchProps } from 'ant-design-vue'
const model = defineModel<boolean | string | number>()
const attrs = useAttrs()
const emit = defineEmits(['change', 'click'])

const {} =  defineProps<SwitchProps>()
// const forceReload = getCurrentInstance()?.proxy?.$forceUpdate;
</script>
<template>
   <Switch
    v-model:checked="model"
    @change="($e: any) => emit('change', $e)"
    @click="emit('click')"
    v-bind="attrs"
    :disabled
    :autofocus
    :loading
    :size
    :checked-value="true"
    :un-checked-value="false"
  >
  </Switch>
</template>

<style scoped></style>
