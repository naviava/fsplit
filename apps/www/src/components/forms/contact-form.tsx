import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Loader } from 'lucide-react'
import { contactUsSchema } from '@fsplit/types/zod'
import { useContactForm } from '@/hooks/tsrq/use-misc'

export function FormHeader() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2 }}
      className="relative aspect-square w-10 md:w-12 lg:w-14"
    >
      <img src="/images/mailbox.svg" alt="Drop us a line" />
    </motion.div>
  )
}

export function ContactForm() {
  const { newEntryMutation } = useContactForm()
  const form = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = useCallback(
    (values: z.infer<typeof contactUsSchema>) => {
      newEntryMutation.mutate(values)
    },
    [newEntryMutation],
  )

  useEffect(() => {
    if (newEntryMutation.isSuccess) {
      form.reset()
    }
  }, [newEntryMutation.isSuccess, form])

  return (
    <>
      <div className="flex items-center">
        <FormHeader />
        <h1 className="ml-4 text-2xl font-semibold md:text-3xl lg:text-4xl">
          Drop us a line
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 space-y-8"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="tracking-wide text-neutral-600 lg:text-base">
                    Full Name
                  </FormLabel>
                  <FormMessage className="text-xs lg:text-sm" />
                </div>
                <FormControl>
                  <Input
                    placeholder="What's your full name?"
                    disabled={newEntryMutation.isPending}
                    {...field}
                    className="placeholder:text-neutral-400 lg:text-base"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="tracking-wide text-neutral-600 lg:text-base">
                    Email address
                  </FormLabel>
                  <FormMessage className="text-xs lg:text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="yourname@example.com"
                    disabled={newEntryMutation.isPending}
                    {...field}
                    className="placeholder:text-neutral-400 lg:text-base"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="tracking-wide text-neutral-600 lg:text-base">
                    Message
                  </FormLabel>
                  <FormMessage className="text-xs lg:text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    disabled={newEntryMutation.isPending}
                    placeholder="Write your message here..."
                    {...field}
                    className="h-[10rem] resize-none placeholder:text-neutral-400 lg:text-base"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            variant="cta"
            disabled={newEntryMutation.isPending}
            className="w-full tracking-wide lg:text-lg"
          >
            {newEntryMutation.isPending ? (
              <Loader className="h-5 w-5 animate-spin md:h-6 lg:w-6" />
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
