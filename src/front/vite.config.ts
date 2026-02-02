import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import ui from '@nuxt/ui/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import EnvCaster from "@niku/vite-env-caster";
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env'});

export default defineConfig(({mode}) => {
  //const root = fileURLToPath(new URL('../../', import.meta.url));
  return {
    plugins: [
      EnvCaster({}),
      vue(), 
      vueJsx(),
      ui(),
      devtoolsJson({
        projectRoot: './src',
      }),
    ],
    base: "/",
    root: './src',
    envDir: '../../',
    server: {
      allowedHosts: [
        'short.b1project.com'
      ],
      host: '0.0.0.0',
      port: process.env.NODE_ENV === 'development' ? parseInt(process.env.FRONTEND_PORT ?? '80') : 80,
      proxy: {
        "/api/v1": {
          target: process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT ?? '5601'}/` : process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? '5601'}/`,
          changeOrigin: true,
          rewrite : (path) => path.replace(/^\/api\/v1/, '')
        },
      },
      fs: {
        allow: ["src"],
        strict: false,
      },
    },
    preview: {
      port: 5602,
    },
  }
});
