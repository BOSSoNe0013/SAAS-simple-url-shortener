<script lang="ts" setup>
import { TableColumn } from '@nuxt/ui';
import { useAuthStore } from '../../store/auth';
import { onMounted, reactive, ref } from 'vue';

type Item = {
    id: string,
    code: string,
    targetUrl: string,
    createdAt: Date,
    expiresAt: Date,
    clicks: number
}

const data = reactive<Item[]>([]);
const auth = useAuthStore();
const toast = useToast();

const getUrls = async() => {
    const res = await fetch('/api/v1/admin/short-urls', {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.token}`
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    items.forEach((item: any) => {
        data.push({
            id: item.id,
            code: item.code,
            targetUrl: item.targetUrl,
            createdAt: item.createdAt,
            expiresAt: item.expiresAt,
            clicks: item.clicks
        });
    });
};

const columns: TableColumn<Item>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => `${row.getValue('code')}`,
        meta: {
            class: {
                td: 'w-36'
            }
        }
    },
    {
        accessorKey: 'targetUrl',
        header: 'Target URL',
        cell: ({ row }) => `${row.getValue('targetUrl')}`,
        meta: {
            class: {
                td: 'max-w-64 text-ellipsis overflow-hidden'
            }
        }
    },
    {
        accessorKey: 'clicks',
        header: 'Clicks',
        cell: ({ row }) => `${row.getValue('clicks')}`
    },
    {
        accessorKey: 'createdAt',
        header: 'Created at',
        cell: ({ row }) => {
            return new Date(row.getValue('createdAt')).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    {
        accessorKey: 'expiresAt',
        header: 'Expires at',
        cell: ({ row }) => {
            const expiresAt: string = row.getValue('expiresAt');
            if(!expiresAt || !expiresAt.length) return 'Never';
            return new Date(expiresAt).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
        }
    },
    {
        id: 'actions'
    },

];

const error = ref("");
async function handleCopy(code: string) {
  error.value = "";
  const shortURL = `${import.meta.env.VITE_FRONTEND_URL}/${code}`
  try {
    await navigator.clipboard.writeText(shortURL);
    toast.add({
        title: 'Short URL copied!',
        icon: 'i-lucide-clipboard'
    })
  } catch (e: any) {
    error.value = "Failed to copy";
  }
}

onMounted(async () => {
    await getUrls();
});
</script>

<template>
    <UPage>
        <UPageHeader 
            title="Manage my short URLs"
        />
        <UPageBody>
            <UTable :data="data" :columns="columns" class="flex-1">
                <template #code-cell="{ row }">
                    <div class="flex gap-2 items-center w-24 justify-between">
                        <span class="grow">{{ row.original.code }}</span>
                        <UButton variant="ghost" @click="handleCopy(row.original.code)" icon="i-lucide-clipboard" class="hover:cursor-pointer" />
                    </div>
                </template>
                <template #targetUrl-cell="{ row }">
                    <UTooltip :text="row.original.targetUrl">
                        <span>{{ row.original.targetUrl }}</span>
                    </UTooltip>
                </template>
                <template #actions-cell="{ row }">
                    <div class="flex gap-2 justify-end">
                        <UButton variant="ghost" icon="i-lucide-chart-line" class="hover:cursor-pointer"/>
                        <UButton variant="ghost" icon="i-lucide-trash" class="hover:cursor-pointer" color="error"/>
                    </div>
                </template>
            </UTable>
        </UPageBody>
    </UPage>
</template>