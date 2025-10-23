import { AuthClient } from '@/components/auth-client'
import { Logo } from '@/components/logo'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { useAuthForm } from '@/store/use-auth-form'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  head: () => ({
    meta: [
      { title: 'Sign In | FSplit' },
      {
        name: 'description',
        content:
          'Sign in to your FSplit account to manage your file splits and access exclusive features.',
      },
    ],
  }),
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()
    if (!!session && !!session.user) {
      throw redirect({ to: '/groups' })
    }
  },
  component: AuthPage,
})

function AuthPage() {
  const { formType } = useAuthForm()

  return (
    <div
      className="flex h-full flex-col bg-cover bg-left-top bg-no-repeat transition-all duration-500 md:bg-center"
      style={{
        backgroundImage: 'url(/images/auth-bg.jpg)',
      }}
    >
      <div className="flex h-full flex-col backdrop-blur-md">
        <div className="bg-black50 absolute inset-0 z-[1]" />
        <div className="flex-1">
          <div
            className={cn(
              'relative z-[2] flex h-full flex-col items-center justify-center px-4',
              formType === 'register' && 'py-4',
            )}
          >
            <Link to="/">
              <h1
                className={cn(
                  'mb-10',
                  formType === 'register' && 'hidden md:block',
                )}
              >
                <Logo className="tracking-wide" />
              </h1>
            </Link>
            <AuthClient />
          </div>
        </div>
      </div>
    </div>
  )
}
