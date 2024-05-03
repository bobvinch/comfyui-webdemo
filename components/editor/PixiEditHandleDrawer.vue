<script setup lang="ts">
const drawer = ref(true)

</script>

<template>
      <v-navigation-drawer
          class="d-none d-sm-flex"
          v-model="drawer"
          location="right"
          permanent
          width="350"
      >
        <slot name="default"></slot>
      </v-navigation-drawer>
</template>

<style scoped lang="scss">

</style>