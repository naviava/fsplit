class Env {
  static SERVER_URL: string = process.env.SERVER_URL as string
  static WEB_URL: string = process.env.WEB_URL as string
  static SOCKET_SERVER_URL = process.env.SOCKET_SERVER_URL as string
  static BETTER_AUTH_URL: string = process.env.NEXTAUTH_URL as string
}

export default Env
