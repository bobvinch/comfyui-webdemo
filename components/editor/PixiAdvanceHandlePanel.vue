<script setup lang="ts">

import {BlurFilter} from "pixi.js";
const {adjustmentFilter}=storeToRefs(usePixiStore())


</script>

<template>

  <perfect-scrollbar syle="height: 70vh">
    <v-container class="ma-0 pa-0">
      <v-sheet>
        <!--              滤镜-->
        <v-card-title class="text-subtitle-1 font-weight-bold">基本调色</v-card-title>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">透明度</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="1"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.alpha"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">亮度</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.brightness"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">对比度</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.contrast"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">饱和度</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.saturation"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">伽马</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.gamma"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">红色</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.red"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">绿色</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.green"
          ></v-slider>
        </v-sheet>
        <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
          <v-card-title class="text-caption font-weight-bold">蓝色</v-card-title>
          <v-slider thumb-size="15" hide-details="auto" density="compact" thumb-label="always" min="0" :max="5"
                    step="0.1"
                    color="primary" v-model="adjustmentFilter.blue"
          ></v-slider>
        </v-sheet>
      </v-sheet>
    </v-container>

  </perfect-scrollbar>


</template>

<style scoped lang="scss">

</style>