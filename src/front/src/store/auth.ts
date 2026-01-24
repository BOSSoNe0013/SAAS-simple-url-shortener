import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function setToken(t: string) {
    token.value = t;
    // Persist to localStorage for session recovery
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", t);
    }
  }

  function logout() {
    token.value = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  function loadPersisted() {
    if (typeof window !== "undefined") {
      const persisted = localStorage.getItem("authToken");
      if (persisted) token.value = persisted;
    }
  }

  return { token, isAuthenticated, setToken, logout, loadPersisted };
});
