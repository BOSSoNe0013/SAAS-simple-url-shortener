<script setup lang="ts">
import { NavigationMenuItem } from "@nuxt/ui";
import { computed, ref } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useAuthStore } from "./store/auth";

const route = useRoute();
const auth = useAuthStore();

const pages: {
  page: 'short-url'|'short-urls'|'account',
  icon: string,
  label: string,
}[] = [
  {
    page: 'short-url',
    label: 'New short URL',
    icon: 'i-lucide-link'
  },
  {
    page:'short-urls',
    label: 'My Short URLs',
    icon: 'i-lucide-list'
  },
  {
    page:'account',
    label: 'My account',
    icon: 'i-lucide-user'
  }
];
const page = ref<'short-url'|'short-urls'|'account'>('short-url');
</script>

<template>
  <UApp v-if="route.path.startsWith('/admin')" class="h-full">
    <UHeader 
      title="B1Shortener Admin" 
      class="static" 
      to="/admin" 
      toggle-side="left" 
      mode="slideover"
      :ui="{
        container: 'max-w-full',
        overlay: 'bg-secondary-950/25',
        toggle: auth.isAuthenticated ? '' : 'hidden'
      }"
    >
      <template #right>
        <UColorModeButton />
        <UButton v-if="auth.isAuthenticated" to="/admin/logout" icon="i-lucide-log-out" variant="outline" />
      </template>
      <template #body>
        <UNavigationMenu orientation="vertical" class="-mx-2.5" :items="pages">
        </UNavigationMenu>
      </template>
    </UHeader>
    <UMain class="min-h-full">
      <UContainer class="px-0 sm:px-0 lg:px-0 h-full max-w-full">
        <router-view />
      </UContainer>
    </UMain>
  </UApp>
  <UApp v-else>

  </UApp>
</template>

