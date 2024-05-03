<script setup lang="ts">

const overlay=defineModel<boolean>()

const sdStore =useStableDiffusionStore()

</script>

<template>
  <div class="text-center">
    <v-overlay
        :model-value="overlay"
        class="align-center justify-center"
    >
      <v-progress-circular
          color="primary"
          size="64"
          indeterminate
      ></v-progress-circular>
      <p>AI绘画中</p>
    </v-overlay>
  </div>
</template>

<style scoped lang="scss">

</style>