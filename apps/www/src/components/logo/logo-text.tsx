import { cn } from '@/lib/utils'

interface IProps {
  className?: string
  dark?: boolean
}

export function LogoText({ className, dark }: IProps) {
  return (
    <h1
      className={cn(
        'ml-2 font-bold text-neutral-600 font-logo',
        dark && 'text-neutral-400',
        className,
      )}
    >
      <span className={cn('text-cta', dark && 'text-white')}>FS</span>plit
    </h1>
  )
}
