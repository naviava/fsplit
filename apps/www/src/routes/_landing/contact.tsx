import { ContactForm } from '@/components/forms/contact-form'
import { LandingLayoutWrapper } from '@/components/global/landing-layout-wrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <LandingLayoutWrapper className="justify-start px-0 py-0">
      <div className="h-[20vh] w-full bg-neutral-200" />
      <div className="mx-auto flex w-full max-w-screen-xl -translate-y-28 items-center px-4 lg:gap-x-6">
        <div className="mx-auto w-full max-w-lg rounded-md border-2 border-neutral-300 bg-[#F4F4F4] p-10 shadow-lg xl:p-14">
          <ContactForm />
        </div>
        <div className="relative hidden aspect-square lg:block lg:w-full lg:flex-1">
          <img src="/images/contact-us.svg" alt="Contact us" />
        </div>
      </div>
    </LandingLayoutWrapper>
  )
}
