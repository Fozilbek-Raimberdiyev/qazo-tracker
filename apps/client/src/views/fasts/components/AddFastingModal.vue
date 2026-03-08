<script setup lang="ts">
import { reactive } from 'vue'
import { Form, FormItem } from 'ant-design-vue'
import BaseModal from '@/components/BaseModal/BaseModal.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'
import BaseDatePicker from '@/components/BaseDatePicker/BaseDatePicker.vue'
import { useValidationForm } from '@/composables/useValidationForm'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '@/config/queryKeys'
import { usePost } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
import { useI18n } from 'vue-i18n'

const model = defineModel<boolean>()
const emit = defineEmits(['success'])
const { t } = useI18n()
const queryClient = useQueryClient()

interface FormState {
  date: string
}

const formState = reactive<FormState>({ date: '' })
const { formRef, generateRules } = useValidationForm<FormState>()

const rules = generateRules({
  date: [{ required: true, message: t('requiredRule'), trigger: 'change' }],
})

const { isPending, mutateAsync } = useMutation({
  mutationKey: [queryKeys.fasting.generate],
  mutationFn: () => usePost('/api/fasting/add', { date: formState.date }),
  onSuccess: () => {
    showSuccessMessage("Qazo ro'zasi muvaffaqiyatli qo'shildi")
    queryClient.invalidateQueries({ queryKey: [queryKeys.fasting.list] })
    queryClient.invalidateQueries({ queryKey: [queryKeys.user.me] })
    formState.date = ''
    model.value = false
    emit('success')
  },
})

function handleFinish() {
  mutateAsync()
}
</script>

<template>
  <BaseModal v-model="model" title="Yangi ro'za qo'shish" :width="420" :destroyOnClose="true">
    <Form :model="formState" ref="formRef" :rules @finish="handleFinish" class="pt-2">
      <FormItem name="date">
        <BaseFormLabel for="date" required>Sana</BaseFormLabel>
        <BaseDatePicker
          value-format="YYYY-MM-DD"
          v-model="formState.date as any"
          id="date"
          placeholder="Sana tanlang"
        />
      </FormItem>
      <div class="flex justify-end gap-2 mt-4">
        <BaseButton @click="model = false">Bekor qilish</BaseButton>
        <BaseButton type="primary" html-type="submit" :loading="isPending">Qo'shish</BaseButton>
      </div>
    </Form>
  </BaseModal>
</template>
