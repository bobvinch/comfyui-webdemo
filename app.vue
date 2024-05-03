<template>
  <!--    <NuxtWelcome />-->


  <VApp :theme="customizeTheme.darkTheme ? 'dark' : 'light'">
    <NuxtLayout>
      <NuxtPage></NuxtPage>
      <!-- 定义样式 -->

      <customization-menu/>
      <!-- 返回顶部 -->
      <back-to-top/>
      <snackbar/>
    </NuxtLayout>
  </VApp>


</template>
<script setup lang="ts">
import BackToTop from "~/components/common/BackToTop.vue";
import Snackbar from "~/components/common/Snackbar.vue";
import CustomizationMenu from "~/components/CustomizationMenu.vue";

const customizeTheme = useCustomizeThemeStore();
</script>