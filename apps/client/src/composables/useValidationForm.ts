import { ref } from 'vue'
import type { Rule, FormInstance } from 'ant-design-vue/es/form'

/**
 * Generic composable for Ant Design Vue form validation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useValidationForm<FormState extends Record<string, any>>() {
  const formRef = ref<FormInstance>()

  /**
   * Generate type-safe rules based on the form state fields.
   */
  function generateRules(
    rules: Partial<Record<keyof FormState, Rule[]>>,
  ): Partial<Record<keyof FormState, Rule[]>> {
    return rules
  }

  /**
   * Validate the entire form
   */
  async function validate() {
    try {
      const values = await formRef.value?.validate()
      return { valid: true, values }
    } catch (errors) {
      return { valid: false, errors }
    }
  }

  function reset() {
    formRef.value?.resetFields()
  }

  return {
    formRef,
    generateRules,
    validate,
    reset,
  }
}
