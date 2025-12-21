<script setup lang="ts">
import BaseBox from '@/components/BaseBox.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'
import { Form, FormItem, TypographyText, TypographyTitle } from 'ant-design-vue'
import { reactive } from 'vue'
import { useValidationForm } from '@/composables/useValidationForm'
import { useI18n } from 'vue-i18n'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '@/config/queryKeys'
import { usePost } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
import BaseSelect from '@/components/BaseSelect/BaseSelect.vue'
const queryClient = useQueryClient()
const years = Array.from({ length: 70 }, (_, i) => ({
  label: (new Date().getFullYear() - i).toString(),
  value: (new Date().getFullYear() - i).toString(),
}))
const { t } = useI18n()
interface FormState {
  fromYear: string
  toYear: string
}
const { formRef, generateRules } = useValidationForm<FormState>()
const formState = reactive<FormState>({
  fromYear: '',
  toYear: '',
})
const rules = generateRules({
  fromYear: [
    {
      required: true,
      message: t('requiredRule'),
      trigger: 'change',
    },
  ],
  toYear: [
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
    const payload = {
      fromYear: Number(formState.fromYear),
      toYear: Number(formState.toYear),
    }
    return usePost('/api/fasting/generate', payload)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [queryKeys.user.me] }).then(() => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.prayer.list] })
    })
    showSuccessMessage("Qazo ro'zalari kalendari muvaffaqiyatli yaratildi")
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
        <TypographyTitle :level="2"> Qazo ro'zalaringiz oralig'ini kiriting </TypographyTitle>
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
          <FormItem name="fromYear">
            <BaseFormLabel for="fromYear" required>Boshlanish tili</BaseFormLabel>
            <BaseSelect
              :options="years"
              placeholder="Yil tanlang"
              id="fromYear"
              v-model="formState.fromYear"
            ></BaseSelect>
          </FormItem>
          <!-- Text Field: End Date -->
          <FormItem name="toYear">
            <BaseFormLabel for="toYear" required>Tugash yili</BaseFormLabel>
            <BaseSelect :options="years" id="toYear" v-model="formState.toYear"></BaseSelect>
          </FormItem>
        </div>
        <!-- Meta Text -->
        <TypographyText type="secondary">
          Bu oraliq odatda balog'at yoshidan to ro'za tutishni boshlagungacha bo'lgan muddat
          hisoblanadi
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
