class Env {
  static PORT: number = parseInt(process.env.PORT as string);
  static WEB_URL: string = process.env.WEB_URL as string;
  static BETTER_AUTH_SECRET: string = process.env.BETTER_AUTH_SECRET as string;
}

export default Env;
