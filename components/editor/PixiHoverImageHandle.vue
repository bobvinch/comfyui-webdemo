<script setup lang="ts">

const Config = defineModel({
  default: {
    show: false,//默认不显示
    positionX: 0,
    positionY: 0
  }
})

</script>

<template>
  <!--    <v-slider style="position: absolute;top: 100px;left: 100px;z-index: 999" min="0" max="1" v-model="scale"></v-slider>-->
  <!--    <v-slider  min="0" max="1" step="0.1" v-model="hoverImageConfig.scale"></v-slider>-->
  <v-sheet color="primary" rounded v-show="Config.show"
           :style="`position: absolute;top: ${Config.positionY}px;left: ${Config.positionX}px;z-index: 999;width: 400px;`"
           style="display: flex;background: transparent;">
    <!--AI相似图-->
    <v-btn bordered color="white" variant="text" icon="mdi-content-copy" @click="usePixiSelectToImage"></v-btn>

    <v-btn bordered color="white" variant="text" icon="mdi-magnify-expand" @click="usePixiRemoveBg"></v-btn>
    <v-btn bordered color="white" variant="text" icon="mdi-high-definition" @click="usePixiHdfix"></v-btn>
    <v-btn bordered color="white" variant="text" icon="mdi-delete" @click="usePixiRemoveSelect"></v-btn>

  </v-sheet>

</template>

<style scoped lang="scss">

</style>