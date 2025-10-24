import { nanoid } from '@fsplit/utils'
// import { RiTwitterXFill } from 'react-icons/ri'
// import { FaFacebook } from 'react-icons/fa6'
import { FaDiscord } from 'react-icons/fa6'
import { SiGithub } from 'react-icons/si'
import { FcGoogle } from 'react-icons/fc'
import { useAuthForm } from '@/store/use-auth-form'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { SocialAuthButton } from './social-auth-button'
import { RegisterForm } from './register-form'

const OPTIONS = [
  // {
  //   id: nanoid(),
  //   icon: FaFacebook,
  //   provider: "facebook",
  //   fill: "#1877f2",
  // },
  // {
  //   id: nanoid(),
  //   icon: RiTwitterXFill,
  //   provider: "twitter",
  //   fill: "#000",
  // },
  {
    id: nanoid(),
    icon: FaDiscord,
    provider: 'discord',
    fill: '#7289da',
  },
  {
    id: nanoid(),
    icon: SiGithub,
    provider: 'github',
    fill: '#333',
  },
  {
    id: nanoid(),
    icon: FcGoogle,
    provider: 'google',
  },
]

export function AuthClient() {
  const { formType, toggleType } = useAuthForm()
  const [disabled, setDisabled] = useState(false)

  return (
    <div className="z-[2] flex w-full max-w-[30rem] flex-col items-center rounded-[2rem] bg-black/10 p-8 backdrop-blur-md">
      {/* {formType === 'signin' && <SigninForm disabled={disabled} />} */}
      {formType === 'register' && <RegisterForm disabled={disabled} />}
      <div className="mt-8 text-center">
        {formType === 'signin' && (
          <>
            <div className="flex items-center justify-center gap-x-2">
              <div className="h-[2px] w-16 rounded-full bg-black/20" />
              <span className="font-hfont text-sm font-medium">
                Or sign in with
              </span>
              <div className="h-[2px] w-16 rounded-full bg-black/20" />
            </div>
            <div className="mt-4 flex items-center justify-center gap-x-4">
              {OPTIONS.map((option) => (
                <SocialAuthButton
                  key={option.id}
                  {...option}
                  disabled={disabled}
                  setDisabled={setDisabled}
                />
              ))}
            </div>
          </>
        )}
        <div
          className={cn(
            '-mt-2 flex items-center justify-center',
            formType === 'signin' && 'mt-6',
          )}
        >
          <span className="text-sm">
            {formType === 'signin'
              ? 'Are you new?'
              : 'Already have an account?'}
          </span>
          <Button size="sm" variant="link" onClick={toggleType}>
            {formType === 'signin' ? 'Create an account' : 'Login'}
          </Button>
        </div>
      </div>
    </div>
  )
}
