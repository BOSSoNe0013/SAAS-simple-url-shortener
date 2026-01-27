<script lang="ts" setup>
import { ref } from 'vue';

const data = ref([
  {
    code: '4600',
    url: 'https://www.toto.com',
    date: '2024-03-11T15:30:00',
    expire: '2024-03-11T15:30:00',
    clicks: 498,
  },
])
</script>

<template>
    <UPage>
        <UPageHeader />
        <UTable :data="data" class="flex-1" />
    </UPage>
</template>