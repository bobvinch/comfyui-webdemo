<script setup lang="ts">
const customizeTheme = useCustomizeThemeStore()
const data = useGlobalConfig.APP.pages.loginSliders

</script>
<template>
  <div class="d-flex text-center flex-grow-1">

    <VCard color="primary" class="layout-side  d-none d-md-flex flex-column justify-space-between">

      <!--主页logo-->
      <VCard style="background-color: transparent;" height="100" class="d-flex align-center justify-center mt-10">
        <img width="280"  :src="useGlobalConfig.APP.pages.login_logo" alt=""/>
      </VCard>
      <!-- <div class="mt-3 mt-md-10 pa-2">
        <div class="text-white text-h4 font-weight-bold">
          博璀AI助手
        </div>
        <div class="title my-2">
          让我陪您一起探索AI世界的奇妙
        </div>
      </div> -->

      <!-- 网站信息 -->
      <v-container>
        <v-row v-for="(item, index) in data" :key="index" dense align="center" justify="center">
          <v-col cols="12">
            <VCard width="280" class="mx-auto" theme="dark" style="background-color: transparent;" :title="item.title">
              <template v-slot:prepend>
                <v-icon :icon="item.icon" color="white"></v-icon>
              </template>
              <!-- <VCard-text style="text-align: left;">{{ item.subtitle }}</VCard-text> -->
            </VCard>
          </v-col>
        </v-row>
      </v-container>
      <v-divider></v-divider>
      <!-- 微信公众号/视频号 -->
      <v-container class="mt-0 pt-0" align-center>
        <v-label class="mb-2">官方微信公众号/视频号</v-label>
        <v-img class="mx-auto" width="200"
               :src="useGlobalConfig.APP.pages.wechat_official_url">
        </v-img>

      </v-container>

    </VCard>
    <VCard variant="outlined" class="flex-grow-1 d-flex align-center justify-center flex-column">
      <div class="layout-content ma-auto w-full">
        <slot/>
      </div>
      <div class="pa-5"> {{ useGlobalConfig.APP.pages.login_slogn }}</div>
    </VCard>
  </div>
</template>

<style lang="scss" scoped>
.layout-side {
  width: 420px;
}

.layout-content {
  max-width: 480px;
}
</style>
