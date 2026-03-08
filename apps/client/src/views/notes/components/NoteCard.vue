<script setup lang="ts">
import dayjs from 'dayjs'
import type { Note } from '@/types/note.types'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

const props = defineProps<{
  note: Note
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', note: Note): void
  (e: 'delete', id: string): void
}>()

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const preview = stripHtml(props.note.content ?? '').slice(0, 160)
</script>

<template>
  <div
    class="note-card group relative flex flex-col gap-3 p-5 rounded-xl border border-solid border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
    @click="emit('edit', note)"
  >
    <!-- Action buttons -->
    <div
      class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      @click.stop
    >
      <BaseButton
        size="small"
        type="text"
        title="Tahrirlash"
        @click="emit('edit', note)"
      >
        <span class="material-symbols-outlined text-base!">edit</span>
      </BaseButton>
      <BaseButton
        size="small"
        type="text"
        danger
        :loading="isDeleting"
        title="O'chirish"
        @click="emit('delete', note.id)"
      >
        <span class="material-symbols-outlined text-base!">delete</span>
      </BaseButton>
    </div>

    <!-- Title -->
    <h3 class="text-base font-semibold leading-snug dark:text-white pr-16 line-clamp-2">
      {{ note.title }}
    </h3>

    <!-- Content preview -->
    <p v-if="preview" class="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
      {{ preview }}
    </p>
    <p v-else class="text-sm text-gray-400 dark:text-gray-500 italic">Kontent yo'q</p>

    <!-- Footer -->
    <div class="flex items-center justify-between mt-auto pt-2 border-t border-solid border-gray-100 dark:border-gray-700">
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ dayjs(note.updatedAt).format('DD.MM.YYYY HH:mm') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.note-card:hover {
  transform: translateY(-1px);
}
</style>
