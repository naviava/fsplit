import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/toaster'

export const Route = createRootRoute({
  component: () => {
    return (
      <Providers>
        <HeadContent />
        <Outlet />
        <Toaster />
        <TanstackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </Providers>
    )
  },
})
