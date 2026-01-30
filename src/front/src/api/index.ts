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
    try {
      return await api.get("/auth/logout");
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      return await api.put("/admin/change-password", {
        oldPassword,
        newPassword,
      });
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function createShortURL(payload: {
    targetUrl: string;
    expiry?: string;
  }) {
    try {
      return await api.post("/admin/short-urls", payload);
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function getShortURLs() {
    try {
      return await api.get("/admin/short-urls");
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function getShortURL(id: string) {
    try {
      return await api.get(`/admin/short-urls/${id}`);
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function deleteShortURL(id: string) {
    try {
      return await api.delete(`/admin/short-urls/${id}`);
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  }
  async function getRedirectURL(code: string): Promise<string | undefined> {
    try {
      const resp = await api.get(`/tg/${code}`);
      if (resp.status === 200) return resp.data;
    } catch (error) {
      console.error("Error:", error);
      return;
    }
  };
  return {
    login,
    logout,
    createShortURL,
    getShortURL,
    getShortURLs,
    deleteShortURL,
    getRedirectURL,
    changePassword,
  };
};

export default useAPI;
