<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <UApp>
    <UPage>
      <UHeader title="B1Shortener Admin">
        <template #right>
          <UColorModeButton />
        </template>
      </UHeader>
      <router-view />
    </UPage>
  </UApp>
</template>

