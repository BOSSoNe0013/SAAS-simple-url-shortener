<script lang="ts" setup>
import useAPI from '../../api';
import { TableColumn } from "@nuxt/ui";
import type { TableMeta, Row } from '@tanstack/vue-table'
import { ShortUrl, useShortUrlsStore } from "../../store/shortUrls";
import ShortUrlCard from "../../components/ShortUrlCard.vue";
import { computed, ref } from 'vue';

const api = useAPI();
const toast = useToast();
const store = useShortUrlsStore();
store.fetchAll();
const loading = ref<string>();

const selectedUrl = ref<ShortUrl | null>(null);
const showStatModal = ref(false);
const urlToDelete = ref<ShortUrl | null>(null);
const showDeleteModal = ref(false);

const openStat = (url: ShortUrl) => {
  selectedUrl.value = url;
  showStatModal.value = true;
}

const deleteUrl = (url: ShortUrl) => {
  urlToDelete.value = url;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
    showDeleteModal.value = false;
    if(!urlToDelete.value) return;
    const url = urlToDelete.value;
    loading.value = url.id;
    try {
        const res = await api.deleteShortURL(url.code);
        if(res?.data.success) {
            const idx = store.urls.findIndex(u => url.id === u.id);
            if(idx) {
                store.urls.splice(idx, 1);
            }
            toast.add({
                title: "Short URL removed!",
                icon: "i-lucide-trash",
            });
        }
    } catch(err) {

    } finally {
        loading.value = undefined;
    }
};

const columns: TableColumn<ShortUrl>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => `${row.getValue("code")}`,
    meta: {
      class: {
        td: "w-36",
      },
    },
  },
  {
    accessorKey: "targetUrl",
    header: "Target URL",
    cell: ({ row }) => `${row.getValue("targetUrl")}`,
    meta: {
      class: {
        td: "max-w-64 text-ellipsis overflow-hidden",
      },
    },
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }) => `${row.getValue("clicks")}`,
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires at",
    cell: ({ row }) => {
      const expiresAt: string = row.getValue("expiresAt");
      if (!expiresAt || !expiresAt.length) return "Never";
      return new Date(expiresAt).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    id: "actions",
  },
];

const meta: TableMeta<ShortUrl> = {
    class: {
        tr: (row: Row<ShortUrl>) => {
            if(row.original.id === loading.value) {
                return 'opacity-25';
            }
            return '';
        }
    }
};

const error = ref("");
const handleCopy = async (code: string) => {
  error.value = "";
  const shortURL = `${import.meta.env.VITE_FRONTEND_URL}/${code}`;
  try {
    await navigator.clipboard.writeText(shortURL);
    toast.add({
      title: "Short URL copied!",
      icon: "i-lucide-clipboard",
    });
  } catch (e: any) {
    error.value = "Failed to copy";
  }
};

const isLoading = computed<boolean>(() => {
  return store.loading || typeof loading.value !== 'undefined';
});
</script>

<template>
<  <UPage>
    <UPageHeader title="Manage my short URLs" />
    <UPageBody>
      <UTable :data="store.list" :columns="columns" class="flex-1" :loading="isLoading" :meta="meta" >
        <template #code-cell="{ row }">
          <div class="flex gap-2 items-center w-24 justify-between">
            <span class="grow">{{ row.original.code }}</span>
            <UButton
              variant="ghost"
              @click="handleCopy(row.original.code)"
              icon="i-lucide-clipboard"
              class="hover:cursor-pointer"
            />
          </div>
        </template>
        <template #targetUrl-cell="{ row }">
          <UTooltip :text="row.original.targetUrl">
            <span>{{ row.original.targetUrl }}</span>
          </UTooltip>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2 justify-end">
            <UButton
              name="stats"
              variant="ghost"
              icon="i-lucide-chart-line"
              class="hover:cursor-pointer"
              :disabled="row.original.id === loading"
              @click="openStat(row.original)"
            />
            <UButton
              name="delete"
              variant="ghost"
              icon="i-lucide-trash"
              class="hover:cursor-pointer"
              color="error"
              :disabled="row.original.id === loading"
              @click="deleteUrl(row.original)"
            />
          </div>
        </template>
      </UTable>
    </UPageBody>

    <UModal
        :title="selectedUrl?.code" 
        :open="showStatModal" 
        :close="{ onClick: () => {showStatModal = false} }"
    >
        <template #body>
            <ShortUrlCard v-if="selectedUrl" :url="selectedUrl" />
        </template>
    </UModal>
    <UModal
        :title="'Delete URL: ' + (urlToDelete?.code ?? '')"
        :open="showDeleteModal"
        :close="{ onClick: () => { showDeleteModal = false } }"
    >
        <template #body>
            <p>Are you sure you want to delete <strong>{{ urlToDelete?.code }}</strong>?</p>
            <div class="flex gap-2 mt-4 justify-end">
            <UButton label="Cancel" @click="showDeleteModal = false" />
            <UButton color="error" label="Delete" @click="confirmDelete" />
            </div>
        </template>
    </UModal>
  </UPage>
</template>
