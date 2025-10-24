import { useCallback } from 'react'

import { authClient } from '@/lib/auth-client'
import { useTRPC } from '@/lib/trpc'

import { toast } from '@/components/ui/use-toast'
import Env from '@/lib/env'
import { useMutation } from '@tanstack/react-query'

export function useNewUserRegistration(state: {
  setIsNavigating: (value: boolean) => void
  setEmailSent: (value: boolean) => void
}) {
  const api = useTRPC()

  const newUserRegistrationMutation =
    api.user.newUserRegistration.mutationOptions({
      onError: ({ message }) =>
        toast({
          title: 'Something went wrong',
          description: message,
          variant: 'destructive',
        }),
      onSuccess: ({ toastTitle, toastDescription }) => {
        state.setEmailSent(true)
        toast({
          title: toastTitle,
          description: toastDescription,
        })
      },
    })

  const mutation = useMutation(newUserRegistrationMutation)

  const authSignUp = useCallback(
    async (params: {
      email: string
      displayName: string
      password: string
      confirmPassword: string
      firstName: string
      lastName: string
      phone: string
    }) => {
      await authClient.signUp.email(
        {
          email: params.email,
          password: params.password,
          name: params.displayName,
          callbackURL: `${Env.WEB_URL}/groups`,
        },
        {
          onError: ({ error }) => {
            toast({
              title: 'Sign Up Failed',
              description: error.message,
              variant: 'destructive',
            })
          },

          onSuccess: ({ data }) => {
            state.setIsNavigating(true)

            mutation.mutate({
              displayName: params.displayName,
              email: params.email,
              firstName: params.firstName,
              lastName: params.lastName,
              phone: params.phone,
            })
          },
        },
      )
    },
    [authClient, state.setIsNavigating, state.setEmailSent],
  )

  return { authSignUp }
}
