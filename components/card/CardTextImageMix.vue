<!--图文混合卡片-->
<script setup lang="ts">
import {applications} from "~/data/home/webcontext";
const articles =applications
</script>

<template>
  <v-sheet width="100%" elevation="0" class="mx-auto landing-warpper" rounded>
    <v-sheet class="mx-auto pa-5" elevation="0">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="4" v-for="item in articles" :key="item.id">
            <v-card max-width="450" class="mx-auto">
              <v-img cover :src="item.image" height="200px"></v-img>
              <v-card-title class="text-h6 font-weight-bold">
                {{ item.title }}
              </v-card-title>
              <v-card-subtitle>
                最近更新:{{ item.lastReadAt }}</v-card-subtitle
              >
              <v-card-text>
                {{ item.content }}
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" :to="item.to">
                  <v-icon class="mr-2">mdi-menu-right</v-icon>
                  立即体验
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="primary">
                  <v-icon class="mr-2">mdi-calendar</v-icon>
                  {{ item.createAt }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
