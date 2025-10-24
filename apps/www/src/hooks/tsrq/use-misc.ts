import { toast } from '@/components/ui/use-toast'
import { useTRPC } from '@/lib/trpc'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

export function useContactForm() {
  const api = useTRPC()
  const router = useRouter()

  const newEntryMutationOptions = api.misc.contactUs.mutationOptions({
    onError: ({ message }) =>
      toast({
        title: 'Something went wrong',
        description:
          message || 'Failed to send your message. Please try again later.',
      }),
    onSuccess: ({ toastTitle, toastDescription }) => {
      toast({
        title: toastTitle,
        description: toastDescription,
      })
      router.navigate({ to: '/' })
      router.invalidate()
    },
  })

  const newEntryMutation = useMutation(newEntryMutationOptions)

  return { newEntryMutation }
}
