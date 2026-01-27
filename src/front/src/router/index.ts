import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
import AdminLogin from "../pages/admin/login.vue";
import Dashboard from "../pages/admin/dashboard.vue";

const routes = [
  {
    path: "/admin/login",
    component: AdminLogin,
    name: "AdminLogin",
    meta: { requiresAuth: false },
  },
  {
    path: "/admin",
    component: Dashboard,
    name: "AdminDashboard",
    meta: { requiresAuth: true },
  },
  { path: "/", redirect: "/admin/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.fullPath.startsWith('/admin')) {
    const auth = useAuthStore();
    console.log(`Access token: ${auth.token}`);
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      next({ name: "AdminLogin" });
    } else if (!to.meta.requiresAuth && auth.isAuthenticated) {
      // If already logged in, skip login page
      next({ name: "AdminDashboard" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
