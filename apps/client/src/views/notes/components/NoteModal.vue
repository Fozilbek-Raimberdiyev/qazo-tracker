<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import BaseModal from '@/components/BaseModal/BaseModal.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { Form, FormItem, Input } from 'ant-design-vue'
import { useCreateNoteMutation, useUpdateNoteMutation } from '../composables/useCreateNoteMutation'
import type { Note } from '@/types/note.types'

interface Props {
  editNote?: Note | null
}

const props = withDefaults(defineProps<Props>(), {
  editNote: null,
})

const model = defineModel<boolean>()
const emit = defineEmits(['success'])

const title = ref('')
const isEditMode = computed(() => !!props.editNote)

const { mutateAsync: createNote, isPending: isCreating } = useCreateNoteMutation()
const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateNoteMutation()
const isPending = computed(() => isCreating.value || isUpdating.value)

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Qaydingizni bu yerga yozing...',
    }),
    CharacterCount.configure({
      limit: 100000,
    }),
  ],
  content: '',
  editorProps: {
    attributes: {
      class: 'tiptap-editor',
    },
  },
})

watch(
  () => model.value,
  (open) => {
    if (open) {
      if (props.editNote) {
        title.value = props.editNote.title
        editor.value?.commands.setContent(props.editNote.content || '')
      } else {
        title.value = ''
        editor.value?.commands.clearContent()
      }
    }
  },
)

async function handleSave() {
  if (!title.value.trim()) return

  const content = editor.value?.getHTML() ?? ''

  if (isEditMode.value && props.editNote) {
    await updateNote({ id: props.editNote.id, payload: { title: title.value.trim(), content } })
  } else {
    await createNote({ title: title.value.trim(), content })
  }

  model.value = false
  emit('success')
}

function handleCancel() {
  model.value = false
}

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run()
}
function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run()
}
function toggleHeading(level: 1 | 2 | 3) {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}
function toggleBulletList() {
  editor.value?.chain().focus().toggleBulletList().run()
}
function toggleOrderedList() {
  editor.value?.chain().focus().toggleOrderedList().run()
}
function toggleBlockquote() {
  editor.value?.chain().focus().toggleBlockquote().run()
}
function toggleCode() {
  editor.value?.chain().focus().toggleCode().run()
}
function undo() {
  editor.value?.chain().focus().undo().run()
}
function redo() {
  editor.value?.chain().focus().redo().run()
}

const charCount = computed(() => editor.value?.storage.characterCount?.characters() ?? 0)
</script>

