<script setup lang="ts">

const color=defineModel({default:'#000000'})
watch(color,(newValue)=>{
  console.log(newValue)
})

</script>

<template>
    <v-btn
        style="border: 1px solid gray;"
        :color="color"
        size="x-small"
        class="my-auto"
    >
<!--      <v-icon icon="mdi-select-color"></v-icon>-->

      <v-menu
          activator="parent"
          location="bottom end"
          transition="fade-transition"
          :close-on-content-click="false"
      >
        <v-list
            density="compact"
            min-width="250"
            rounded="lg"
            slim
        >
          <v-list-item
              prepend-icon="mdi-select-color"
              title="颜色选择器"
              link
          ></v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item min-height="24">
            <template v-slot:title>
              <div v-show="false" class="d-flex justify-space-around">
                <v-color-picker
                    class="ma-2"
                    swatches-max-height="400px"
                    show-swatches
                    v-model="color"
                ></v-color-picker>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
</template>

<style scoped lang="scss">

</style>