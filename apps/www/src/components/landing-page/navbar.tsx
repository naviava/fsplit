import { useMemo } from 'react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Link, useLocation } from '@tanstack/react-router'
import { Logo } from '../logo'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

export function LandingPageNavbar() {
  const { pathname } = useLocation()
  const { data: session } = authClient.useSession()
  const isLoggedIn = useMemo(
    () => !!session && !!session.user && !!session.user.email,
    [session],
  )

  return (
    <div className={cn('w-full', pathname === '/contact' && 'bg-neutral-200')}>
      <header
        className={cn(
          'mx-auto flex h-14 max-w-screen-xl items-center px-4 pt-6 lg:px-6',
          pathname === '/contact' && 'bg-neutral-200',
        )}
      >
        <Link to="/" className="flex items-center justify-center">
          <Logo className={cn(pathname === '/contact' && 'z-[1]')} />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button
            asChild
            size="sm"
            variant="ctaGhost"
            className="rounded-full bg-[#F5F5F5] px-1.5 font-semibold font-hfont"
          >
            <Link
              to="/signin"
              className="flex items-center bg-transparent text-xs font-medium underline-offset-4 hover:underline md:text-sm lg:text-base xl:text-lg"
            >
              {isLoggedIn ? 'Open app' : 'Get started for free'}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
    </div>
  )
}
