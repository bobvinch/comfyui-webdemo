<script setup lang="ts">
import type {PixiBaseConfig} from "~/composables/usePixi";
import PixiColorPicker from "~/components/editor/PixiColorPicker.vue";
import {type ChatGPTMessage, useGPTGernateDrawPropmt} from "~/composables/chathooks";

// const items = [
//   {
//     src: 'backgrounds/bg.jpg',
//   },
//   {
//     src: 'backgrounds/md.jpg',
//   },
//   {
//     src: 'backgrounds/bg-2.jpg',
//   },
//   {
//     src: 'backgrounds/md2.jpg',
//   },
//   {
//     src: 'backgrounds/md.jpg',
//   },
//   {
//     src: 'backgrounds/bg-2.jpg',
//   },
//   {
//     src: 'backgrounds/md2.jpg',
//   }
// ]
const editItems = [
  {
    title: 'AI文生图',
    icon: "mdi-format-color-text",
    edittype: 'text2img' as EditType
  },
  {
    title: 'AI重绘',
    icon: "mdi-panorama-variant-outline",
    edittype: 'img2img_canvas' as EditType
  },
  {
    title: 'AI相似图',
    icon: "mdi-content-copy",
    edittype: 'img2img' as EditType
  },
  {
    title: '局部重绘',
    icon: "mdi-magnify-expand",
    edittype: 'impainting' as EditType
  },
  {
    title: 'AI抠图',
    icon: "mdi-magnify-expand",
    edittype: 'matting' as EditType
  },
  {
    title: '去除背景',
    icon: "mdi-magnify-expand",
    edittype: 'removebg' as EditType
  },
  {
    title: '画质修复',
    icon: "mdi-high-definition",
    edittype: 'hdfix' as EditType
  },
  {
    title: '生成视频',
    icon: "mdi-video-image",
    edittype: 'cavanstovideo' as EditType
  },

]

const positive = defineModel()

const {baseConfig} = storeToRefs(usePixiStore())


const selectRatio = ref("default")   //画布比例
watch(selectRatio, (newRatio) => {
  switch (newRatio) {
    case "default":
      baseConfig.value.width = 512
      baseConfig.value.height = 768
      break;
    case "square":
      baseConfig.value.width = 512
      baseConfig.value.height = 512
      break;
    case "vertical":
      baseConfig.value.width = 512 * 2
      baseConfig.value.height = 768 * 2
      break;
      case "horizontal":
        baseConfig.value.width = 512 * 2
        baseConfig.value.height = 576
        break;
  }
})
const selectEdit = ref(0)
watch(selectEdit, (index) => {
  baseConfig.value.editType = editItems[index].edittype
})

const messages = ref<ChatGPTMessage[]>([])
watch(messages, (newMessages) => {
  console.log(newMessages)
  if (!newMessages[newMessages.length - 1]?.content) {
    return
  }
  baseConfig.value.positive = newMessages[newMessages.length - 1].content
}, {
  deep: true
})
const handleGeneratePrompts = async () => {
  const chatStore = useChatGPTStore()
  await chatStore.init(useAuthStore().userInfo._id, useAuthStore().userInfo.username)
  await useGPTGernateDrawPropmt(baseConfig.value.positive, messages)
}

const hangleLayers = ref(0)
watch(hangleLayers, (newIndex) => {
  console.log(newIndex)
})

</script>

