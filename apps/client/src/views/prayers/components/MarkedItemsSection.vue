<script setup lang="ts">
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { queryKeys } from '@/config/queryKeys'
import { usePut } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
const visible = defineModel('visible')
const queryClient = useQueryClient()
interface Props {
  markedPrayers: string[]
}
const { markedPrayers } = defineProps<Props>()
const emit = defineEmits(['clear', 'success', 'cancel'])
const { mutateAsync: complete, isPending: completePending } = useMutation({
  mutationKey: [queryKeys.prayer.completeMultiple],
  mutationFn: () => {
    return usePut('/api/prayer/complete', { prayerIds: markedPrayers })
  },
  onSuccess: async () => {
    showSuccessMessage('Muvaffaqqiyatli saqlandi')
    await queryClient.invalidateQueries({ queryKey: [queryKeys.prayer.list] })
    emit('success')
  },
})

// uncomplete
const { mutateAsync: uncomplete, isPending: uncompletePending } = useMutation({
  mutationKey: [queryKeys.prayer.completeMultiple],
  mutationFn: () => {
    return usePut('/api/prayer/uncomplete', { prayerIds: markedPrayers })
  },
  onSuccess: () => {
    emit('success')
    showSuccessMessage('Muvaffaqqiyatli saqlandi')
    queryClient.invalidateQueries({ queryKey: [queryKeys.prayer.list] })
  },
})
</script>

<template>
  <Transition name="moveToTop">
    <div
      v-if="visible"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-background-light dark:bg-background-dark border border-(--color-border-light) dark:border-(--color-border-dark) rounded-xl px-4 py-4 z-50 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div class="flex items-center gap-3 pr-4 border-r border-white/10">
        <span class="font-medium text-wrap text-sm"
          >{{ markedPrayers?.length }} namoz tanlandi</span
        >
        <button @click="emit('clear')" class="text-xs underline cursor-pointer">Tozalash</button>
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
          :disabled="!markedPrayers.length"
          :loading="completePending"
          @click="complete()"
          type="primary"
        >
          <template #icon>
            <span class="material-symbols-outlined text-sm mr-1 align-top">check_circle</span>
          </template>
          O'qilgan qilib belgilash
        </BaseButton>
        <BaseButton
          :disabled="!markedPrayers.length"
          @click="uncomplete()"
          :loading="uncompletePending"
        >
          <template #icon>
            <span class="material-symbols-outlined text-sm mr-1 align-top">star</span>
          </template>
          Bajarilmagan qilib belgilash
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
  transform: translateY(calc(100% + 20px)); /* pastdan biroz ortiqcha surilgan */
}

.moveToTop-enter-to,
.moveToTop-leave-from {
  transform: translateY(0);
}
</style>
