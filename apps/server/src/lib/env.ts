class Env {
  static PORT: number = parseInt(process.env.PORT as string);
  static WEB_URL: string = process.env.WEB_URL as string;
  static BETTER_AUTH_SECRET: string = process.env.BETTER_AUTH_SECRET as string;
  static GITHUB_CLIENT_ID: string = process.env.GITHUB_CLIENT_ID as string;
  static GITHUB_CLIENT_SECRET: string = process.env
    .GITHUB_CLIENT_SECRET as string;
  static RESEND_API_KEY: string = process.env.RESEND_API_KEY as string;
}

export default Env;
