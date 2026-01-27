import "./index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ui from '@nuxt/ui/vue-plugin';
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./store/auth";

async function bootstrap() {
    const app = createApp(App);
    app.use(createPinia());
    const authStore = useAuthStore();
    authStore.loadPersisted();
    app.provide('authStore', authStore);
    app.use(router);
    app.use(ui);
    app.mount("#app");
}
bootstrap();
