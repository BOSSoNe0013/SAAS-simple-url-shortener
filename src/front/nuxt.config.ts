
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["@/index.css"],
  ui: {
    icons: { sets: { heroicons: {}, lucide: {} } },
  },
  build: {
    transpile: [],
  },
});
