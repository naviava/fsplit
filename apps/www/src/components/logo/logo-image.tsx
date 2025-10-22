import { cn } from '@/lib/utils'

interface IProps {
  className?: string
}

export function LogoImage({ className }: IProps) {
  return (
    <div className={cn('relative aspect-square', className)}>
      <img src="/images/logo.png" alt="FSplit Logo" className="object-cover" />
    </div>
  )
}
