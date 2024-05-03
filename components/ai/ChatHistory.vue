<script setup lang="ts">
const chatHistoryStore = useChatHistoryStore()
const customizeTheme = useCustomizeThemeStore();

const selectDialogue = (id:number) => {
  chatHistoryStore.activeIndex=id
}
const deleteDialogue = (id:number) => {
  chatHistoryStore.deleteMenu(id)

}

const props = defineProps({
  // Data
  menu: {
    type: Array<any>,
    default: () => [],
  },
});
</script>
<template>
  <v-card class="mx-auto" max-width="300">
    <v-list density="compact">
      <v-list-subheader>对话历史</v-list-subheader>

      <v-list-item
        v-for="(menuItem,index) in chatHistoryStore.chatHistory"
        :key="menuItem.title"
        :title="menuItem.title"
        :subtitle="menuItem.subtitle"
        :value="index"
        variant="plain"
        @click="selectDialogue(index)"

      >
        <template v-slot:prepend>
          <v-avatar size="30" color="primary">
            <v-icon color="white">mdi-message-reply-text</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn
            color="primary"
            icon="mdi-delete-circle"
            variant="text"
            @click="deleteDialogue(index)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.v-list-group .v-list-item {
  padding-left: 8px !important;
}

.active-nav-grey {
  border-left: 5px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #3a456c, #a4abbb);
}

.active-nav-purple {
  border-left: 5px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #e82893, #954bcb);
}

.active-nav-info {
  border-left: 5px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #487afa, #3fc7f3);
}

.active-nav-success {
  border-left: 5px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #45b95b, #96dd4c);
}

.active-nav-warning {
  border-left: 5px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #f0635d, #edc252);
}

.active-nav-error {
  border-left: 5px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to bottom, #ea373a, #f07285);
}
</style>
