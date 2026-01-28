<script lang="ts" setup>
import { useAuthStore } from "../store/auth";
import { computed, ref } from "vue";

const targetUrl = ref("");
const expiry = ref("");
const code = ref("");
const shortURL = computed(() => {
  return `${import.meta.env.VITE_FRONTEND_URL}/${code.value}`;
});
const error = ref("");
const success = ref("");
const auth = useAuthStore();

async function handleSubmit() {
  success.value = "";
  error.value = "";
  try {
    const payload: any = { targetUrl: targetUrl.value };
    if (expiry.value) payload.expiry = new Date(expiry.value).toISOString();
    const res = await fetch("/api/v1/admin/short-urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    code.value = data.code;
  } catch (err: any) {
    error.value = err.message;
  }
}

async function handleCopy() {
  success.value = "";
  error.value = "";
  try {
    await navigator.clipboard.writeText(shortURL.value);
    success.value = "Copied!";
  } catch (e: any) {
    error.value = "Failed to copy";
  }
}
</script>

<template>
  <UCard class="text-center">
    <UForm
      @submit.prevent="handleSubmit"
      class="flex flex-col gap-4 items-center"
    >
      <div class="w-full">
        <UFormField
          label="Target URL:"
          :ui="{
            labelWrapper: 'grow-0 justify-center',
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
              base: 'text-2xl',
            }"
          />
        </UFormField>
      </div>
      <div>
        <UFormField
          label="Expiry (ISO string, optional):"
          :ui="{
            labelWrapper: 'grow-0 justify-center',
          }"
        >
          <UInput id="expiry" v-model="expiry" type="datetime-local" />
        </UFormField>
      </div>
      <UButton type="submit">Create Short URL</UButton>
    </UForm>
    <div v-if="code" class="mt-2">
      New short URL: {{ shortURL
      }}<UButton class="ml-2 hover:cursor-pointer" @click="handleCopy" icon="i-lucide-clipboard" />
    </div>
    <div v-if="error" style="color: red">Error: {{ error }}</div>
    <div v-if="success" style="color: green">{{ success }}</div>
  </UCard>
</template>
