<script setup lang="ts">
import ImagePreview from "~/components/ai/LazyImagePreview.vue";

const sdStore=useStableDiffusionStore()
const {isGernateDisable,aistudioParams:DrawParams,imageParam_aistudio:uploadfile,imageParam2_aistudio:uploadfile2} = storeToRefs(sdStore)

definePageMeta({
  //布局
  layout: 'landing-layout',
  validate: async (route: any) => {
    return true
  }
})
onMounted(()=>{
  isGernateDisable.value=false
})

const imageGenerate = async () => {
  isGernateDisable.value=true
  const faceImage = await ComfyUI.uploadImageToOSS(uploadfile.value[0].originFileObj)
  const referImage = await ComfyUI.uploadImageToOSS(uploadfile2.value[0].originFileObj)
  if (faceImage && referImage) {
    //总生成步数计算进度百分比
    sdStore.totalSteps = 70
    sdStore.excutingApi = "AI写真"
    const output = await ComfyUI.faceswap({
      image_path_refer: referImage,
      image_path_face: faceImage
    })
    if (output) {
      sdStore.addImage(output)
    }
  }
  isGernateDisable.value=false
}



</script>

<template>
  <v-container class="h-full">
    <v-row class="h-full">
      <v-col cols="12" md="6">
        <v-card class="h-full">
          <ai-image-upload v-model:uploadfile="uploadfile" decription="脸部参考"></ai-image-upload>
          <ai-image-upload v-model:uploadfile="uploadfile2" decription="风格参考"></ai-image-upload>
          <!-- 生成按钮 -->
          <v-btn class="mt-2" size="x-large" color="primary" :loading="isGernateDisable"
                 :disabled="isGernateDisable"
                 block @click="imageGenerate">开始生成
            <template v-slot:loader>
              {{ sdStore.btnStatus }}
              <v-progress-circular
                  color="primary"
                  indeterminate
                  :model-value="sdStore.getProcess"></v-progress-circular>
            </template>
          </v-btn>
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
