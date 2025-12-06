<script setup lang="ts">
import {TypographyParagraph, type TypographyProps} from "ant-design-vue"

const props = defineProps<TypographyProps>()
</script>

<template>
  <TypographyParagraph v-bind="props">
    <slot></slot>
  </TypographyParagraph>
</template>
