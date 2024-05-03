<script setup lang="ts">
import MainSidebar from "~/components/navigation/MainSidebar.vue";
import MainAppbar from "~/components/toolbar/MainAppbar.vue";

const customizeTheme = useCustomizeThemeStore();

const isHideTopPadding = ref(false)

//动态清楚main 容器的上padding
const layoutInit = () => {
  if (process.client) {
    const width = window.innerWidth
    // console.log("@@@@@屏幕的宽度：" + width)
    if (width < 600) {
      isHideTopPadding.value = true
    } else {
      isHideTopPadding.value = false
    }
  }
}


onMounted(() => {

  // const ws=new WebsocketClient()
  // ws.Init()
  // const ws = new WebsocketClient()
  // ws.Init()
  layoutInit()
})
if (process.client) {
  window.onresize = () => {
    layoutInit()
  }
}


</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Main Sidebar 侧边导航栏 -->
  <!-- ---------------------------------------------- -->
  <main-sidebar/>
  <!-- ---------------------------------------------- -->
  <!---Top AppBar   顶部导航 -->
  <!-- ---------------------------------------------- -->
  <main-appbar/>
  <!-- ---------------------------------------------- -->
  <!---MainArea -->
  <!-- ---------------------------------------------- -->

  <v-main :class="isHideTopPadding?'main-container hideTopPadding':'main-container'" v-touch="{
    left: () => (customizeTheme.mainSidebar = false),
    right: () => (customizeTheme.mainSidebar = true),
  }">
    <!-- <GlobalLoading /> -->
    <!-- <ToolBox /> -->
    <div class="flex-fill">
      <slot/>
    </div>
  </v-main>
  <!--  <web-socket/>-->
</template>

<style scoped>
.scrollnav {
  height: calc(100vh - 326px);
}

.hideTopPadding {
  padding-top: 0;
}

.main-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
