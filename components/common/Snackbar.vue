<script setup lang="ts">
import { useSnackbarStore } from "@/stores/snackbarStore";
const snackbarStore = useSnackbarStore();

const getIcon = (type:string) => {
  const icon:any = {
    info: "mdi-information",
    success: "mdi-check-circle",
    error: "mdi-alert-circle",
    warning: "mdi-alert",
  };

  return icon[type];
};
</script>
<template>
  <div>
    <v-snackbar
      v-model="snackbarStore.isShow"
      :timeout="snackbarStore.timeout"
      :color="snackbarStore.type"
      class="elevation-10"
      location="top"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ getIcon(snackbarStore.type) }}</v-icon>
        <span> {{ snackbarStore.message }}</span>
      </div>

      <template v-slot:actions>
        <v-btn icon variant="text" :disabled="snackbarStore.timeout===-1?true:false" @click="snackbarStore.isShow = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
