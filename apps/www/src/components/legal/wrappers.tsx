import { cn } from '@/lib/utils'

interface IPageWrapperProps {
  children: React.ReactNode
  className?: string
}

interface ISectionWrapperProps {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className }: IPageWrapperProps) {
  return (
    <article
      className={cn(
        'mx-auto mt-10 flex max-w-[980px] flex-col gap-y-10 px-4 pb-24 md:mt-14 md:px-10 lg:mt-[4.5rem] lg:gap-y-12 font-archivo',
        className,
      )}
    >
      {children}
    </article>
  )
}

export function SectionWrapper({ children, className }: ISectionWrapperProps) {
  return <div className={cn('space-y-8', className)}>{children}</div>
}
