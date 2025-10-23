import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { nanoid } from '@fsplit/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

const ENTRIES = [
  {
    id: nanoid(),
    icon: '/images/why-fsplit-1.svg',
    title: 'User-Friendly Interface',
    description:
      'FSplit is designed with simplicity in mind. Our intuitive interface ensures you can manage your group expenses without any hassle.',
  },
  {
    id: nanoid(),
    icon: '/images/why-fsplit-2.svg',
    title: 'Secure and Reliable',
    description:
      'We take your privacy seriously. FSplit uses end-to-end encryption to ensure your data is safe and secure.',
  },
  {
    id: nanoid(),
    icon: '/images/why-fsplit-3.svg',
    title: 'Anytime, Anywhere',
    description:
      "FSplit is available on all platforms. Whether you're on iOS, Android, or the web, you can access your group expenses anytime, anywhere.",
  },
]

export function WhyFSplit() {
  const { data: session } = authClient.useSession()
  const [activeIndex, setActiveIndex] = useState(0)
  const isLoggedIn = useMemo(
    () => !!session && !!session.user && !!session.user.email,
    [session],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev === ENTRIES.length - 1) {
          return 0
        }
        return prev + 1
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-52  overflow-x-hidden font-archivo">
      <h2 className="lg:leading-tighter mx-auto text-center text-3xl font-bold tracking-tighter sm:text-4xl md:max-w-[70%] md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
        Why <span className="text-cta">FS</span>plit?
      </h2>
      <div className="mx-auto flex flex-col md:mt-16 md:flex-row lg:mt-0 lg:items-center">
        <div className="relative aspect-square w-full flex-1 ">
          <img src="/images/tall-phone-banner.png" alt="FSPlit" />
        </div>
        <div className="mt-6 w-full flex-1">
          <ul className="mx-auto flex h-16 w-full max-w-[500px] items-center justify-between gap-x-4 px-12 md:mx-0">
            {ENTRIES.map((entry, idx) => {
              const isActive = activeIndex === idx
              return (
                <li
                  key={entry.id}
                  role="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'relative aspect-square w-10 transition-all duration-500 xl:w-14',
                    isActive && 'w-16 xl:w-[80px]',
                  )}
                >
                  <img src={entry.icon} alt={entry.title} />
                </li>
              )
            })}
          </ul>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ x: -100, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: 100,
                opacity: 0,
              }}
              transition={{ duration: 0.5 }}
              className="mt-10 p-4 xl:mt-16"
            >
              <h3 className="text-center text-2xl font-bold md:text-left lg:text-4xl xl:text-5xl">
                {ENTRIES[activeIndex]?.title}
              </h3>
              <p className="mx-auto mt-4 h-24 max-w-sm text-center text-neutral-500 md:mx-0 md:text-left lg:mt-8 xl:mt-12 xl:text-xl">
                {ENTRIES[activeIndex]?.description}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="px-4 xl:mt-12">
            <Button
              asChild
              variant="cta"
              className="w-full rounded-full md:w-[10rem] font-hfont"
            >
              <Link to="/signin">
                {isLoggedIn ? 'Open app' : 'Sign up'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
