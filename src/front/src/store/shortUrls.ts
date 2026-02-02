import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import useAPI from "../api";


export interface ClickRecord {
  id: string;
  ipAddress: string;
  timestamp: string;
}
export interface ShortUrl {
  id: string;
  code: string;
  targetUrl: string;
  expiry?: string;
  clicks?: number;
  createdAt?: string;
  clickRecords?: ClickRecord[];
}
const api = useAPI();

export const useShortUrlsStore = defineStore("shortUrls", () => {
  const urls: Ref<ShortUrl[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.getShortURLs();
      if (!res || res.status !== 200) throw new Error(`HTTP ${res?.status ?? 500}`);
      urls.value = res.data.map((item: any) => ({
        id: item.id,
        code: item.code,
        targetUrl: item.targetUrl,
        expiry: item.expiry,
        clicks: item.clicks,
        createdAt: item.createdAt,
        clickRecords: item.clickRecords,
      }));
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const create = async (payload: { targetUrl: string; expiry?: string }) => {
    try {
      const res = await api.createShortURL(payload);
      if (!res || res.status !== 201) throw new Error(`HTTP ${res?.status ?? 500}`);
      const newUrl: ShortUrl = {
        id: res.data.id,
        code: res.data.code,
        targetUrl: payload.targetUrl,
        expiry: payload.expiry,
        clicks: 0,
      };
      urls.value.push(newUrl);
      return newUrl;
    } catch (e: any) {
      throw e;
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await api.deleteShortURL(id);
      if (!res || res.status !== 200) throw new Error(`HTTP ${res?.status ?? 500}`);
      urls.value = urls.value.filter((u) => u.id !== id);
    } catch (e: any) {
      throw e;
    }
  };

  const getById = (id: string) => urls.value.find((u) => u.id === id);

  const list = computed(() => urls.value.slice());

  return {
    urls,
    loading,
    error,
    fetchAll,
    create,
    remove,
    getById,
    list,
  };
});
