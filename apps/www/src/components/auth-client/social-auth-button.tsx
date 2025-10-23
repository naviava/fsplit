import { useState, type Dispatch, type SetStateAction } from 'react'
import { type IconType } from 'react-icons'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import Env from '@/lib/env'

interface IProps {
  icon: IconType
  provider: string
  fill?: string
  disabled: boolean
  setDisabled: Dispatch<SetStateAction<boolean>>
}

export function SocialAuthButton({
  provider,
  fill,
  disabled,
  setDisabled,
  icon: Icon,
}: IProps) {
  const [clicked, setClicked] = useState(false)

  // TODO: Implement Google and Discord social logins.
  return (
    <Button
      disabled={disabled}
      onClick={async () => {
        setClicked(true)
        setDisabled(true)
        await authClient.signIn.social({
          provider,
          callbackURL: `${Env.WEB_URL}/groups`,
        })
      }}
      className="text-default h-auto rounded-full bg-white/50 p-3 hover:bg-white"
    >
      {clicked ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <Icon className="h-6 w-6" fill={fill} />
      )}
    </Button>
  )
}
