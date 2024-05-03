
<script setup lang="ts">

import ImageCard from "~/components/ai/ImageCard.vue";
import ImageWaterFall from "~/components/ai/ImageWaterFall.vue";
import ImageWaterFallDrawOutput from "~/components/ai/ImageWaterFallDrawOutput.vue";

const sdStore = useStableDiffusionStore();
definePageMeta({
  //布局
  layout: 'landing-layout',
  validate: async (route: any) => {
    return true
  }
})

</script>

<template>
  <v-container>
    <v-card>
      <v-card-title class="font-weight-bold">
        <span> 我的图集</span>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" prepend-icon="mdi-delete" @click="sdStore.deleteAll">删除全部</v-btn>
      </v-card-title>
      <v-divider />
      <image-water-fall-draw-output v-model="sdStore.ouputimgList"/>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss"></style>
