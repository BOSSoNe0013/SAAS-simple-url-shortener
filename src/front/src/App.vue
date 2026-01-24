<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <UApp>
    <UPage>
      <UHeader title="B1Shortener Admin" />
      <router-view />
    </UPage>
  </UApp>
</template>

