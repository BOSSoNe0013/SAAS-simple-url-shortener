import "./index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from 'vue-router'
import ui from '@nuxt/ui/vue-plugin';
import App from "./App.vue";

async function bootstrap() {
    const app = createApp(App);
    const router = createRouter({
    routes: [],
    history: createWebHistory()
    })
    app.use(createPinia());
    app.use(router);
    app.use(ui);
    app.mount("#app");
}
bootstrap();
