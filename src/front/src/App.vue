<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "./store/auth";
import useAPI from "./api";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const api = useAPI();

const menuOpenState = ref<boolean>(false);
const pages: Ref<{
  page: 'short-url'|'short-urls'|'account',
  icon: string,
  label: string,
}[]> = computed(() =>{
  if (!auth.isAuthenticated) return [];
  return [
    {
      page: 'short-url',
      label: 'New short URL',
      icon: 'i-lucide-link',
      onSelect: () => {
        page.value = 'short-url';
        menuOpenState.value = false;
      }
    },
    {
      page:'short-urls',
      label: 'My Short URLs',
      icon: 'i-lucide-list',
      onSelect: () => {
        page.value = 'short-urls';
        menuOpenState.value = false;
      }
    },
    {
      page:'account',
      label: 'My account',
      icon: 'i-lucide-user',
      onSelect: () => {
        page.value = 'account';
        menuOpenState.value = false;
      }
    }
  ];
});
const page = ref<'short-url'|'short-urls'|'account'>('short-url');

const logout = async () => {
  await api.logout();
  auth.logout();
  router.push({ name: 'AdminLogin'});
};
</script>

<template>
  <UApp v-if="route.path.startsWith('/admin')" class="h-full">
    <UHeader 
      title="B1Shortener Admin" 
      class="static" 
      to="/admin" 
      toggle-side="left" 
      mode="slideover" 
      v-model:open="menuOpenState"
      :ui="{
        container: 'max-w-full',
        overlay: 'bg-secondary-950/25',
        toggle: auth.isAuthenticated ? '' : 'hidden'
      }"
    >
      <template #right>
        <UColorModeButton />
        <UButton v-if="auth.isAuthenticated" @click="logout" icon="i-lucide-log-out" variant="outline" />
      </template>
      <template #body>
        <UNavigationMenu orientation="vertical" class="-mx-2.5" :items="pages">
        </UNavigationMenu>
      </template>
    </UHeader>
    <UMain class="min-h-full">
      <UContainer class="px-0 sm:px-0 lg:px-0 h-full max-w-full">
        <router-view v-model="page"/>
      </UContainer>
    </UMain>
  </UApp>
  <UApp v-else>

  </UApp>
</template>

