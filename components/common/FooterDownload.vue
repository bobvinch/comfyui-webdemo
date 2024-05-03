<!--页脚带下载路径-->
<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
const navs = [
  {
    title: "Product",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "Overview",
        to: "/",
      },
      {
        title: "Features",
        to: "/",
      },
      {
        title: "Pricing",
        to: "/",
      },
    ],
  },
  {
    title: "Resources",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "Documentation",
        to: "/",
      },
      {
        title: "News",
        to: "/",
      },
      {
        title: "FAQ",
        to: "/",
      },
      // Package
      {
        title: "Package",
        to: "/",
      },
      // Components
      {
        title: "Components",
        to: "/",
      },
    ],
  },
  {
    title: "Company",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "About us",
        to: "/",
      },
      {
        title: "Carrers",
        to: "/",
      },
      {
        title: "Press",
        to: "/",
      },
    ],
  },
];
</script>

<template>
  <v-sheet
      elevation="0"
      class="mx-auto landing-warpper"
      color="#F2F5F8"
      rounded
      width="100%"
  >
    <v-container class="text-left pa-10">
      <v-sheet
          class="mx-auto"
          color="transparent"
          elevation="0"
          max-width="1600"

      >
<!--        <v-row>-->
<!--          <v-col cols="12" md="3">-->
<!--            <img-->
<!--                class="my-2"-->
<!--                width="150"-->
<!--                src="@/assets/logo_light.svg"-->
<!--                alt=""-->
<!--            />-->
<!--            <p class="my-4">2000+ Our clients are subscribe Around the World</p>-->
<!--            <h6 class="font-weight-bold text-blue-grey my-2">Email</h6>-->
<!--            <p class="text-body-2 text-primary">-->
<!--              <a href="#">yjkbako@gmail.com</a>-->
<!--            </p>-->
<!--          </v-col>-->
<!--          <v-col cols="12" md="6">-->
<!--            <v-row justify="center">-->
<!--              <v-col cols="12" md="3" v-for="nav in navs">-->
<!--                <p class="text-h6 mb-4">-->
<!--                  <b>{{ nav.title }}</b>-->
<!--                </p>-->
<!--                <p-->
<!--                    class="text-body-2 text-primary mb-2"-->
<!--                    v-for="subNav in nav.subNavs"-->
<!--                    :key="subNav.title"-->
<!--                >-->
<!--                  <router-link :to="nav.to">-->
<!--                    {{ subNav.title }}-->
<!--                  </router-link>-->
<!--                </p>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--          <v-col cols="12" md="3">-->
<!--            <p class="text-h6 mb-4">-->
<!--              <b>App端应用</b>-->
<!--            </p>-->
<!--            <div>-->
<!--              <v-btn-->
<!--                  class="mb-3"-->
<!--                  color="blue-grey"-->
<!--                  variant="outlined"-->
<!--                  size="x-large"-->
<!--                  block-->
<!--              >-->
<!--                <template v-slot:prepend-->
<!--                ><Icon width="30" icon="logos:google-play-icon" /></template-->
<!--                >即将上线-->
<!--              </v-btn>-->
<!--              <v-btn color="blue-grey" variant="outlined" size="x-large" block>-->
<!--                <template v-slot:prepend-->
<!--                ><Icon width="30" icon="logos:apple-app-store" /></template-->
<!--                >即将上线-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </v-col>-->
<!--        </v-row>-->
        <v-row>
          <v-col cols="6" style="display: flex;flex-direction: row;justify-content: end;align-items: center">
            <a  href="https://beian.miit.gov.cn/">皖ICP备2024030146号</a>
            <div>
              <v-img class="mx-1" width="20" height="20" src="~/assets/icp-icon.png" />
            </div>

          </v-col>
          <v-col  cols="6" style="display: flex;flex-direction: row;justify-content: start;align-items: center">
            <div>
              <v-img class="mx-1" width="20" height="20" src='~/assets/jh-icon.png' />
            </div>
            <a href="https://beian.mps.gov.cn/#/query/webSearch">皖公网安备34011102003517号</a>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
