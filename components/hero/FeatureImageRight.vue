<!--图片显示在右侧的功能展示-->
<script setup lang="ts">
</script>

<template>

  <v-sheet width="100%" elevation="0" class="mx-auto landing-warpper text-left" rounded>
    <v-sheet
        elevation="0"
        color="transparent"
        max-width="1600 "
        class="mx-auto my-10"
    >
      <v-row no-gutters align="stretch">
        <v-col cols="12" md="6">
          <v-card
              elevation="0"
              height="100%"
              class="mx-auto pa-10 pa-md-15 d-flex flex-column justify-center"
          >
            <div>
              <RouterLink to="/" class="text-primary font-weight-bold"
              >跟我们一起
              </RouterLink
              >
              <h1 class="font-weight-black text-h3 mt-5 mb-10">
                享受AI大语言模型带来的
                <span class="text-primary">效率革命</span>
              </h1>
              <p class="my-2">官方API接入各大大语言模型库，原版提供100+应用模版，即开即用</p>
              <P class="my-2">内置100+应用场景模版,涵盖日常
                <span class="text-primary font-weight-black">写作、文案、营销、开发、自媒体创作等</span>
              </P>
              <P class="my-2">支持自定义应用提示词模版，后期还将建立和完善提示词社区，分享自己的提示词</P>
              <P class="my-2">
                <span class="text-primary font-weight-black">终身免费！</span>AI基础能力终身免费，让每个人都平等享受AI的红利
              </P>
              <v-btn variant="outlined" size="large" class="text-white mt-10"
              >Get In Touch
              </v-btn
              >
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card height="100%">
            <v-carousel cycle hide-delimiters show-arrows="hover">
              <v-carousel-item
                  src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/llm_banner_1.jpg"
                  cover
              ></v-carousel-item>

              <v-carousel-item
                  src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/llm_banner_2.jpg"
                  cover
              ></v-carousel-item>
            </v-carousel>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
