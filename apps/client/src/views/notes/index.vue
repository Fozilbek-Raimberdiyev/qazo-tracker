<script setup lang="ts">
import { ref } from 'vue'
import { TypographyTitle, TypographyText, Empty } from 'ant-design-vue'
import BaseSpin from '@/components/BaseSpin/BaseSpin.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import NoteCard from './components/NoteCard.vue'
import NoteModal from './components/NoteModal.vue'
import { useNotesList } from './composables/useNotesList'
import { useDeleteNoteMutation } from './composables/useDeleteNoteMutation'
import { useConfirm } from '@/composables/useConfirm'
import type { Note } from '@/types/note.types'

const { notes, isPending } = useNotesList()
const { mutateAsync: deleteNote, isPending: isDeleting } = useDeleteNoteMutation()
const { confirm } = useConfirm()

const isModalOpen = ref(false)
const editingNote = ref<Note | null>(null)
const deletingId = ref<string | null>(null)

function openCreateModal() {
  editingNote.value = null
  isModalOpen.value = true
}

function openEditModal(note: Note) {
  editingNote.value = note
  isModalOpen.value = true
}

function handleDelete(id: string) {
  confirm(async () => {
    deletingId.value = id
    await deleteNote(id)
    deletingId.value = null
  })
}
</script>

<template>
  <BaseSpin :spinning="isPending">
    <!-- Page heading -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col gap-1">
        <TypographyTitle :level="2">Qaydlar</TypographyTitle>
        <TypographyText type="secondary">
          Shaxsiy qaydlaringizni saqlang va tahrirlang
        </TypographyText>
      </div>
      <BaseButton type="primary" size="large" @click="openCreateModal">
        <template #icon>
          <span class="material-symbols-outlined text-base!">add</span>
        </template>
        Yangi qayd
      </BaseButton>
    </div>

    <!-- Notes grid -->
    <div v-if="notes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        :is-deleting="isDeleting && deletingId === note.id"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty state -->
    <div v-else-if="!isPending" class="flex flex-col items-center justify-center py-20">
      <Empty description="">
        <template #description>
          <div class="flex flex-col items-center gap-2 mt-2">
            <span class="text-gray-500 dark:text-gray-400">Hali hech qanday qayd yo'q</span>
            <BaseButton type="primary" @click="openCreateModal">
              <template #icon>
                <span class="material-symbols-outlined text-base!">add</span>
              </template>
              Birinchi qaydni yarating
            </BaseButton>
          </div>
        </template>
      </Empty>
    </div>
  </BaseSpin>

  <!-- Note modal (create / edit) -->
  <NoteModal
    v-model="isModalOpen"
    :edit-note="editingNote"
  />
</template>
