<script setup lang="ts">
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import UiCard from "@/components/common/UiCard.vue";

const id = ref("editor");
const scrollElement = document.documentElement;
const markdown = `

`;


const text =defineModel({
  default:markdown
})
watch(text, (val) => {
  console.log(val);
});








</script>

<template>
  <v-row>
    <v-col cols="12">
      <MdEditor v-model="text" :theme="useCustomizeThemeStore().darkTheme? 'dark' : 'light'" />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss"></style>
