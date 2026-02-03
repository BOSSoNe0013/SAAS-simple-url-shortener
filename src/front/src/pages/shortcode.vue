<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import useAPI from '../api';
import { useHead } from '@unhead/vue';

const api = useAPI();
const props = defineProps({
  shortcode: String,
});
const found = ref<boolean>(true);
useHead({
    title: 'Loading...'
});

onBeforeMount(async () => {
    console.log('Short code:', props.shortcode);
    if (props.shortcode) {
        const targetURL = await api.getRedirectURL(props.shortcode);
        console.log('Target URL:', targetURL);
        if (targetURL && 
            (targetURL.startsWith("http://") ||
            targetURL.startsWith("https://"))) {
                found.value = true;
                window.location.href = targetURL;
        } else {
            found.value = false;
        }
    } else {
        found.value = false;
    }
    if(!found.value) {
        useHead({
            title: '404 - Not found',
            titleTemplate: '%s %separator %siteName',
            templateParams: {
                separator: '·',
                siteName: import.meta.env.VITE_APP_NAME
            }
        });
    }
});
</script>
<template>
    <div class="flex flex-col grow">
        <div class="flex items-center justify-center bg-default grow flex-col p-16">
            <div v-if="found" class="flex flex-col justify-center items-center gap-16">
                <span class="text-2xl text-center">Loading...</span>
            </div>
            <div v-else class="flex flex-col justify-center items-center gap-16">
                <UIcon name="i-lucide-bug" class="size-16" />
                <span class="font-black text-8xl">404</span>
                <span class="text-2xl text-center">The requested page does not exist</span>
            </div>
        </div>
    </div>
</template>