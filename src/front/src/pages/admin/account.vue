<script lang="ts" setup>
import { ref } from "vue";
import useAPI from "../../api";

const api = useAPI();
const toast = useToast();

const oldPassword = ref("");
const newPassword = ref("");
const newPasswordVerification = ref("");

async function onSubmit() {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordPattern.test(newPassword.value)) {
    toast.add({
      title:
        "Password must be at least 8 characters, include uppercase, lowercase, and number",
      icon: "i-lucide-alert-circle",
      color: "warning",
    });
    return;
  }
  if (newPassword.value !== newPasswordVerification.value) {
    toast.add({
      title: "Password verification does not match",
      icon: "i-lucide-alert-circle",
      color: "warning",
    });
    return;
  }
  try {
    await api.changePassword(oldPassword.value, newPassword.value);
    toast.add({
        title: "Password changed successfully",
        icon: 'i-lucide-key-round'
    });
  } catch (err) {
    console.error(err);
    toast.add({
        title: "Failed to change password",
        icon: 'i-lucide-key-round',
        color: 'error'
    });
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <UCard class="px-4 py-6">
        <h2 class="text-lg font-semibold mb-4">Change Password</h2>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div>
            <label>Old Password</label>
            <UInput
              type="password"
              v-model="oldPassword"
              class="mt-1 block w-full border rounded"
              required
            />
          </div>
          <div>
            <label>New Password</label>
            <UInput
              type="password"
              v-model="newPassword"
              class="mt-1 block w-full border rounded"
              required
            />
          </div>
          <div>
            <label>New Password verification</label>
            <UInput
              type="password"
              v-model="newPasswordVerification"
              class="mt-1 block w-full border rounded"
              required
            />
          </div>
          <UBtton type="submit" class="px-4 py-2 bg-primary text-white rounded">
            Submit
          </UBtton>
        </form>
      </UCard>
    </UPageBody>
  </UPage>
</template>
