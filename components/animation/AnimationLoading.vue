<!--
* @Component: 
* @Maintainer: J.K. Yang
* @Description: 
-->
<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import loadingdata from "./Animation_data_loading.json"
const props = defineProps({
  size: {
    type: Number,
    default: 100,
  },
});
</script>

<template>
  <v-container >
    <v-row class="mt-30">
      <v-col class="mt-30">
        <Vue3Lottie
            animation-link="https://assets5.lottiefiles.com/packages/lf20_2ixzdfvy.json"
            :height="props.size"
            :width="props.size"
        />
      </v-col>
    </v-row>

  </v-container>

</template>

<style scoped lang="scss"></style>
