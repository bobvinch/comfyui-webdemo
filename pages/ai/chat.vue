<script setup lang="ts">
import {MdPreview} from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import ChatHistorySidebar from "~/components/navigation/ChatHistorySidebar.vue";
import AnimationChat from "~/components/animation/AnimationChat.vue";
import AnimationAsk from "~/components/animation/AnimationAsk.vue";
import AnimationChat_mobile from "~/components/animation/AnimationChat_mobile.vue";

//获取用户信息
const authStore = useAuthStore()
const customizeThemeStore = useCustomizeThemeStore()
const chatHistoryStore = useChatHistoryStore()
const snackbarStore = useSnackbarStore();
const chatGPTStore = useChatGPTStore();
const isLoading = ref(false);//聊天状态
//是否显示历史消息
const chatHistory = storeToRefs(chatHistoryStore)
// 消息list
const messages = ref<ChatGPTMessage[]>([]);
const userMessage = ref("");//用户消息绑定消息输入框

//设置页面默认的布局
definePageMeta({
  //布局
  layout: 'landing-layout',
  validate: async (route: any) => {
    return true
  }
})

const getMsgHistory = () => {
  messages.value = chatHistoryStore.chatHistory[chatHistoryStore.activeIndex].messages
}
//当前激活的回话id
// const chatId = ref(chatHistoryStore.activeChatMenuId)

watchEffect(() => {
  // 监听当前激活的对话id,刷新messages的值
  console.log(chatHistoryStore.activeIndex)
  getMsgHistory()
}, {
  flush: 'post'
})

onMounted(() => {
//初始化大模型数据,预设提示词
  chatGPTStore.initPropmpts()
//获取历史消息
  getMsgHistory()
//初始化APIkey
  chatGPTStore.init(authStore.user!._id!, authStore.user!.username!)
  useEventListener(document, 'keydown', (e:any) => {
    console.log(e.key)
    if(e.key==='Alt'){
      chatHistory.showHistory.value?chatHistory.showHistory.value=false:chatHistory.showHistory.value=true
    }
  })

})




/**
 * 从store获取预设提示词，加到每次的绘画的前面
 */
const promptMessage = computed(() => {
  console.log("chatGPTStore.propmpt", chatGPTStore.propmpt);
  return [
    {
      content: chatGPTStore.propmpt.prompt,
      role: "system",
    },
  ];
});

/**
 * 截取聊天上下文，最近10条
 */
const requestMessages = computed(() => {
  if (messages && messages.value.length <= 10) {
    return [...promptMessage.value, ...messages.value];
  } else {
    // 截取最新的10条信息
    const slicedMessages = messages.value.slice(-10);
    return [...promptMessage.value, ...slicedMessages];
  }
});


/**
 * 发送对话
 */
const sendMessage = async () => {
  if (userMessage.value) {
    messages.value.push({
      content: userMessage.value,
      role: "user",
    });
    //保存到对话的标题
    chatHistoryStore.updateMenuTitle("New Chat", userMessage.value)
    // Clear the input
    userMessage.value = "";
    // Create a completion
    await useGPTCreateCompletion(requestMessages.value,messages)
  }
};

watch(
    () => messages,
    (val) => {
      if (val) {
        scrollToBottom(document.querySelector(".message-container"));
      }
    },
    {
      deep: true,
    }
);


const displayMessages = computed(() => {
  // console.log("computed excuting@@@@@@@messages" + JSON.stringify(messages.value))
  const messagesCopy = messages.value.slice(); // 创建原始数组的副本
  // const messagesCopy=messageHistory
  const lastMessage = messagesCopy[messagesCopy.length - 1];
  const updatedLastMessage = {
    ...lastMessage,
    content: countAndCompleteCodeBlocks(lastMessage.content),
  };
  messagesCopy[messagesCopy.length - 1] = updatedLastMessage;
  return messagesCopy;
});

const handleKeydown = (e: any) => {
  if (e.key === "Enter" && (e.altKey || e.shiftKey)) {
    // 当同时按下 alt或者shift 和 enter 时，插入一个换行符
    e.preventDefault();
    userMessage.value += "\n";
  } else if (e.key === "Enter") {
    // 当只按下 enter 时，发送消息
    e.preventDefault();
    sendMessage();
  }
};

