<!--
* @Component: 
* @Maintainer: J.K. Yang
* @Description: 
-->
<script setup lang="ts">
import configs from "@/configs";
import MainMenu from "~/components/navigation/MainMenu.vue";
// import { Icon } from "@iconify/vue";
const customizeTheme = useCustomizeThemeStore();
const navigation = ref(configs.navigation);


onMounted(() => {
  scrollToBottom();
});

const scrollToBottom = () => {
  const contentArea = document.querySelector(".v-navigation-drawer__content");
  const activeItem = document.querySelector(
    ".v-list-item--active"
  ) as HTMLElement;

  setTimeout(() => {
    contentArea?.scrollTo({
      top: activeItem?.offsetTop,
    });
  }, 100);
};
//微信客服
const service=()=>{
  const service_url=useGlobalConfig.APP.pages.service_url
  window.open(service_url)
}
</script>

<template>
  <v-navigation-drawer :rail="customizeTheme.miniSidebar" elevation="1" v-model="customizeTheme.mainSidebar" id="mainMenu">
    <!-- ---------------------------------------------- -->
    <!---Top Area -->
    <!-- ---------------------------------------------- -->
    <template v-if="!customizeTheme.miniSidebar" v-slot:prepend>
      <v-card
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px 25px 15px -20px"
        height="100"
        class="d-flex align-center justify-center"
      >
        <img
          v-if="customizeTheme.darkTheme"
          width="200"
          :src="useGlobalConfig.APP.pages.sidebar_logo_dark"
          alt=""
        />
        <img
          v-else
          width="200"
          :src="useGlobalConfig.APP.pages.sidebar_logo_light"
          alt=""
        />
      </v-card>
      <v-divider/>
    </template>

    <!-- ---------------------------------------------- -->
    <!---Nav List -->
    <!-- ---------------------------------------------- -->

    <main-menu :menu="navigation.menu"/>
    
    <!-- ---------------------------------------------- -->
    <!---Bottom Area -->
    <!-- ---------------------------------------------- -->
    <template v-if="!customizeTheme.miniSidebar" v-slot:append>
      <v-card
        theme="dark"
        height="225"
        class="pa-3"
        variant="text"
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px -25px 15px -20px"
      >
        <v-card
          class="d-flex flex-column gradient pa-2"
          color="primary"
          :class="customizeTheme.primaryColor.colorName"
          height="200"
        >
          <v-card-title>
            <v-btn
              class="mr-1"
              size="20"
              color="white"
              :class="`text-${customizeTheme.primaryColor.colorName}`"
              icon
            >
            </v-btn>
            博璀 AI
          </v-card-title>
          <v-card-subtitle>专注AI落地为创作赋能</v-card-subtitle>
          <v-card-text>
            <div><b>官网</b></div>
            <div>
              <a :href="useGlobalConfig.APP.pages.homepage_url">{{ useGlobalConfig.APP.pages.homepage_url }}</a>
              </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="white"
              block
              prepend-icon="mdi-face-agent"
              variant="elevated"
              @click="service"
            >
              联系我们
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>

<style scoped lang="scss"></style>
