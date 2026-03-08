<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { queryKeys } from '@/config/queryKeys'
import { usePut } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDeviceStore } from '@/stores/device.store'
import { storeToRefs } from 'pinia'

const { isMobile } = storeToRefs(useDeviceStore())
const visible = defineModel('visible')
const queryClient = useQueryClient()

interface Props {
  markedFastings: string[]
}
const { markedFastings } = defineProps<Props>()
const emit = defineEmits(['clear', 'success', 'cancel'])

const { mutateAsync: complete, isPending: completePending } = useMutation({
  mutationKey: [queryKeys.fasting.completeMultiple],
  mutationFn: () => usePut('/api/fasting/complete', { fastingIds: markedFastings }),
  onSuccess: async () => {
    showSuccessMessage('Muvaffaqqiyatli saqlandi')
    await queryClient.invalidateQueries({ queryKey: [queryKeys.fasting.list] })
    emit('success')
  },
})

const { mutateAsync: uncomplete, isPending: uncompletePending } = useMutation({
  mutationKey: [queryKeys.fasting.uncompleteMultiple],
  mutationFn: () => usePut('/api/fasting/uncomplete', { fastingIds: markedFastings }),
  onSuccess: async () => {
    showSuccessMessage('Muvaffaqqiyatli saqlandi')
    await queryClient.invalidateQueries({ queryKey: [queryKeys.fasting.list] })
    emit('success')
  },
})
</script>

<template>
  <Transition name="moveToTop">
    <div
      :style="{ bottom: isMobile ? '0' : '32px' }"
      v-if="visible"
      class="fixed left-1/2 -translate-x-1/2 bg-white dark:bg-background-dark border border-(--color-border-light) dark:border-(--color-border-dark) rounded-xl px-4 py-4 z-50 flex items-center gap-6"
    >
      <div class="flex items-center gap-3 pr-4 border-r border-white/10">
        <span class="font-medium text-sm">{{ markedFastings?.length }} ro'za tanlandi</span>
        <button @click="emit('clear')" class="text-xs underline cursor-pointer">Tozalash</button>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <BaseButton
          :disabled="!markedFastings.length"
          :loading="completePending"
          @click="complete()"
          type="primary"
        >
          <template #icon>
            <span class="material-symbols-outlined text-sm mr-1 align-top">check_circle</span>
          </template>
          Tutilgan qilib belgilash
        </BaseButton>
        <BaseButton
          :disabled="!markedFastings.length"
          @click="uncomplete()"
          :loading="uncompletePending"
        >
          <template #icon>
            <span class="material-symbols-outlined text-sm mr-1 align-top">star</span>
          </template>
          Tutilmagan qilib belgilash
        </BaseButton>
        <BaseButton @click="emit('cancel')">
          <template #icon>
            <span class="material-symbols-outlined text-sm mr-1 align-top">close</span>
          </template>
          Bekor qilish
        </BaseButton>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.moveToTop-enter-active,
.moveToTop-leave-active {
  transition: transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.moveToTop-enter-from,
.moveToTop-leave-to {
  transform: translateY(calc(100% + 20px));
}
.moveToTop-enter-to,
.moveToTop-leave-from {
  transform: translateY(0);
}
</style>
