<script setup lang="ts">
import { useRouter } from "vue-router";
import useAPI from "../../api";
import { useAuthStore } from "../../store/auth";
import { ref } from "vue";

const auth = useAuthStore();
const api = useAPI();
const toast = useToast();
const router = useRouter();

// Load persisted token on init
if (!auth.isAuthenticated) auth.loadPersisted();

const username = ref("");
const password = ref("");

async function login() {
  let error = true;
  try {
    const resp = await api.login(username.value, password.value);
    if (!resp || resp.status !== 200 || !resp.headers.getAuthorization) throw new Error("Login failed");
    const jwt = resp.headers.getAuthorization(); // token returned in header
    if (jwt && jwt.length > 0){
      error = false;
      auth.setToken(jwt);
      toast.add({
          title: 'Logged in!',
          icon: 'i-lucide-user'
      });
      // Redirect to dashboard
      router.replace({
        name: 'AdminDashboard'
      });
      return;
    }
  } catch (err) {
    console.error(err);
  } finally {
    if(error) {
      toast.add({
          title: 'Login failed!',
          icon: 'i-lucide-user',
          color: 'error'
      });
    }
  }
}
</script>

<template>
  <UPage class="flex flex-col lg:flex">
    <UPageBody class="flex items-center justify-center">
      <UCard class="max-w-md p-4 mt-16 mx-8">
        <h2 class="text-xl font-bold mb-4">Admin Login</h2>
        <UInput v-model="username" label="Username" class="mb-4" />
        <UInput
          type="password"
          v-model="password"
          label="Password"
          class="mb-4 mr-2"
        />
        <UButton color="primary" @click="login">Login</UButton>
      </UCard>
    </UPageBody>
  </UPage>
</template>
