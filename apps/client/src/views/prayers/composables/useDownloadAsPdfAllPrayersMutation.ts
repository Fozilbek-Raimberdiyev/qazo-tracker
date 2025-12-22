import { queryKeys } from '@/config/queryKeys'
import { useGet } from '@/services/api.service'
import { useMutation } from '@tanstack/vue-query'

export function useDownloadAsPdfAllPrayersMutation() {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [queryKeys.prayer.downloadAsPdf],
    mutationFn: async () => {
      const res = await useGet('/api/prayer/export/pdf', { responseType: 'blob' })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'qazo-namozlar.pdf'
      link.click()
      URL.revokeObjectURL(link.href)
    },
  })

  return {
    mutateAsync,
    isPending,
  }
}
