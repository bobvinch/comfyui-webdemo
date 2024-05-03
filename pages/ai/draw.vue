<script setup lang="ts">
import TextToImage from "~/components/ai/TextToImage.vue";
import ImageToImage from "~/components/ai/ImageToImage.vue";
import ImagePreview from "~/components/ai/LazyImagePreview.vue";
import LazyImagePreview from "~/components/ai/LazyImagePreview.vue";

const sdStore = useStableDiffusionStore()
const {txt2imgParams: DrawParams, img2imgParams: DrawParams2, imageParam_img2img: uploadfile} = storeToRefs(sdStore)
definePageMeta({
  //布局
  layout: 'landing-layout',
  validate: async (route: any) => {
    return true
  }
})

onMounted(() => {
  socketInit()
})

const panelTab = ref("textToImage");
</script>
<template>
  <v-container class="h-full">
    <v-row class="h-full">
      <v-col cols="12" md="6">
        <v-card class="h-full">
          <v-sheet width="100%">
            <v-tabs fixed-tabs v-model="panelTab" bg-color="primary">
              <v-tab value="textToImage">文生图</v-tab>
              <v-tab value="imgToImage">图生图</v-tab>
            </v-tabs>
          </v-sheet>
          <client-only>
              <v-sheet>
                <v-window v-model="panelTab">
                  <v-window-item value="textToImage">
                    <text-to-image v-model:DrawParams="DrawParams"/>
                  </v-window-item>

                  <v-window-item value="imgToImage">
                    <image-to-image api="img2img" v-model:DrawParams="DrawParams2"
                                    v-model:uploadfile="uploadfile"/>
                  </v-window-item>
                </v-window>
              </v-sheet>
          </client-only>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <!-- 进度条
        <v-progress-linear :model-value="sdStore.progress" bg-color="primary-lighten-3"
          color="primary-lighten-1"></v-progress-linear> -->
        <client-only>
          <LazyImagePreview/>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped lang="scss"></style>