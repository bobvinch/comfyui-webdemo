<script setup lang="ts">

const chatGPTStore = useChatGPTStore();

const close = () => {
  chatGPTStore.configDialog = false;
};

const apiKeyShow = ref(false);

// 监听当前激活的对话id,刷新messages的值


const tab = ref("one")
const prompt = ref("")
const act = ref("")


// const promptList = computed(() => {

//   // console.log("@@@@loading promplist&^^^^^^^^^^^^^^^^^^")
//   if (current.value === "zhHans") {
//     return promptsZh;
//   }
//   if (current.value === "en") {
//     return promptsEn;
//   }
//   if (current.value === "ja") {
//     return promptsJa;
//   }
// });
</script>

<template>
  <v-dialog v-model="chatGPTStore.configDialog" width="600">
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="one">{{ $t("chatgpt.config.title") }}</v-tab>
      <v-tab value="two">高级设置</v-tab>
    </v-tabs>
    <v-divider/>

    <v-card>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <v-card-text>
              <!-- ---------------------------------------------- -->


              <!-- ---------------------------------------------- -->
              <!-- Model -->
              <!-- ---------------------------------------------- -->
              <v-label class="font-weight-medium m1-2 ml-2 mt-1">{{
                  $t("chatgpt.config.model")
                }}
              </v-label>
              <div class="justify-space-evenly bg-grey-lighten-3">
                <v-container>
                  <v-row>
                    <v-col v-for="(item, index) in chatGPTStore.models" :key="index" cols="6" md="3" sm="4">
                      <v-btn :active="index === chatGPTStore.activedModelindex" variant="outlined"
                             :prepend-icon="item.icon" @click="(chatGPTStore.updateModel(index))">{{ item.title }}
                      </v-btn>

                    </v-col>
                  </v-row>
                </v-container>
              </div>


              <!-- ---------------------------------------------- -->
              <!-- 预设提示词 -->
              <!-- ---------------------------------------------- -->

              <v-card>
                <!-- 仅显示自定义提示词 -->
                <v-label class="font-weight-medium mb-2 ml-2 mt-1">{{
                    $t("chatgpt.config.role")
                  }}
                </v-label>

                <v-select class="ml-2" v-model="chatGPTStore.propmpt" :items="chatGPTStore.getShowPropmpts"
                          item-title="act"
                          item-value="prompt" return-object single-line>
                </v-select>
                <!-- <v-autocomplete class="ml-2"  label="扮演角色"  :items="chatGPTStore.Propmpts" item-title="act" item-value="prompt" v-model="chatGPTStore.currentRole"
                variant="underlined"></v-autocomplete> -->
                <v-textarea color="primary" class="px-2 py-1" label="预设提示词" variant="outlined"
                            placeholder="预设提示词内容，自动添加到每次对话之前"
                            v-model="chatGPTStore.propmpt.prompt"></v-textarea>
              </v-card>
            </v-card-text>

          </v-window-item>

          <v-window-item value="two">
            <v-card-text>
              <!-- APIKEY -->
              <!-- ---------------------------------------------- -->

              <v-label class="font-weight-medium mb-2 ml-2">{{
                  $t("chatgpt.config.apikey")
                }}
              </v-label>
              <v-text-field color="primary" variant="outlined" v-model="chatGPTStore.apiKey_user" class="px-2 py-1"
                            :placeholder="$t('chatgpt.config.apikeyPlaceholder')" prepend-inner-icon="mdi-key" autofocus
                            clearable
                            hide-details @click:prepend-inner="apiKeyShow = !apiKeyShow"></v-text-field>

              <!-- ---------------------------------------------- -->
              <!-- Proxy Url -->
              <!-- ---------------------------------------------- -->
              <v-label class="font-weight-medium mb-2 ml-2 mt-2">{{
                  $t("chatgpt.config.proxyUrl")
                }}
              </v-label>
              <v-text-field color="primary" variant="outlined" v-model="chatGPTStore.proxyUrl_user" class="px-2 py-1"
                            :placeholder="$t('chatgpt.config.proxyUrlPlaceholder')" prepend-inner-icon="mdi-web"
                            autofocus clearable
                            hide-details>
              </v-text-field>

              <!-- 仅显示自定义提示词开关 -->
              <v-label class="font-weight-medium mb-2 ml-2 mt-2">仅显示自定义提示词</v-label>
              <v-switch color="primary" class="ma-0 pa-0" v-model="chatGPTStore.showUsersOnly"
                        :label="chatGPTStore.showUsersOnly ? 'ON' : 'OFF'"></v-switch>

              <!-- 添加提示词 -->
              <v-label class="font-weight-medium mb-2 ml-2 mt-0">自定义预设提示词</v-label>


              <!-- <v-autocomplete label="Autocomplete" :items="chatGPTStore.Propmpts" item-title="act" item-value="prompt"
                v-model="chatGPTStore.propmpt" variant="underlined"></v-autocomplete> -->
                <v-row>
                  <v-col :cols="10">
                    <v-text-field color="primary" variant="outlined" class="px-2 py-1" placeholder="预设提示词标题"
                                  prepend-inner-icon="mdi-format-title" v-model="act" autofocus clearable hide-details>
                    </v-text-field>
                  </v-col>
                  <v-col :cols="2" class="my-auto">
                    <v-btn class="my-auto" size="30" icon="mdi-content-save-edit" color="primary" @click="chatGPTStore.addUserPropmpt(act, prompt)">
                    </v-btn>
                  </v-col>
                </v-row>
              <v-textarea color="primary" class="px-2 py-1" label="预设提示词" variant="outlined"
                          placeholder="预设提示词内容，自动添加到每次对话之前" v-model="prompt"></v-textarea>


            </v-card-text>
          </v-window-item>

        </v-window>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="warning" @click="chatGPTStore.initPropmpts">重置默认提示词</v-btn>

        <v-btn variant="flat" color="primary" @click="close">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
