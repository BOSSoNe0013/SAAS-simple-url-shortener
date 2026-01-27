<template>
  <UPage>
    <UPageHeader 
      title="Generate and Share Short URLs Easily"
      description="Enter the target URL and optional expiry. The system will generate a short code you can share with anyone."
      :ui="{
        root: 'border-0'
      }"
    />
    <UCard class="text-center">
      <UForm @submit.prevent="handleSubmit" class="flex flex-col gap-4 items-center">
        <div class="w-full">
          <UFormField 
            label="Target URL:"
            :ui="{
              labelWrapper: 'grow-0 justify-center'
            }"
            class="w-full"
          >
            <UInput 
              id="targetUrl" 
              v-model="targetUrl" 
              type="url" 
              required 
              class="text-2xl w-5/6" 
              size="xl"
              :ui="{
                base: 'text-2xl'
              }" 
            />
          </UFormField>
        </div>
        <div>
          <UFormField 
            label="Expiry (ISO string, optional):"
            :ui="{
              labelWrapper: 'grow-0 justify-center'
            }"
          >
            <UInput id="expiry" v-model="expiry" type="datetime-local" />
          </UFormField>
        </div>
        <UButton type="submit">Create Short URL</UButton>
      </UForm>
    </UCard>
    <div v-if="code" class="mt-2">New code: {{ code }}</div>
    <div v-if="error" style="color: red">Error: {{ error }}</div>
  </UPage>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const targetUrl = ref("");
const expiry = ref("");
const code = ref("");
const error = ref("");

async function handleSubmit() {
  error.value = "";
  try {
    const payload: any = { targetUrl: targetUrl.value };
    if (expiry.value) payload.expiry = new Date(expiry.value).toISOString();
    const res = await fetch("/admin/short-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    code.value = data.code;
  } catch (err: any) {
    error.value = err.message;
  }
}
</script>
