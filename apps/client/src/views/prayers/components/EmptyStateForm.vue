<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseDatePicker from '@/components/BaseDatePicker/BaseDatePicker.vue'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'
import { Form, FormItem, TypographyText, TypographyTitle } from 'ant-design-vue'
import { reactive } from 'vue'
import { useValidationForm } from '@/composables/useValidationForm'
import { useI18n } from 'vue-i18n'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '@/config/queryKeys'
import { usePost } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
const queryClient = useQueryClient()
const { t } = useI18n()
interface FormState {
  fromDate: string
  toDate: string
}
const { formRef, generateRules } = useValidationForm<FormState>()
const formState = reactive<FormState>({
  fromDate: '',
  toDate: '',
})
const rules = generateRules({
  fromDate: [
    {
      required: true,
      message: t('requiredRule'),
      trigger: 'change',
    },
  ],
  toDate: [
    {
      required: true,
      message: t('requiredRule'),
      trigger: 'change',
    },
  ],
})

const { isPending, mutateAsync } = useMutation({
  mutationKey: [queryKeys.prayer.generate],
  mutationFn: () => {
    return usePost('/api/prayer/generate', formState)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [queryKeys.user.me, queryKeys.prayer.list] })
    showSuccessMessage('Qazo namozlari kalendari muvaffaqiyatli yaratildi')
  },
})

function handleFinish() {
  mutateAsync()
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page Heading -->
    <div class="flex flex-wrap justify-between gap-3 mb-8">
      <div class="flex flex-col gap-2">
        <TypographyTitle :level="2"> Qazo namozlaringiz oralig'ini kiriting </TypographyTitle>
        <TypographyText type="secondary">
          Kuzatishni boshlash uchun oraliqni kiriting
        </TypographyText>
      </div>
    </div>
    <!-- Form Section -->
    <BaseBox>
      <Form :model="formState" ref="formRef" :rules @finish="handleFinish">
        <div class="grid grid-cols-2 gap-6 mb-2">
          <!-- Text Field: Start Date -->
          <FormItem name="fromDate">
            <BaseFormLabel for="fromDate" required>Boshlanish sanasi</BaseFormLabel>
            <BaseDatePicker
              value-format="DD-MM-YYYY"
              id="fromDate"
              v-model="formState.fromDate as any"
            ></BaseDatePicker>
          </FormItem>
          <!-- Text Field: End Date -->
          <FormItem name="toDate">
            <BaseFormLabel for="toDate" required>Tugash sanasi</BaseFormLabel>
            <BaseDatePicker
              value-format="DD-MM-YYYY"
              id="toDate"
              v-model="formState.toDate as any"
            ></BaseDatePicker>
          </FormItem>
        </div>
        <!-- Meta Text -->
        <TypographyText type="secondary">
          Bu oraliq odatda balog'at yoshidan to namozni boshlagungacha bo'lgan muddat hisoblanadi
        </TypographyText>
        <!-- Button Group -->
        <div class="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-white/10">
          <BaseButton :loading="isPending" type="primary" html-type="submit">
            Hisoblash
          </BaseButton>
          <BaseButton>Bekor qilish</BaseButton>
        </div>
      </Form>
    </BaseBox>
  </div>
</template>
