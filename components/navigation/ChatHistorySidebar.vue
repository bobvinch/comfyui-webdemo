
<script setup lang="ts">

// import { Icon } from "@iconify/vue";
import ChatHistory from "~/components/ai/ChatHistory.vue";

const customizeTheme = useCustomizeThemeStore();

const chatHistoryStore = useChatHistoryStore()
const chatHistory=storeToRefs(chatHistoryStore)



// 传建一个新的对话
const creatNewChat = () => {
  console.log("@@@@@@@")
  chatHistoryStore.addNewMenu()
  // chatHistoryStore.activeChatMenuId++
  // location.reload()
}


onMounted(() => {
  scrollToBottom();
});

const scrollToBottom = () => {
  const contentArea = document.querySelector(".v-navigation-drawer__content");
  const activeItem = document.querySelector(
    ".v-list-item--active"
  ) as HTMLElement;

  setTimeout(() => {
    contentArea?.scrollTo({
      top: activeItem?.offsetTop,
    });
  }, 100);
};
</script>

<template>
  <div>
    <div class="drawer-button" @click="chatHistoryStore.showHistory = true">
      <v-icon class="text-white">mdi-history</v-icon>
    </div>
    <v-navigation-drawer  v-model="chatHistoryStore.showHistory" elevation="1" id="mainMenu">


      <!-- ---------------------------------------------- -->
      <!---Top Area -->
      <!-- ---------------------------------------------- -->
      <template v-if="!customizeTheme.miniSidebar" v-slot:prepend>
        <v-card style="box-shadow: rgba(0, 0, 0, 0.05) 0px 25px 15px -20px" height="80"
          class="d-flex align-center justify-center">
          <v-btn prepend-icon="mdi-message-check-outline" variant="outlined" @click="creatNewChat">
            新的对话
          </v-btn>
        </v-card>
      </template>

      <!-- ---------------------------------------------- -->
      <!---Nav List -->
      <!-- ---------------------------------------------- -->
      <v-divider />
      <ChatHistory />

      <!-- ---------------------------------------------- -->
      <!---Bottom Area -->
      <!-- ---------------------------------------------- -->
      <template v-if="!customizeTheme.miniSidebar" v-slot:append>
        <v-divider />
        <v-card theme="dark" height="80" class="d-flex align-center justify-center" variant="text"
          style="box-shadow: rgba(0, 0, 0, 0.05) 0px -25px 15px -20px">
          <v-btn prepend-icon="mdi-delete-alert-outline" variant="outlined" @click="chatHistoryStore.clearAllChat">
            清除会话
          </v-btn>
        </v-card>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<style scoped lang="scss">
.drawer-button {
  position: fixed;
  background-color: grey;
  bottom: 100px;
  right: -45px;
  z-index: 999;
  padding: 0.5rem 1rem;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  box-shadow: 1px 1px 9px grey;
  transition: all 0.5s;
  cursor: pointer;

  &:hover {
    box-shadow: 1px 1px 18px grey;
    right: 0px;
    transition: all 0.5s;
  }
}
</style>
