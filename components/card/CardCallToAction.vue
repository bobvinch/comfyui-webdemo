<!--全屏带行动按钮-->
<script setup lang="ts">
import {useHomeStore} from "~/stores/homeStore";

const homeStore=useHomeStore()
const showVideo=()=>{
  homeStore.showVideo=true
}

</script>

<template>

  <v-sheet
      width="100%"
      elevation="0"
      class="mx-auto landing-warpper text-left"
      rounded
  >
    <v-sheet
        elevation="0"
        color="transparent"
        max-width="1600 "
        class="mx-auto my-10"
    >
      <v-row no-gutters align="stretch">
        <v-col cols="12">
          <v-card
              elevation="0"
              height="100%"
              class="mx-auto pa-10 pa-md-15 d-flex flex-column justify-center"
          >
            <div>
              <RouterLink to="/" class="text-primary font-weight-bold"
              >我们立志成为</RouterLink
              >
              <h1 class="font-weight-black text-h3 mt-5 mb-10">
                属于每个大众的
                <span class="text-primary">人工智能</span>
              </h1>
              <p>
                在人工智能时代，让我们心怀感恩与敬畏，面对技术的浪潮，保持一颗温暖的心，一份虔诚的信念。让我们用智慧和善良引领人工智能的发展，让机器的思维与人类的温情共舞，让科技的进步与人类的情感共鸣。愿我们在这个数字化的世界中，保持一份真挚的情感，继续闪耀着人类的智慧光芒，让人工智能时代成为我们共同的美好时代。
              </p>
              <v-btn color="primary" size="large" class="mt-10" @click="showVideo"
              >>>使用教程<<</v-btn
              >
            </div>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card height="100%"> </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
