class Env {
  static PORT: number = parseInt(process.env.PORT as string);
  static JWT_SECRET: string = process.env.JWT_SECRET as string;
}

export default Env;
