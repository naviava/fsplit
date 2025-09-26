class Env {
  static SERVER_URL: string = import.meta.env.VITE_SERVER_URL as string
  static WEB_URL: string = import.meta.env.VITE_WEB_URL as string
  static SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL as string
  static BETTER_AUTH_URL: string = import.meta.env.BETTER_AUTH_URL as string
}

export default Env
