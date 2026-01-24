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
    resolve: {
      alias: {
        "@": './src',
      },
    },
    server: {
      allowedHosts: [
        'short.b1project.com'
      ],
      host: '0.0.0.0',
      port: process.env.PORT,
      proxy: {
        "/api/v1": {
          target: `http://localhost:${parseInt(process.env.PORT ?? '5600') + 1}/`,
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
      port: parseInt(process.env.PORT ?? '5600') + 2,
    },
  }
});
