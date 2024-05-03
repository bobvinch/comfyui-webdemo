<script setup lang="ts">


import ImageToImage from "~/components/ai/ImageToImage.vue";
import ImagePreview from "~/components/ai/LazyImagePreview.vue";

const sdStore = useStableDiffusionStore()
const {aimodelParams:DrawParams,imageParam_aimodel:uploadfile} = storeToRefs(sdStore)

onMounted(() => {
socketInit()
});
definePageMeta({
  //布局
  layout: 'landing-layout',
  validate: async (route: any) => {
    return true
  }
})

</script>

<template>
  <v-container class="h-full">
    <v-row class="h-full">
      <v-col cols="12" md="6">
        <v-card class="h-full">
          <client-only>
            <ImageToImage :show-denoise="false" api="AImodel_api" img_1_desc="上传人台模特照获得更好模特效果" :show-clothtype="true" v-model:DrawParams="DrawParams" v-model:uploadfile="uploadfile"/>
          </client-only>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <!-- 进度条
        <v-progress-linear :model-value="sdStore.progress" bg-color="primary-lighten-3"
          color="primary-lighten-1"></v-progress-linear> -->
        <ImagePreview/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
