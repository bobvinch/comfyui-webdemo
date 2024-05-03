<script setup lang="ts">
const customizeTheme = useCustomizeThemeStore()
const {getAvatar_file_url: avatar_file_url} = useAuthStore()
</script>

<template>
  <v-main :class="isHideTopPadding?'main-container hideTopPadding':'main-container'">
    <v-sheet
        elevation="0"
        class="mx-auto landing-warpper"
        color="#F2F5F8"
        rounded
    >
      <v-toolbar color="primary">
        <div class="ml-5 mr-5">
          <h3 class="text-h5 font-weight-bold">AI画板</h3>
        </div>
        <v-btn icon>
          <v-badge dot color="success">
            <v-icon>mdi-home-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-spacer></v-spacer>

        <slot name="download"/>

        <v-avatar class="mx-5">
          <v-img :src="avatar_file_url"></v-img>
        </v-avatar>
      </v-toolbar>
    </v-sheet>
    <div class="flex-fill">
      <slot></slot>
    </div>
  </v-main>
</template>

<style scoped lang="scss">

</style>