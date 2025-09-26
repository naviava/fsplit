import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import Env from '@/lib/env'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const [registerDetails, setRegisterDetails] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  })

  const { data: session } = authClient.useSession()

  async function register({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }) {
    if (!name || !email || !password)
      return alert('Please fill all register fields')

    const { data, error } = await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onError: (ctx) => {
          alert(ctx.error.message)
        },
      },
    )
    console.log(data)
  }

  async function login({
    email,
    password,
  }: {
    email: string
    password: string
  }) {
    if (!email || !password) return alert('Please fill all login fields')
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    })
  }

  async function socialLogin(provider: 'github' | 'google') {
    await authClient.signIn.social({
      provider,
      callbackURL: Env.WEB_URL,
    })
  }

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      {/* Register */}
      {!session ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              register({
                name: registerDetails.name,
                email: registerDetails.email,
                password: registerDetails.password,
              })
            }}
            className="flex flex-col gap-4"
          >
            <h2>Register</h2>
            <input
              type="text"
              value={registerDetails.name}
              onChange={(e) =>
                setRegisterDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="bg-white text-black"
            />
            <input
              type="text"
              value={registerDetails.email}
              onChange={(e) =>
                setRegisterDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="bg-white text-black"
            />
            <input
              type="text"
              value={registerDetails.password}
              onChange={(e) =>
                setRegisterDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="bg-white text-black"
            />
            <div className="flex gap-2">
              <button type="button" className="bg-white text-black flex-1">
                Reset
              </button>
              <button type="submit" className="bg-white text-black flex-1">
                Register
              </button>
            </div>
          </form>

          {/* Sign in */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              login({
                email: loginDetails.email,
                password: loginDetails.password,
              })
            }}
            className="mt-10 flex flex-col gap-4"
          >
            <h2>Sign in</h2>
            <input
              type="text"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="bg-white text-black"
            />
            <input
              type="text"
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="bg-white text-black"
            />
            <button type="submit" className="bg-white text-black">
              Sign in
            </button>
            <button
              type="button"
              onClick={() => socialLogin('github')}
              className="bg-white text-black"
            >
              Sign in with GitHub
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>Current user: {session.user.name}</h1>
          <button onClick={() => authClient.signOut()}>Sign out</button>
        </>
      )}
    </main>
  )
}
