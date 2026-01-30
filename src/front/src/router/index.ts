import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/auth";
const AdminLogin = () =>
  import(/* webpackChunkName: "login" */ "../pages/admin/login.vue");
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "../pages/admin/dashboard.vue");
const ShortCode = () =>
  import(/* webpackChunkName: "shortcode" */ "../pages/shortcode.vue");

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
  {
    path: "/:shortcode",
    name: "ShortCode",
    component: ShortCode,
    props: true,
    meta: { allowAnonymous: true, requireAdmin: false },
  },
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
    console.log(to.fullPath, to.name);
    next();
  }
});

export default router;
