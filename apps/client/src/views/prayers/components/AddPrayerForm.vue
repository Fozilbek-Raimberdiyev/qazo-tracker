<script setup lang="ts">
import BaseDatePicker from '@/components/BaseDatePicker/BaseDatePicker.vue'
import BaseFormLabel from '@/components/BaseFormLabel/BaseFormLabel.vue'
import { useValidationForm } from '@/composables/useValidationForm'
import { usePrayerTypeList } from '../composables/usePrayerTypesList'
import { Form, FormItem, RadioGroup } from 'ant-design-vue'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseRadio from '@/components/BaseRadio/BaseRadio.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { queryKeys } from '@/config/queryKeys'
import { usePost } from '@/services/api.service'
import { showSuccessMessage } from '@/utils/message.util'
const { optionsC } = usePrayerTypeList()
const queryClient = useQueryClient()
const emit = defineEmits(['success', 'cancel'])
const { t } = useI18n()
interface FormState {
  prayerTypeId: string
  date: string
}
const formState = reactive<FormState>({
  date: '',
  prayerTypeId: '',
})
const { formRef, generateRules } = useValidationForm<FormState>()

const rules = generateRules({
  date: [{ required: true, message: t('requiredRule'), trigger: 'change' }],
  prayerTypeId: [{ required: true, message: t('requiredRule'), trigger: 'change' }],
})
const { mutateAsync, isPending } = useMutation({
  mutationKey: [queryKeys.prayer.add],
  mutationFn: () => {
    return usePost('/api/prayer/add', formState)
  },
  onSuccess: () => {
    showSuccessMessage("Muvaffaqqiyatli qo'shildi")
  },
})
function handleFinish() {
  mutateAsync().then(() => {
    queryClient.invalidateQueries({ queryKey: [queryKeys.prayer.list] })
    emit('success')
  })
}
</script>

<template>
  <div>
    <Form :rules :model="formState" ref="formRef" @finish="handleFinish">
      <FormItem name="date">
        <BaseFormLabel for="date">Sana</BaseFormLabel>
        <BaseDatePicker value-format="YYYY-MM-DD" v-model="formState.date as any" id="date"></BaseDatePicker>
      </FormItem>
      <!-- prayerType -->
      <FormItem name="prayerTypeId">
        <BaseFormLabel for="prayerTypeId">Namoz turi</BaseFormLabel>
        <RadioGroup v-model:value="formState.prayerTypeId" class="block!">
          <BaseRadio v-for="option in optionsC" :key="option.value" :value="option.value">
            {{ option.label }}
          </BaseRadio>
        </RadioGroup>
      </FormItem>
      <div class="btns flex justify-end gap-2 items-center">
        <BaseButton @click="emit('cancel')">Bekor qilish</BaseButton>
        <BaseButton html-type="submit" :loading="isPending" type="primary">Qo'shish</BaseButton>
      </div>
    </Form>
  </div>
</template>
