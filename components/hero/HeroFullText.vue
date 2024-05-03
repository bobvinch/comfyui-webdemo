<!--100%宽度文字-->
<script setup lang="ts">
</script>

<template>
  <v-sheet
      elevation="0"
      class="mx-auto landing-warpper"
      color="transparent"
      rounded
  >
    <v-container class="text-center">
      <v-sheet color="transparent" elevation="0">
        <img class="mx-auto" width="200" src="@/assets/bocui_logo.png" alt="" />
        <v-card
            color="transparent"
            elevation="0"
            class="mx-auto my-10 py-0py-md-12"
            max-width="1400"
        >
          <h1
              style="color: #4a4d6d"
              class="font-weight-black text-h3 text-lg-h2 text-xl-h1"
          >
            AI成为
            <span class="text-primary">生产力</span>
            从未如此
            <span class="text-primary">简单</span>
          </h1>
          <h2 class="text-h6 text-secondary mt-4 mx-auto">
            为创造性工作者提供最好用的AI工作流
          </h2>
        </v-card>
        <div class="text-center mb-10">
          <v-btn size="x-large" class="text-white" color="primary" to="/ai/chat"
          >免费体验</v-btn
          >
        </div>
      </v-sheet>
    </v-container>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