const inputRow = ref(1);
</script>

<template>
  <!-- 对话历史记录 -->
  <chat-history-sidebar/>
  <div class="chat-bot" @click="HideHistory()">
    <div class="messsage-area">
      <perfect-scrollbar v-if="messages.length > 0" class="message-container">
        <template v-for="(message,index) in messages">
          <!-- 用户的消息样式 -->
          <div v-if="message.role === 'user'">
            <div class="pa-3 user-message">
              <v-avatar class="ml-4" variant="elevated">
                <img :src="authStore.getAvatar_file_url" alt="alt"/>
              </v-avatar>
              <v-card class="gradient text-pre-wrap" color="primary" theme="dark">
                <v-card-text>
                  <b> {{ message.content }}</b></v-card-text>
              </v-card>
            </div>
          </div>
          <!-- AI的消息样式 -->
          <div v-else>
            <div class="pa-2 pa-md-3 assistant-message">
              <v-avatar class="d-none d-md-block mr-2 mr-md-4" variant="elevated">
                <img :src="chatGPTStore.getActiveModel?.iconpath" alt="alt"/>
              </v-avatar>
              <v-card>
                <div>
                  <MdPreview :theme="customizeThemeStore.darkTheme ? 'dark' : 'light'" v-model="message.content"
                             class="font-1" :editorId="`previewonly-${index}`">
                  </MdPreview>
                </div>
              </v-card>
            </div>
          </div>
        </template>
        <div v-if="isLoading">
          <div class="pa-6">
            <div class="message">
              <!--              <animation-chat :size="100"/>-->
              <animation-ask :size="200"/>
            </div>
          </div>
        </div>
      </perfect-scrollbar>
      <!-- 初始界面 -->
      <div class="no-message-container" v-else>
        <h1 class="text-h5 text-md-h4 text-blue-lighten-1 font-weight-bold">
          用提问打开AI世界
        </h1>
        <!--        <AnimationChat :size="200" />-->
        <animation-chat_mobile/>
      </div>
    </div>
    <!-- 下部输入区域 -->
    <div class="input-area">
      <v-sheet color="transparent" elevation="0" class="input-panel d-flex align-end pa-1">
        <!-- 左侧配置图标 -->
        <v-btn class="mb-1" variant="elevated" icon @click="chatGPTStore.configDialog = true">
          <v-icon size="30" class="text-primary">mdi-cog-outline</v-icon>
          <v-tooltip activator="parent" location="top" text="ChatGPT Config"></v-tooltip>
        </v-btn>
        <!-- 输入文本框 -->
        <transition name="fade">
          <v-textarea class="mx-2" color="primary" type="text" clearable variant="solo" ref="input"
                      v-model="userMessage"
                      placeholder="直接提问或选择内置角色" hide-details @keydown="handleKeydown" :rows="inputRow"
                      @focus="inputRow = 3"
                      @blur="inputRow = 1">
          </v-textarea>
        </transition>
        <!-- 发送按钮 -->
        <v-btn class="mb-1" color="primary" variant="elevated" icon>
          <v-icon @click="sendMessage">mdi-send</v-icon>
        </v-btn>
      </v-sheet>
      <api-key-dialog/>
    </div>

  </div>
</template>

<style scoped lang="scss">
.chat-bot {
  background-repeat: repeat;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .messsage-area {
    flex: 1;
    height: 100%;
  }

  .input-area {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 1rem;
    align-items: center;

    .input-panel {
      border-radius: 5px;
      max-width: 1200px;
      margin: 0 auto;
    }
  }
}

.user-message {
  display: flex;
  align-content: center;
  justify-content: end;
  flex-direction: row-reverse;
}

.assistant-message {
  display: flex;
  align-content: center;
  justify-content: start;
  flex-direction: row;
}

.message {
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
}

.message-container {
  height: calc(100vh - 154px);
}

.no-message-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    font-size: 2rem;
    font-weight: 500;
  }
}

:deep(.md-editor-preview-wrapper) {
  padding: 5px 15px;
}

.font-1 {
  font-size: 13px !important;
}

@media screen and (max-width: 768px) {

  :deep(#md-editor-v3-preview),
  .user-message {
    font-size: 14px !important;
  }
}
</style>
