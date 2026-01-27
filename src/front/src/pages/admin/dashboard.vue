<script setup lang="ts">
import { computed, ref } from "vue";

import ShortUrlPage from "./short-url.vue";
import ShortUrlsPage from "./short-urls.vue";
import AccountPage from "./account.vue";

const pages: {
  page: 'short-url'|'short-urls'|'account',
  icon: string,
  title: string,
}[] = [
  {
    page: 'short-url',
    title: 'New short URL',
    icon: 'i-lucide-link'
  },
  {
    page:'short-urls',
    title: 'My Short URLs',
    icon: 'i-lucide-list'
  },
  {
    page:'account',
    title: 'My account',
    icon: 'i-lucide-user'
  }
];
const page = ref<'short-url'|'short-urls'|'account'>('short-url');
const view = computed(() => {
  switch (page.value) {
    case 'account':
      return AccountPage;
    case 'short-urls':
      return ShortUrlsPage;  
    default:
      return ShortUrlPage
  }
});
</script>

<template>
  <UDashboardGroup class="static">
    <UDashboardSidebar collapsible class="h-full">
      <template #default="{ collapsed }">
        <ul class="flex flex-col gap-4 mx-0 px-0">
          <li v-for="p in pages">
            <UTooltip
              :text="p.title"
              :disabled="!collapsed"
            >
              <UButton
                :icon="p.icon"
                @click="page = p.page"
                variant="link"
                color="neutral"
                active-color="primary"
                active-variant="outline"
                class="flex items-center gap-2 px-3 py-2 w-full hover:cursor-pointer"
                :active="page === p.page"
              >
                <i class="fa-solid fa-chart-diagram"></i>
                <span :hidden="collapsed">{{ p.title }}</span>
              </UButton>
            </UTooltip>
          </li>
        </ul>
      </template>
    </UDashboardSidebar>
    <UDashboardPanel>
        <template #body>
            <component :is="view" />
        </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
