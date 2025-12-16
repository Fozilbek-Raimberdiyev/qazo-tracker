import { useValidationForm } from '@/composables/useValidationForm'
import { queryKeys } from '@/config/queryKeys'
import { usePost } from '@/services/api.service'
import { setLocalStorage } from '@/utils/localStorage.util'
import { showSuccessMessage } from '@/utils/message.util'
import { useMutation } from '@tanstack/vue-query'
import type { AxiosResponse } from 'axios'
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export function useRegisterForm() {
  const router = useRouter()
  const { formRef, generateRules } = useValidationForm<FormState>()
  const { t } = useI18n()
  interface FormState {
    email: string
    password: string
    firstName: string
    lastName: string
    confirmPassword: string
  }
  const formState = reactive<FormState>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  })
  const rules = generateRules({
    email: [
      { required: true, message: t('requiredRule'), trigger: 'change' },
      {
        type: 'email',
        message: t('emailRule'),
        trigger: 'change',
      },
    ],
    firstName: [{ required: true, message: t('requiredRule'), trigger: 'change' }],
    lastName: [{ required: true, message: t('requiredRule'), trigger: 'change' }],
    password: [
      { required: true, message: t('requiredRule'), trigger: 'change' },
      {
        min: 8,
        message: t('passwordRule'),
        trigger: 'change',
      },
    ],
  })

  // mutation
  const {isPending,mutateAsync} = useMutation({
    mutationKey: [queryKeys.auth.register],
    mutationFn: () => {
      return usePost('/api/auth/register', {
        email: formState.email,
        password: formState.password,
        firstName: formState.firstName,
        lastName: formState.lastName,
      })
    },
    onSuccess : (res:AxiosResponse) => {
      setLocalStorage('access_token', res.data.accessToken)
      showSuccessMessage('Tizimga muvaffaqiyatli kirildi')
      router.push('/dashboard')
    }
  })

  return {
    formState,
    rules,
    formRef,
    isPending,mutateAsync
  }
}