<template>
  <BaseModal
    v-model="model"
    :title="isEditMode ? 'Qaydni tahrirlash' : 'Yangi qayd'"
    :width="800"
    :destroyOnClose="true"
    @cancel="handleCancel"
  >
    <div class="flex flex-col gap-4 py-2">
      <!-- Title input -->
      <Form layout="vertical" @submit.prevent="handleSave">
        <FormItem
          name="title"
          :rules="[{ required: true, message: 'Sarlavha kiritish shart' }]"
        >
          <label class="block text-sm font-medium mb-1 dark:text-white/80">Sarlavha</label>
          <Input
            v-model:value="title"
            placeholder="Qayd sarlavhasi..."
            size="large"
            :maxlength="255"
            showCount
          />
        </FormItem>
      </Form>

      <!-- TipTap Toolbar -->
      <div class="editor-toolbar flex flex-wrap items-center gap-1 p-2 rounded-lg border border-solid border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          class="toolbar-btn"
          :class="{ 'is-active': editor?.isActive('bold') }"
          title="Qalin (Ctrl+B)"
          @click="toggleBold"
        >
          <span class="material-symbols-outlined text-base!">format_bold</span>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :class="{ 'is-active': editor?.isActive('italic') }"
          title="Kursiv (Ctrl+I)"
          @click="toggleItalic"
        >
          <span class="material-symbols-outlined text-base!">format_italic</span>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :class="{ 'is-active': editor?.isActive('code') }"
          title="Kod"
          @click="toggleCode"
        >
          <span class="material-symbols-outlined text-base!">code</span>
        </button>

        <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button
          type="button"
          class="toolbar-btn font-bold text-xs"
          :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
          title="Sarlavha 1"
          @click="toggleHeading(1)"
        >H1</button>
        <button
          type="button"
          class="toolbar-btn font-bold text-xs"
          :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
          title="Sarlavha 2"
          @click="toggleHeading(2)"
        >H2</button>
        <button
          type="button"
          class="toolbar-btn font-bold text-xs"
          :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
          title="Sarlavha 3"
          @click="toggleHeading(3)"
        >H3</button>

        <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button
          type="button"
          class="toolbar-btn"
          :class="{ 'is-active': editor?.isActive('bulletList') }"
          title="Ro'yxat"
          @click="toggleBulletList"
        >
          <span class="material-symbols-outlined text-base!">format_list_bulleted</span>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :class="{ 'is-active': editor?.isActive('orderedList') }"
          title="Raqamli ro'yxat"
          @click="toggleOrderedList"
        >
          <span class="material-symbols-outlined text-base!">format_list_numbered</span>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          :class="{ 'is-active': editor?.isActive('blockquote') }"
          title="Iqtibos"
          @click="toggleBlockquote"
        >
          <span class="material-symbols-outlined text-base!">format_quote</span>
        </button>

        <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <button
          type="button"
          class="toolbar-btn"
          title="Orqaga (Ctrl+Z)"
          @click="undo"
        >
          <span class="material-symbols-outlined text-base!">undo</span>
        </button>
        <button
          type="button"
          class="toolbar-btn"
          title="Oldinga (Ctrl+Y)"
          @click="redo"
        >
          <span class="material-symbols-outlined text-base!">redo</span>
        </button>

        <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">
          {{ charCount }} ta belgi
        </span>
      </div>

      <!-- TipTap Editor Content -->
      <div class="editor-wrapper rounded-lg border border-solid border-gray-200 dark:border-gray-700 min-h-52 cursor-text" @click="editor?.commands.focus()">
        <EditorContent :editor="editor" />
      </div>
    </div>

    <!-- Footer buttons -->
    <div class="flex justify-end gap-2 mt-4">
      <BaseButton @click="handleCancel">Bekor qilish</BaseButton>
      <BaseButton
        type="primary"
        :loading="isPending"
        :disabled="!title.trim()"
        @click="handleSave"
      >
        {{ isEditMode ? 'Saqlash' : "Qo'shish" }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<style scoped>
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  transition: background 0.15s, color 0.15s;
}

.toolbar-btn:hover {
  background: rgba(0, 0, 0, 0.07);
}

.dark .toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.toolbar-btn.is-active {
  background: var(--color-primary, #22c55e);
  color: white;
}
</style>

<style>
.tiptap-editor {
  min-height: 200px;
  padding: 12px 16px;
  outline: none;
  font-size: 14px;
  line-height: 1.7;
}

.tiptap-editor p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap-editor h1 { font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0; }
.tiptap-editor h2 { font-size: 1.25rem; font-weight: 600; margin: 0.4rem 0; }
.tiptap-editor h3 { font-size: 1.1rem; font-weight: 600; margin: 0.3rem 0; }
.tiptap-editor p { margin: 0.3rem 0; }
.tiptap-editor ul { list-style: disc; padding-left: 1.5rem; }
.tiptap-editor ol { list-style: decimal; padding-left: 1.5rem; }
.tiptap-editor blockquote {
  border-left: 3px solid var(--color-primary, #22c55e);
  padding-left: 1rem;
  margin-left: 0;
  color: #6b7280;
  font-style: italic;
}
.tiptap-editor code {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  padding: 2px 5px;
  font-family: monospace;
  font-size: 0.9em;
}
.tiptap-editor strong { font-weight: 700; }
.tiptap-editor em { font-style: italic; }
</style>