<template>
  <perfect-scrollbar style="height: 70vh;">
    <v-container class="ma-0 pa-0">
      <v-sheet>
        <v-row>
          <v-col class="pl-0 pr-4 ma-0">
            <v-card class="ma-0 py-0">
              <v-sheet class="d-flex flex-row justify-space-between align-center">
                <v-card-title class="text-subtitle-1 font-weight-bold">画布设置</v-card-title>
                <v-label class="text-caption font-weight-light">{{ baseConfig.width }}x{{
                    baseConfig.height
                  }}px
                </v-label>
              </v-sheet>

              <!--          画布比例设置-->
              <div>
                <v-card-text>
                  <v-btn-toggle
                      v-model="selectRatio"
                      borderless
                  >
                    <v-btn size="small" selected-class="bg-primary" value="default">
                      <span class="hidden-sm-and-down">默认</span>

                      <v-icon style="transform: rotate(90deg)" end>
                        mdi-rectangle-outline
                      </v-icon>
                    </v-btn>

                    <v-btn size="small" selected-class="bg-primary" value="square">
                      <span class="hidden-sm-and-down">1:1</span>
                      <v-icon end>
                        mdi-square-outline
                      </v-icon>
                    </v-btn>

                    <v-btn size="small" selected-class="bg-primary" value="vertical">
                      <span class="hidden-sm-and-down">高清</span>
                      <v-icon size="20" style="transform: rotate(90deg)" end>
                        mdi-rectangle-outline
                      </v-icon>
                    </v-btn>
                    <v-btn size="small" selected-class="bg-primary" value="horizontal">
                      <span class="hidden-sm-and-down">横向</span>
                      <v-icon size="20" style="transform: rotate(90deg)" end>
                        mdi-rectangle-outline
                      </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-card-text>
                <!--图层操作-->
                <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
                  <v-card-title class="text-caption font-weight-bold">图层操作</v-card-title>
                  <v-slider hide-details="auto" density="compact" thumb-label="always" min="0"
                            :max="baseConfig.maxIndex" step="1"
                            color="primary"
                            v-model="baseConfig.indexOfSelect"></v-slider>
                </v-sheet>


                <!--            背景色设置-->
                <v-sheet class="d-flex flex-row justify-space-between align-left">
                  <v-card-title class="text-subtitle-1 font-weight-bold">背景色</v-card-title>
                  <pixi-color-picker v-model="baseConfig.color"/>
                </v-sheet>
                <!--            启用画笔-->
                <v-sheet class="d-flex flex-row justify-space-between align-left">
                  <v-card-title class="text-subtitle-1 font-weight-bold">启用画笔</v-card-title>
                  <v-switch
                      hide-details
                      v-model="baseConfig.enableBrush"
                      color="primary"
                      :label="baseConfig.enableBrush?'ON':'OFF'"
                  ></v-switch>
                </v-sheet>
                <!--  这是画笔颜色-->
                <v-sheet v-show="baseConfig.enableBrush">
                  <v-sheet class="d-flex flex-row justify-space-between align-left">
                    <v-card-title class="text-caption font-weight-bold">画笔颜色</v-card-title>
                    <pixi-color-picker v-model="baseConfig.brushColor"/>
                  </v-sheet>
                  <v-sheet class="d-flex flex-row justify-space-between justify-center align-center">
                    <v-card-title class="text-caption font-weight-bold">画笔大小</v-card-title>
                    <v-slider hide-details="auto" density="compact" thumb-label="always" min="1" max="50" step="1"
                              color="primary"
                              v-model="baseConfig.brushSize"></v-slider>
                  </v-sheet>
                  <v-sheet class="d-flex flex-row justify-center align-center">
                    <v-btn size="small" color="primary" variant="outlined" @click="usePixiClearBrushDraw()">清空
                    </v-btn>
                  </v-sheet>
                </v-sheet>
              </div>
              <!--          功能选择-->
              <div>
                <v-card-title class="text-subtitle-1 font-weight-bold">AI编辑</v-card-title>
                <v-item-group v-model="selectEdit" mandatory>
                  <v-container>
                    <v-row>
                      <v-col
                          v-for="(item,index) in editItems"
                          :key="index"
                          cols="12"
                          md="3"
                      >
                        <v-item v-slot="{ isSelected, toggle }">
                          <v-card
                              :color="isSelected ? 'primary' : ''"
                              width="60"
                              height="60"
                              elevation="10"
                              class="d-flex flex-col justify-center align-center text-center rounded-lg"
                              @click="toggle"
                          >
                            <v-icon size="20">{{ item.icon }}</v-icon>
                            <v-label class="text-caption">{{ item.title }}</v-label>
                          </v-card>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-item-group>
              </div>

            </v-card>

          </v-col>
        </v-row>
      </v-sheet>
      <!--  文生图-->
      <v-sheet v-show="baseConfig.editType==='text2img'||baseConfig.editType==='impainting'">
        <v-sheet class="d-flex flex-row justify-space-between align-center">
          <v-label class="font-weight-medium my-2">描述画面</v-label>
          <v-btn size="x-small" color="primary" variant="outlined" @click="handleGeneratePrompts">AI</v-btn>
        </v-sheet>
        <v-textarea clearable v-model="baseConfig.positive" color="primary" variant="outlined" density="compact"
                    type="text" placeholder="Prompt" hide-details/>
      </v-sheet>
      <!--分割图像-->
      <v-sheet v-show="baseConfig.editType==='matting'">
        <v-label class="font-weight-medium my-2">分割部分</v-label>
        <v-textarea v-model="baseConfig.segpart" color="primary" variant="outlined" density="compact"
                    type="text" placeholder="Prompt" hide-details/>
      </v-sheet>
      <!--  AI相似图-->
      <v-sheet v-show="baseConfig.editType==='img2img_canvas'||baseConfig.editType==='impainting'||baseConfig.editType==='img2img'">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-label class="font-weight-medium my-2">接近原图</v-label>
          <v-label class="font-weight-medium my-2">更有创意</v-label>
        </div>

        <v-slider thumb-label="always" min="0.1" max="1" step="0.01" color="primary"
                  v-model="baseConfig.denoise" width="300"></v-slider>
      </v-sheet>
    </v-container>
  </perfect-scrollbar>

</template>

<style scoped lang="scss">

</style>