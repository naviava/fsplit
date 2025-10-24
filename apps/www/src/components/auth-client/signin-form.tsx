import { useCallback, useMemo, useState } from 'react'

import { Link, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader } from 'lucide-react'
import type z from 'zod'

import { loginFormSchema } from '@fsplit/types/zod'
import { authClient } from '@/lib/auth-client'
import Env from '@/lib/env'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface IProps {
  disabled: boolean
}

export function SigninForm({ disabled }: IProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const isLoading = useMemo(
    () => isNavigating || disabled,
    [isNavigating, disabled],
  )

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof loginFormSchema>) => {
      setIsNavigating(true)
      const { data, error } = await authClient.signIn.email({
        ...values,
        callbackURL: `${Env.WEB_URL}/groups`,
      })
      if (!!error || !data?.user) {
        setIsNavigating(false)
        toast({
          title: 'Sign in failed',
          description:
            'Invalid credentials or email not verified. Check your email for verification link.',
        })
        return
      }
      router.invalidate()
    },
    [router],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hfont font-semibold">
                Email address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="yourname@email.com"
                  disabled={isLoading}
                  {...field}
                  className="auth-form-input placeholder:text-neutral-400"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-hfont font-semibold">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={isPasswordShown ? 'text' : 'password'}
                    placeholder="******"
                    disabled={isLoading}
                    {...field}
                    className="auth-form-input pr-16 placeholder:text-neutral-400"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={isLoading}
                    onClick={() => setIsPasswordShown((prev) => !prev)}
                    className="absolute top-1/2 right-0 -translate-y-1/2 text-neutral-400 hover:bg-transparent hover:text-neutral-500"
                  >
                    {isPasswordShown ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            asChild
            type="button"
            size="sm"
            variant="link"
            disabled={isLoading}
            className="-mt-4 text-neutral-500"
          >
            <Link to="/forgot-password">Forgot password?</Link>
          </Button>
        </div>
        <Button
          variant="cta"
          type="submit"
          disabled={isLoading}
          className="text font-hfont w-full transition focus:scale-[0.98]"
        >
          {isNavigating ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  )
}
