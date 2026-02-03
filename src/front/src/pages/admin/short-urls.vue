<UModal
  :title=""Delete URL: " + (urlToDelete?.value?.code ?? "")"
  :open="showDeleteModal"
  :close="{ onClick: () => { showDeleteModal = false } }"
>
  <template #body>
    <p>Are you sure you want to delete <strong>{{ urlToDelete?.value?.code }}</strong>?</p>
    <div class="flex gap-2 mt-4 justify-end">
      <UButton label="Cancel" @click="showDeleteModal = false" />
      <UButton color="error" label="Delete" @click="confirmDelete" />
    </div>
  </template>
</UModal>