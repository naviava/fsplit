import type { Dispatch, SetStateAction } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface IProps {
  form: UseFormReturn<{
    displayName: string
    email: string
    password: string
    confirmPassword: string
    firstName?: string | undefined
    lastName?: string | undefined
    phone?: string | undefined
  }>
  fieldName:
    | 'displayName'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'firstName'
    | 'lastName'
    | 'phone'
  type?: string
  label?: string
  disabled?: boolean
  isOptional?: boolean
  placeholder?: string
  description?: string
  hideErrors?: boolean
  forceFullWidth?: boolean
  isPasswordShown?: boolean
  setIsPasswordShown?: Dispatch<SetStateAction<boolean>>
}

export function AuthFormInput({
  form,
  label,
  disabled,
  fieldName,
  isOptional,
  hideErrors,
  placeholder,
  description,
  type = 'text',
  forceFullWidth,
  isPasswordShown,
  setIsPasswordShown,
}: IProps) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn(forceFullWidth && 'w-full')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FormLabel className="font-hfont text-xs font-semibold md:text-sm">
                {label}
                {isOptional && (
                  <span className="ml-1 text-[11px] font-normal italic md:text-xs">
                    (optional)
                  </span>
                )}
              </FormLabel>
            </div>
            {!hideErrors && (
              <FormMessage className="text-xs italic md:text-sm" />
            )}
          </div>
          <FormControl>
            <div className="relative">
              <Input
                type={
                  !setIsPasswordShown
                    ? type
                    : isPasswordShown
                      ? 'text'
                      : 'password'
                }
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className="auth-form-input placeholder:text-neutral-400"
              />
              {!!setIsPasswordShown && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPasswordShown((prev) => !prev)}
                  className="absolute top-1/2 right-0 -translate-y-1/2 text-neutral-400 hover:bg-transparent hover:text-neutral-500"
                >
                  {isPasswordShown ? <EyeOff /> : <Eye />}
                </Button>
              )}
            </div>
          </FormControl>
          {!!description && (
            <FormDescription className="text-xs text-neutral-500/90 italic md:text-sm">
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  )
}
