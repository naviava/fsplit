import { useCallback } from 'react'

import { useMutation } from '@tanstack/react-query'
import { useTRPC } from '@/lib/trpc'

import { toast } from '@/components/ui/use-toast'
import { authClient } from '@/lib/auth-client'
import Env from '@/lib/env'

export function useNewUserRegistration(state: {
  setIsNavigating: (value: boolean) => void
  setEmailSent: (value: boolean) => void
}) {
  const api = useTRPC()

  const newUserRegistrationMutationOptions =
    api.user.newUserRegistration.mutationOptions({
      onError: ({ message }) =>
        toast({
          title: 'Something went wrong',
          description: message,
        }),
      onSuccess: ({ toastTitle, toastDescription }) => {
        state.setEmailSent(true)
        toast({
          title: toastTitle,
          description: toastDescription,
        })
      },
    })

  const newUserRegistrationMutation = useMutation(
    newUserRegistrationMutationOptions,
  )

  const authSignUp = useCallback(
    async (params: {
      email: string
      displayName: string
      password: string
      confirmPassword: string
      firstName?: string | undefined
      lastName?: string | undefined
      phone?: string | undefined
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
            })
          },

          onSuccess: ({ response }) => {
            console.log(response)
            state.setIsNavigating(true)

            newUserRegistrationMutation.mutate({
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
    [authClient, newUserRegistrationMutation, state.setIsNavigating],
  )

  return { authSignUp, newUserRegistrationMutation }
}
