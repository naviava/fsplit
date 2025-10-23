import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { MainBannerHeading } from './main-banner-heading'
import { ArrowRight } from 'lucide-react'

export function MainBanner() {
  return (
    <div className="mt-16 flex flex-col items-center md:flex-row xl:mt-0 font-archivo">
      <MainBannerHeading className="md:hidden" />
      <div className="relative aspect-square w-full flex-1">
        <img
          src="/images/wide-phone-banner.png"
          alt="Welcome to FSplit"
          className="object-cover transition-all duration-700"
        />
      </div>
      <div className="flex-1 space-y-10">
        <MainBannerHeading className="hidden md:block" />
        <p className="mx-auto hidden pl-1 text-center text-gray-500 md:block md:max-w-[70%] md:text-left md:text-lg lg:text-xl">
          FSplit makes it easy to track expenses, split bills, and get paid back
          by your friends and family.
        </p>
        <div className="mx-auto pl-1 md:max-w-[70%]">
          <Button
            asChild
            variant="cta"
            className="w-full rounded-full px-8 md:w-fit font-hfont"
          >
            <Link to="/signin">
              Explore the app
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
