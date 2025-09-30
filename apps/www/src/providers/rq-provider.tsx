import { useState } from 'react'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { QueryClientProvider } from '@tanstack/react-query'
import type { TRPCRouter } from '@fsplit/server/trpc'
import Env from '@/lib/env'
import { TRPCProvider, getQueryClient } from '@/lib/trpc'

interface IProps {
  children: React.ReactNode
}

export function RQProvider({ children }: IProps) {
  const queryClient = getQueryClient()
  const [trpcClient] = useState(() =>
    createTRPCClient<TRPCRouter>({
      links: [
        httpBatchLink({
          url: `${Env.SERVER_URL}/api`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            })
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}
