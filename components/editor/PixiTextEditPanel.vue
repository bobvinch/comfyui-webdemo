<!--文本编辑面板-->
<script setup lang="ts">
import {fontSets} from "~/data/editor/fontSets";
import PixiColorPicker from "~/components/editor/PixiColorPicker.vue";
import {Assets, Sprite} from "pixi.js";

const {$pixiApp} = useNuxtApp()
const [container, handleContainer, maskContainer] = $pixiApp.stage.children

const fontStyle = ref<number[]>([])//字体样式
const fontAlign = ref(0)//对齐方式


const {textStyle, enableTextMask} = storeToRefs(usePixiStore())

watch(textStyle, (newVal) => {
  const fontStyleTemp = []
  if (newVal.fontWeight === "bold") {
    fontStyleTemp.push(0)
  }
  if (newVal.fontStyle === "italic") {
    fontStyleTemp.push(1)
  }
  fontStyle.value = fontStyleTemp

  fontAlign.value = alignItems.indexOf(newVal.align)
}, {
  deep: true
})

//监听字体样式的变化
const alignItems = ["left", "center", "right", "justify"]
watch(fontAlign, (newVal) => {
  textStyle.value.align = alignItems[newVal] as any
})
watch(fontStyle, (newVal) => {
  if (newVal.includes(0)) {
    textStyle.value.fontWeight = "bold"
  } else {
    textStyle.value.fontWeight = "normal"
  }
  if (newVal.includes(1)) {
    textStyle.value.fontStyle = "italic"
  } else {
    textStyle.value.fontStyle = "normal"
  }
}, {deep: true})


const {selectTarget} = storeToRefs(usePixiStore())

/**
 * 将选中文字作为当前做上层的精灵的遮罩，如果存在的画
 */
const handlePixiTextAsMask = async () => {
  // console.log(selectTarget.value)
  if (!selectTarget.value) {
    return
  }
  handleContainer.visible = false //隐藏处理容器
  container.children.forEach(item => {
    item.constructor.name != "Text" ? item.visible = false : item.visible = true
  })
  $pixiApp.render()
  const blob = await usePixiCanvasToBlob()
  const base64 = await blobToBase64(blob)
  container.children.forEach(item => {
    item.visible = true
  })
  $pixiApp.render()
  // const canvas=$pixiApp.renderer.extract.canvas(selectTarget)
  // const base64=await blobToBase64(blob)
  const maskTexture = await Assets.load(base64)
  const maskSprite = new Sprite(maskTexture)

  const sprite = container.children.findLast(item => item.constructor.name === '_Sprite')
  if (!sprite) {
    useSnackbarStore().showWarningMessage("没有可供遮罩的元素")
    return
  }
  sprite.mask = maskSprite
  toRaw(selectTarget.value).position.set(selectTarget.value.position.x, selectTarget.value.position.y+20)
  // container.removeChild(toRaw(selectTarget.value))//移除文本

  // container.mask=maskSprite
  // container.addChild(maskSprite)
}

</script>

<template>
  <v-container>
    <v-sheet class="d-flex flex-row justify-space-between align-center">
      <a-select
          ref="select"
          v-model:value="textStyle.fontFamily"
          style="width: 70%"
          :options="fontSets"
      ></a-select>
      <a-input-number v-model:value="textStyle.fontSize" size="middle" :min="1" :max="100000"/>
    </v-sheet>
    <!--    字体样式选择-->
    <v-sheet>
      <v-btn-toggle
          v-model="fontStyle"
          background-color="primary"
          dark
          multiple
      >
        <v-btn>
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn>
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn>
          <v-icon>mdi-format-underline</v-icon>
        </v-btn>

        <v-btn>
          <v-icon>mdi-format-color-fill</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-format-text-rotation-vertical</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-sheet>
    <!--对齐方式-->
    <v-sheet>
      <v-btn-toggle v-model="fontAlign">
        <v-btn>
          <v-icon>mdi-format-align-left</v-icon>
        </v-btn>

        <v-btn>
          <v-icon>mdi-format-align-center</v-icon>
        </v-btn>
        <v-btn>
          <v-icon>mdi-format-align-right</v-icon>
        </v-btn>

        <v-btn>
          <v-icon>mdi-format-align-justify</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-sheet>
    <!--    文字颜色-->
    <v-sheet class="my-2 d-flex flex-row justify-space-between align-center">
      <v-label class="text-xl font-semibold">文字颜色</v-label>
      <pixi-color-picker v-model="textStyle.fill"/>
    </v-sheet>
    <!--    描边-->
    <v-sheet class="my-2 d-flex flex-row justify-space-between align-center">
      <v-label class="text-xl font-semibold">描边</v-label>
      <pixi-color-picker v-model="textStyle.stroke"/>
    </v-sheet>
    <!--    描边-->
    <v-sheet class="my-2 d-flex flex-row justify-space-between align-center">
      <v-label class="text-xl font-semibold">文字遮罩</v-label>
      <v-btn size="x-small" color="primary" variant="outlined" @click="handlePixiTextAsMask">遮罩</v-btn>
    </v-sheet>
  </v-container>

</template>

<style scoped lang="scss">

</style>