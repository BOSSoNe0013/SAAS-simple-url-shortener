import axios from "axios";
import { useAuthStore } from "../store/auth";

const api = axios.create({
  baseURL: "/api/v1", // relative base
});

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  const token = auth.token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore();
      auth.logout();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

const useAPI = () => {
  async function login(username: string, password: string) {
    return await api.post("/auth/login", { username, password });
  }
  async function logout() {
    return await api.post("/auth/logout");
  }
  async function createShortURL(payload: {targetUrl: string, expiry?: string}) {
    return await api.post("/admin/short-urls", payload);
  }
  async function getShortURLs() {
    return await api.get("/admin/short-urls");
  }
  async function getShortURL(id: string) {
    return await api.get(`/admin/short-urls/${id}`);
  }
  async function deleteShortURL(id: string) {
    return await api.delete(`/admin/short-urls/${id}`);
  }
  return {
    login,
    logout,
    createShortURL,
    getShortURL,
    getShortURLs,
    deleteShortURL,
  };
};

export default useAPI;
