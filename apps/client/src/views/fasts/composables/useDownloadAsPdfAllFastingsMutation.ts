import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useMutation } from '@tanstack/vue-query'

export function useDownloadAsPdfAllFastingsMutation() {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [queryKeys.fasting.downloadAsPdf],
    mutationFn: async () => {
      const res = await useGet('/api/fasting/export/pdf', { responseType: 'blob' })
      // @ts-expect-error
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'qazo-rozalar.pdf'
      link.click()
      URL.revokeObjectURL(link.href)
    },
  })

  return { mutateAsync, isPending }
}
