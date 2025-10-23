import { CTABanner } from '@/components/landing-page/cta-banner'
import { KeyFeatures } from '@/components/landing-page/key-features'
import { MainBanner } from '@/components/landing-page/main-banner'
import { Quote } from '@/components/landing-page/quote'
import { WhyFSplit } from '@/components/landing-page/why-fsplit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/')({
  head: () => ({
    meta: [
      { title: 'FSplit' },
      {
        name: 'description',
        content:
          'FSplit: Effortless group expense management made easy, fast, and secure. Split expenses with friends, family, and roommates.',
      },
    ],
  }),
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <MainBanner />
      <KeyFeatures />
      <WhyFSplit />
      <CTABanner />
      <Quote />
    </>
  )
}
