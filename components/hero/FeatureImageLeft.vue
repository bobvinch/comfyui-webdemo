<!--图片显示在右侧的功能展示-->
<script setup lang="ts">

const url="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/txt2img_liyunsi.jpg"
</script>

<template>
  <v-sheet
      elevation="0"
      class="mx-auto landing-warpper text-left"
      color="#F2F5F8"
      rounded
      width="100%"
  >
    <v-row no-gutters align="stretch">

      <v-col cols="12" md="6">
        <v-card height="100%">
          <v-img
              height="100%"
              cover
              :src="url"
          ></v-img>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card
            theme="dark"
            elevation="0"
            height="100%"
            class="mx-auto pa-10 pa-md-15 d-flex flex-column justify-center"
        >
          <div>
            <RouterLink to="/" class="text-primary font-weight-bold"
            >与我们一起
            </RouterLink
            >
            <h1 class="font-weight-black text-h3 mt-5 mb-10">
              用AI探索多媒体创作的
              <span class="text-primary">无尽创意</span>
            </h1>
            <p>
              私有化行业模型
              针对电商、多媒体创作进行针对性调优，协同大模型工具的文案和提示词功能
              <span class="text-primary font-weight-black">用AI自己驱动AI</span>
            </p>

            <v-btn variant="outlined" size="large" class="text-white mt-10" to="/ai/draw"
            >免费体验
            </v-btn
            >
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
