<script setup lang="ts">
import {Text, TextStyle, Sprite} from "pixi.js";
import {usePixiStore} from "~/stores/pixiStore";

const {$pixiApp} = useNuxtApp()
const container = $pixiApp.stage.getChildByName('mainContainer')
const {inputText} = storeToRefs(usePixiStore())
const text = defineModel("inputText")
watch(text, (newVal) => {
  console.log(newVal)
  inputText.value = newVal as string
})


const drawer1 = ref(false)
const drawer2 = ref(false)
const style = new TextStyle({
  fontFamily: 'Arial',
  fontSize: 100,
  fill: '0xFF0000', // gradient
})

/**
 * 新增文本
 * @param content
 */
const handlePixiAddText = (content: string) => {
  //添加问题
  const basicText = new Text({
    text: inputText.value,
    style
  });
  basicText.anchor.set(0.5)
  container!.addChild(basicText)
}

/**
 * 监听容器元素的变化，然后更新图层
 */
const layers = ref<PixiContainer[]>([])
container!.addListener("childAdded", (e) => {
  const lay = [] as PixiContainer[]
  container!.children.forEach((item: Sprite | any, index) => {
    const ctl = {label: item.label || item.text, index,visible:item.visible} as PixiContainer
    lay.push(ctl)
  })
  layers.value = lay
})
container!.addListener("childRemoved", (e) => {
  const lay = [] as PixiContainer[]
  container!.children.forEach((item: Sprite | any, index) => {
    const ctl = {label: item.label || item.text, index,visible:item.visible} as PixiContainer
    lay.push(ctl)
  })
  layers.value = lay
})

const handlePixiHideSwith=(index:number)=>{
  container!.children[index].visible?container!.children[index].visible=false:container!.children[index].visible=true
  usePixiHandleSelectBorderVisibility(container!.children[index].visible)
  layers.value[index].visible=container!.children[index].visible

}
const handlePixiRemoveElement = (index: number) => {
  container!.removeChild(container!.children[index])
}

</script>

<template>
  <v-navigation-drawer
      temporary
      height="80%"
      theme="dark"
      permanent
      rail
      color="primary"
  >
    <v-divider></v-divider>
    <v-list
        density="compact"
        nav
    >
      <v-list-item @click="drawer1 = !drawer1" prepend-icon="mdi-layers-outline" value="dashboard"></v-list-item>

      <v-list-item @click="drawer2 = !drawer2" prepend-icon="mdi-format-text" value="messages"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
      v-model="drawer1"
      temporary
      permanent>
    <v-list density="compact">
      <v-list-item v-for="(item,index) in layers" :key="index" :subtitle="item.label">
        <template v-slot:append>
          <v-btn
              color="grey-lighten-1"
              :icon="item.visible?'mdi-eye-outline':'mdi-eye-off-outline'"
              variant="text"
              size="x-small"
              @click="handlePixiHideSwith(item.index)"
          ></v-btn>
          <v-btn
              color="grey-lighten-1"
              icon="mdi-close"
              variant="text"
              size="x-small"
              @click="handlePixiRemoveElement(item.index)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <!--  文本-->
  <v-navigation-drawer
      v-model="drawer2"
      temporary
      permanent>
    <v-container class="my-1 pa-1">
      <!--   添加文字   -->
      <v-textarea

          hide-details
          bg-color="transparent"
          color="black"
          label="添加文本"
          v-model="inputText"
      ></v-textarea>
      <v-btn class="my-2" variant="flat" size="small" color="primary" @click="handlePixiAddText">添加文字</v-btn>
      <v-sheet>
        <v-label class="text-base text-black font-semibold">预设文本样式</v-label>
      </v-sheet>


    </v-container>

  </v-navigation-drawer>
</template>

<style scoped lang="scss">

</style>