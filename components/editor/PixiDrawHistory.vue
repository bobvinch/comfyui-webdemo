<script setup lang="ts">

</script>

<template>
  <!--        生成图片历史-->
  <v-card class="pa-4" height="100">
    <v-sheet
        class="mx-auto"
        max-width="600"
    >
      <v-slide-group
          show-arrows
          selected-class="bg-success"
      >
        <v-slide-group-item
            v-for="(item,index) in sdStore.ouputimgList"
            :key="index"
            v-slot="{ isSelected, toggle }"
        >
          <v-img max-width="50" class="ml-4" :src="item.url"></v-img>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-card>
</template>

<style scoped lang="scss">

</style>