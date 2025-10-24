import { useCallback, useMemo, useState } from 'react'

import { registerFormSchema } from '@fsplit/types/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useNewUserRegistration } from '@/hooks/tsrq/use-profile'
import { useForm } from 'react-hook-form'

import { AuthFormInput } from './auth-form-input'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

interface IProps {
  disabled: boolean
}

export function RegisterForm({ disabled }: IProps) {
  const [emailSent, setEmailSent] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const { authSignUp, newUserRegistrationMutation } = useNewUserRegistration({
    setIsNavigating,
    setEmailSent,
  })

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  })

  const isLoading = useMemo(
    () => disabled || newUserRegistrationMutation.isPending || isNavigating,
    [disabled, newUserRegistrationMutation.isPending, isNavigating],
  )

  const onSubmit = useCallback(
    (values: z.infer<typeof registerFormSchema>) => {
      authSignUp(values)
    },
    [authSignUp],
  )

  return (
    <>
      {emailSent && (
        <div className="space-y-4 text-center md:space-y-6">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Verification email sent
          </h2>
          <p className="leading-7 text-balance text-neutral-600 md:text-lg">
            Please check your email to verify your email address and start using
            FSplit.
          </p>
        </div>
      )}
      {!emailSent && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <AuthFormInput
              form={form}
              fieldName="displayName"
              label="Display name"
              placeholder="ImAwesome123"
              description="This will be your public name."
              disabled={isLoading}
            />
            <AuthFormInput
              form={form}
              fieldName="email"
              label="Email address"
              placeholder="yourname@email.com"
              disabled={isLoading}
            />
            <div className="flex items-center gap-x-2 md:gap-x-4">
              <AuthFormInput
                form={form}
                fieldName="firstName"
                label="First name"
                disabled={isLoading}
                forceFullWidth
                isOptional
              />
              <AuthFormInput
                form={form}
                fieldName="lastName"
                label="Last name"
                disabled={isLoading}
                forceFullWidth
                isOptional
              />
            </div>
            <AuthFormInput
              form={form}
              fieldName="phone"
              label="Phone number"
              disabled={isLoading}
              isOptional
            />
            <AuthFormInput
              form={form}
              fieldName="password"
              label="Password"
              type="password"
              disabled={isLoading}
              isPasswordShown={isPasswordShown}
              setIsPasswordShown={setIsPasswordShown}
            />
            <AuthFormInput
              form={form}
              type="password"
              fieldName="confirmPassword"
              label="Confirm password"
              disabled={isLoading}
            />
            <div>
              <Button
                variant="cta"
                type="submit"
                disabled={isLoading}
                className="text font-hfont mt-6 w-full transition focus:scale-[0.98]"
              >
                Register & Sign in
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  )
}
