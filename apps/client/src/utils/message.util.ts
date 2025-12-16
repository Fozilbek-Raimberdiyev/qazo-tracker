import { message } from 'ant-design-vue'

export function showSuccessMessage(content: string, onClose?: () => void) {
  message.success({
    content,
    duration: 3,
    onClose
  })
}

export function showErrorMessage(content: string, onClose?: () => void) {
  message.error({
    content,
    duration: 3,
    onClose
  })
}

export function showWarningMessage(content: string, onClose?: () => void) {
  message.warning({
    content,
    duration: 3,
    onClose
  })
}

export function showInfoMessage(content: string, onClose?: () => void) {
  message.info({
    content,
    duration: 3,
    onClose
  })
}
