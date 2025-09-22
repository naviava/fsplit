import { createAuthClient } from 'better-auth/react'
import Env from './env'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: Env.WEB_URL,
})
