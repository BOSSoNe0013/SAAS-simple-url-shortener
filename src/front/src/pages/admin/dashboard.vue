<script setup lang="ts">
import { computed } from "vue";

import ShortUrlPage from "./short-url.vue";

const view = computed(() => {
    return ShortUrlPage
})
</script>

<template>
  <UDashboardGroup class="static">
    <UDashboardSidebar collapsible />
    <UDashboardPanel>
        <template #body>
            <component :is="view" />
        </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
