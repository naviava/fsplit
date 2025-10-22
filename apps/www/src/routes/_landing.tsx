import { Footer } from '@/components/landing-page/footer'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_landing')({
  component: LandingLayout,
})

function LandingLayout() {
  return (
    <div className="w-full bg-[#F4F4F4]">
      {/* <LandingPageNavbar /> */}
      <Outlet />
      <Footer />
    </div>
  )
}
