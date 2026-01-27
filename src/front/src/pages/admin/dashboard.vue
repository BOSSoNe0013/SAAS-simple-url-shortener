<script setup lang="ts">
import { computed } from "vue";

import ShortUrlForm from "./ShortUrlForm.vue";

const view = computed(() => {
    return ShortUrlForm
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
