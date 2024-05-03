<script setup lang="ts">
export interface Props {
  title: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'This a default title',
  labels: () => ['one', 'two']
})
</script>

<template>
  <v-toolbar class="my-0" height="100">
    <v-toolbar-title style="line-height: 2.5rem"  class="text-h4 font-weight-bold text-center">
      <span>{{props.title}}</span>
    </v-toolbar-title>
  </v-toolbar>
</template>

<style scoped lang="scss">

</style>