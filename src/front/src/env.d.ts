declare module "app-env" {
  interface ENV {
    VITE_APP_NAME: string;
    VITE_DOMAIN: string;
    VITE_FRONTEND_URL: string;
  }

  const appEnv: ENV;
  export default appEnv;
}
