<script setup lang="ts">
import { useAuthStore } from "../../store/auth";
import { ref } from "vue";

const auth = useAuthStore();

// Load persisted token on init
if (!auth.isAuthenticated) auth.loadPersisted();

const username = ref("");
const password = ref("");

async function login() {
  try {
    const resp = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    if (!resp.ok) throw new Error("Login failed");
    const data = await resp.json();
    const jwt = resp.headers.get("Authorization"); // token returned in header
    if (jwt) auth.setToken(jwt);
    // Redirect to dashboard
    window.location.href = "/admin";
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <UPage class="flex flex-col items-center justify-center h-screen">
    <UCard class="w-full max-w-md p-4">
      <h2 class="text-xl font-bold mb-4">Admin Login</h2>
      <UInput v-model="username" label="Username" class="mb-4" />
      <UInput
        type="password"
        v-model="password"
        label="Password"
        class="mb-4"
      />
      <UButton color="primary" @click="login">Login</UButton>
    </UCard>
  </UPage>
</template>
