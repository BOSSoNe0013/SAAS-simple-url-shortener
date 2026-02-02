<script lang="ts" setup>
import { computed } from "vue";
import { ShortUrl } from "../store/shortUrls";
import { VisXYContainer, VisStackedBar, VisAxis } from "@unovis/vue";

const props = defineProps<{
  url: ShortUrl;
}>();

const chartData = computed(():{timestamp: number, count: number}[] => {
  if (!props.url.clickRecords) return [];
  // map to {timestamp:number, count:number} with cumulative count
  return props.url.clickRecords.map((r, i) => {
    const day = r.timestamp.split('T')[0];
    return { timestamp: new Date(`${day}T00:00:00.000Z`).getTime(), count: i + 1 }
  });
});
const x = (d: {timestamp: number, count: number}) =>  d.timestamp;
const y = (d: {timestamp: number, count: number}) =>  d.count;
const xTickFormat = (d: {timestamp: number, count: number}) => Intl.DateTimeFormat().format(d.timestamp);
//const maxValue = chartData.value.reduce((max, item) => Math.max(max, item.count), 0);

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
  <UCard class="p-4 max-w-4xl mx-auto rounded-lg shadow">
    <div
      class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col gap-1">
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
      <div class="flex flex-col bg-elevated rounded p-2">
        <div class="font-medium text-center">Clicks</div>
        <div class="text-center content-center text-4xl font-bold grow text-primary">{{ props.url.clicks ?? 0 }}</div>
      </div>
      <div class="flex flex-col bg-elevated rounded p-2">
        <div class="font-medium text-center">Created</div>
        <div class="text-center content-center font-bold grow text-primary">
          {{
            props.url.createdAt
              ? new Date(props.url.createdAt).toLocaleString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour12: false,
              })
              : "N/A"
          }}
        </div>
      </div>
      <div class="flex flex-col bg-elevated rounded p-2">
        <div class="font-medium text-center">Expires on</div>
        <div class="text-center content-center font-bold grow text-primary">
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
    <div class="mt-4">
      <VisXYContainer 
        :data="chartData" 
        :height="320"
      >
        <VisStackedBar 
          :x="x" 
          :y="y" 
          :data="chartData" 
        />
        <VisAxis type="x" :tickFormat="xTickFormat" />
        <VisAxis type="y" />
      </VisXYContainer>
    </div>
  </UCard>
</template>
