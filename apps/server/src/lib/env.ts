class Env {
  static PORT: number = parseInt(process.env.PORT as string);
  static WEB_URL: string = process.env.WEB_URL as string;
  static BETTER_AUTH_SECRET: string = process.env.BETTER_AUTH_SECRET as string;
  static GITHUB_CLIENT_ID: string = process.env.GITHUB_CLIENT_ID as string;
  static GITHUB_CLIENT_SECRET: string = process.env
    .GITHUB_CLIENT_SECRET as string;
}

export default Env;
