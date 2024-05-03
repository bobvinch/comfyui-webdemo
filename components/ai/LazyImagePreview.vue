<!--
* @Component:
* @Maintainer: 
* @Description: 图片预览组件
-->
<script setup lang="ts">

import ImageCardVue from "./ImageCard.vue";
const sdStore = useStableDiffusionStore();

onMounted(() => {
  //检验socket连接状态
  resetHandlestatus()
})
const resetHandlestatus = () => {
  sdStore.ouputimgList.forEach(item => {
    item.onhandleprocess = false
  })
}

</script>

<template>
  <v-card class="h-full">
          <v-card-title> 我的图库 </v-card-title>
          <ImageCardVue :imgs="sdStore.getShowList" :cols_default="12" :cols_md="6"/>
        </v-card>
</template>

<style scoped lang="scss"></style>
