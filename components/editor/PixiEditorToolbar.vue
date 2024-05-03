<!--编辑器顶部工具栏-->
<script setup lang="ts">
const customizeTheme = useCustomizeThemeStore()
const {getAvatar_file_url: avatar_file_url} = useAuthStore()
</script>

<template>
  <v-app-bar width="100%" class="mx-auto justify-space-between">
    <v-sheet
        elevation="0"
        color="#F2F5F8"
        rounded
        width="100%"
    >
      <v-toolbar width="100%" color="primary">
        <div class="ml-5 mr-5">
          <h3 class="text-h5 font-weight-bold">AI画板</h3>
        </div>
        <v-btn to="/ai/chat" icon>
          <v-badge dot color="success">
            <v-icon >mdi-home-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-spacer></v-spacer>

        <slot name="download"/>

        <v-avatar class="mx-5">
          <v-img :src="avatar_file_url"></v-img>
        </v-avatar>
      </v-toolbar>
    </v-sheet>
    <v-sheet>
      <slot name="slider"></slot>
    </v-sheet>
  </v-app-bar>


</template>

<style scoped lang="scss">

</style>