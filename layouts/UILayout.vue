<script setup lang="ts">
import MainAppbar from "~/components/toolbar/MainAppbar.vue";
import MainSidebar from "~/components/navigation/MainSidebar.vue";

const customizeTheme = useCustomizeThemeStore();

</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Main Sidebar -->
  <!-- ---------------------------------------------- -->
  <main-sidebar/>
  <!-- ---------------------------------------------- -->
  <!---Top AppBar -->
  <!-- ---------------------------------------------- -->
  <MainAppbar />
  <!-- ---------------------------------------------- -->
  <!---MainArea -->
  <!-- ---------------------------------------------- -->
  <v-main
      v-touch="{
      left: () => (customizeTheme.mainSidebar = false),
      right: () => (customizeTheme.mainSidebar = true),
    }"
      class="main-container"
  >
    <!-- <GlobalLoading /> -->

    <div class="d-none d-sm-block px-3">
      <PageTitle></PageTitle>
      <Breadcrumb></Breadcrumb>
    </div>

    <div class="flex-fill">
      <slot></slot>
    </div>
    <ToolBox />
  </v-main>
</template>

<style scoped>
.scrollnav {
  height: calc(100vh - 326px);
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
