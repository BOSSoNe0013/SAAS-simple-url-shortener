<script lang="ts" setup>
import { computed } from "vue";
import { ShortUrl } from "../store/shortUrls";

const props = defineProps<{
  url: ShortUrl;
}>();

const shortURL = computed(
  () => `${import.meta.env.VITE_FRONTEND_URL}/${props.url.code}`,
);

const toast = useToast();

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(shortURL.value);
    toast.add({
      title: "Short URL copied!",
      icon: "i-lucide-clipboard",
    });
  } catch (e) {
    console.error(e);
    toast.add({
      title: "Failed to copy",
      icon: "i-lucide-x-circle",
      color: "error",
    });
  }
};
</script>

<template>
  <UCard class="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow">
    <div
      class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col gap-1">
        <h3 class="text-lg font-semibold">{{ props.url.code }}</h3>
        <p class="text-sm text-muted-foreground">
          <span class="font-medium">Target URL: </span>
          <span class="break-all">{{ props.url.targetUrl }}</span>
        </p>
      </div>
      <UButton
        class="mt-2 sm:mt-0"
        icon="i-lucide-clipboard"
        @click="handleCopy"
      />
    </div>
    <hr class="my-3" />
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      <div>
        <div class="font-medium">Clicks</div>
        <div>{{ props.url.clicks ?? 0 }}</div>
      </div>
      <div>
        <div class="font-medium">Created At</div>
        <div>
          {{
            props.url.createdAt
              ? new Date(props.url.createdAt).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "N/A"
          }}
        </div>
      </div>
      <div>
        <div class="font-medium">Expires At</div>
        <div>
          {{
            props.url.expiry
              ? new Date(props.url.expiry).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Never"
          }}
        </div>
      </div>
    </div>
    <hr class="my-3" />
    <div class="flex justify-end gap-2">
      <UButton variant="ghost" icon="i-lucide-chart-line" />
      <UButton variant="ghost" icon="i-lucide-trash" color="error" />
    </div>
  </UCard>
</template>

<style scoped>
.text-muted-foreground {
  color: #6b7280;
}
</style>
