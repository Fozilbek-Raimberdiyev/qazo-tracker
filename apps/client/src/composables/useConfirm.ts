import { Modal } from 'ant-design-vue'
export function useConfirm() {
  function confirm(onOk: () => void, onCancel?: () => void) {
    Modal.confirm({
      title: "Haqiqatdan ushbu yozuvni o'chirmoqchimisiz?",
      content: "O'chirilgan yozuvni qayta tiklab bo'lmasligi mumkin!",
      okText: 'Ha',
      cancelText: "Yo'q",
      onOk,
      onCancel,
      centered : true,
      type : 'confirm',
      iconType : 'danger'
    })
  }

  return {
    confirm,
  }
}
