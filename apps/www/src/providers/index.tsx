import { RQProvider } from './rq-provider'

interface IProps {
  children: React.ReactNode
}

export function Providers({ children }: IProps) {
  return <RQProvider>{children}</RQProvider>
}
