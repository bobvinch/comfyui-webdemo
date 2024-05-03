<!--下拉选择框组件-->

<script setup lang="ts">

interface Props {
  label: string
  items: item[]
}
interface item {
  name: string
  value: string | number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [] as item[],
  label: () => '请选择'
})

const selected = defineModel<number|string>({default: 0|""})


</script>

<template>
  <v-select clearable variant="underlined" density="compact" v-model="selected" :items="items"
            item-value="value" item-title="name" :label="label">
    <template v-slot:selection="{ item }">
      <span class="text-truncate text-no-wrap text-caption">{{ item.title }}</span>
    </template>
    <template v-slot:item="{ props, item }">
      <v-list-item density="compact" nav v-bind="props"></v-list-item>
    </template>
  </v-select>
</template>

<style scoped lang="scss">

</style>