<script setup lang="ts">
import { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useAuthStore } from "./store/auth";

const route = useRoute();
const auth = useAuthStore();
</script>

<template>
  <UApp v-if="route.path.startsWith('/admin')">
    <UHeader 
      title="B1Shortener Admin" 
      class="static" 
      to="/admin" 
      toggle-side="left" 
      mode="slideover"
      :ui="{
        toggle: 'hidden'
      }"
    >
      <template #right>
        <UColorModeButton />
        <UButton v-if="auth.isAuthenticated" to="/admin/logout" icon="i-lucide-log-out" variant="outline" />
      </template>
    </UHeader>
    <UMain>
      <UContainer>
        <router-view />
      </UContainer>
    </UMain>
  </UApp>
  <UApp v-else>

  </UApp>
</template>

