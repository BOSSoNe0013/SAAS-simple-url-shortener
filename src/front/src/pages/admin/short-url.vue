<script setup lang="ts">
import ShortUrlForm from '../../components/ShortUrlForm.vue';

</script>

<template>
  <UPage>
    <UPageHeader 
      title="Generate and Share Short URLs Easily"
      description="Enter the target URL and optional expiry. The system will generate a short code you can share with anyone."
      :ui="{
        root: 'border-0'
      }"
    />
    <ShortUrlForm />
  </UPage>
</template>

