<script lang="ts" setup>
// import { debounce, throttle } from 'lodash'
import cloneDeep from "lodash/cloneDeep";
import {onKeyStroke} from '@vueuse/core'
import {saveAs} from "file-saver";
import {Assets, BlurFilter, Graphics, Point, Rectangle, RenderTexture, Sprite, Text, Texture} from 'pixi.js';
import {AdjustmentFilter, ShockwaveFilter} from 'pixi-filters'
import {ImageUrlToBase64} from "~/utils/FileUtils";
import PixiAdvanceHandlePanel from "~/components/editor/PixiAdvanceHandlePanel.vue";
import PixiBaseHandlePanel from "~/components/editor/PixiBaseHandlePanel.vue";
import PixiEditHandleDrawer from "~/components/editor/PixiEditHandleDrawer.vue";
import PixiEditorSliderBar from "~/components/editor/PixiEditorSliderBar.vue";
import UploadImageButton from "~/components/editor/UploadImageButton.vue";
import PixiEditorToolbar from "~/components/editor/PixiEditorToolbar.vue";
import LoadingOverlay from "~/components/editor/LoadingOverlay.vue";
import PixiTextEditPanel from "~/components/editor/PixiTextEditPanel.vue";
import PixiHoverImageHandle from "~/components/editor/PixiHoverImageHandle.vue";
import {_usePixiOnDragStart, usePixiContainerInit} from "~/composables/usePixi";
// 1、创建 pixi画布
const {$pixiApp} = useNuxtApp();
// 2、定义画布网页元素
const canvasDiv = ref()
//3、主要的画布容器
const container = usePixiCreatContainer("mainContainer")
// 4、操作容器
//字体处理
const {textStyle, enableTextMask} = storeToRefs(usePixiStore())
const {baseConfig, scaleRate, toolbarConfig, rightDrawerwindow} = storeToRefs(usePixiStore())
let currentSize = {width: baseConfig.value.width, height: baseConfig.value.height}
watch(baseConfig, (newConfig) => {
  console.log(newConfig)
  useDebounce(() => {
    if (selectTarget.value) {
      //设置选中目标的图层位置
      selectTarget.value.parent.setChildIndex(selectTarget.value, baseConfig.value.indexOfSelect)
    }
    // 尺寸变化，重新调整尺寸
    if (newConfig.width != currentSize.width || newConfig.height != currentSize.height) {
      $pixiApp.renderer.resize(newConfig.width, newConfig.height)
      //容器初始化
      handlePixiCanvasAdapt()
      usePixiContainerInit()
    }
    //调整背景颜色和透明度
    $pixiApp.renderer.background.color = newConfig.color
    $pixiApp.renderer.background.alpha = useAlphaFromHexColor(newConfig.color)
    console.log($pixiApp.renderer.background.alpha)
    if (baseConfig.value.enableBrush || currentSize.width !== newConfig.width || currentSize.height !== newConfig.height) {
      //启用笔刷，或者画布调整均重新启用
      usePixiEnableFreeDraw()
    }
    if (!baseConfig.value.enableBrush) {
      usePixiDisEnableFreeDraw()
    }
    // 局部重绘模式自动启用笔刷
    // if (newConfig.editType === 'impainting'){
    //   baseConfig.value.enableBrush = true
    // }
    // 保存当前render尺寸
    currentSize.width = newConfig.width
    currentSize.height = newConfig.height
  }, 100)
}, {
  deep: true
})
const {adjustmentFilter} = storeToRefs(usePixiStore())
watch(adjustmentFilter, (newAdjustmentFilter) => {
  const adjustmentFilter = new AdjustmentFilter()
  toRaw(selectTarget.value).filters = [adjustmentFilter]
  Object.assign(adjustmentFilter, newAdjustmentFilter)
  // $pixiApp.renderer.render(container)
}, {
  deep: true
})
const handleContainer = usePixiCreatContainer("handleContainer")
const maskContainer = usePixiCreatContainer("maskContainer")//遮罩容器
const resolution = ref(1)//分辨率

//监听选中对象的放大
watch(scaleRate, (newRate) => {
  if (!selectTarget.value) {
    return
  }
  useDebounce(() => {
    toRaw(selectTarget.value).scale.set(newRate)
    usePixishowSelect()
  }, 0)
})


/**
 * 监听图片上传，将上传后的图片加载到画板
 */
const uploadImage = ref()
watch(uploadImage, async (newValue) => {
  console.log("上传图片", newValue[0])
  if (newValue[0] && newValue[0].originFileObj) {
    await usePixiUploadImage(newValue[0].originFileObj, newValue[0].name)
  }
})


// load the PNG asynchronously
const testImageurl = 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/t2i_1.jpg'
const testImageurl2 = 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/AI%E5%81%87%E4%BA%BA%E6%A8%A1%E7%89%B9.png'
const maskurl = 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/ComfyUI_mask_00001_.png'
const iconsurl = 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/icons.png'
const videourl = "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/%E6%9D%8E%E4%BA%91%E6%80%9D1130-01.mp4"

const {testImage1} = await usePixiLoadAssets('testImage1', testImageurl)
const {testImage2} = await usePixiLoadAssets("testImage2", testImageurl2)
const {maskImage} = await usePixiLoadAssets("maskImage", maskurl)
const {iconSets} = await usePixiLoadAssets("iconSets", iconsurl)


const videoTexture = await Assets.load({
  src: videourl,
  data: {
    preload: true,
    autoplay: true
  }
})
const strechTexture = new Texture({
  source: iconSets,
  frame: new Rectangle(0, 0, 60, 60)
})
//裁剪按钮
const clipTexture = new Texture({
  source: iconSets,
  frame: new Rectangle(120, 0, 60, 60)
})
const strechButton = usePixiCreateReativeSprite(strechTexture)
const videoSprite = usePixiCreateReativeSprite(videoTexture)
// container.addChild(videoSprite)
strechButton.setSize(30)
const clipButton = usePixiCreateReativeSprite(clipTexture)
clipButton.setSize(40)
clipButton.rotation = Math.PI / 2


let dragFlag = false

const sdStore = useStableDiffusionStore()

const usePixiInit = async () => {
  // console.log($pixiApp)
  console.log(baseConfig.value.width)
  await $pixiApp.init({
    // resizeTo:canvasContainer.value,
    width: baseConfig.value.width,
    height: baseConfig.value.height,
    // autoDensity: true,
    backgroundColor: "transparent",
    resolution: resolution.value,
    eventMode: 'static',
    backgroundAlpha: baseConfig.value.backgroundAlpha,
    eventFeatures: {
      move: true,
      /** disables the global move events which can be very expensive in large scenes */
      globalMove: false,
      click: true,
      wheel: true,
    }
  });
  $pixiApp.renderer.events.autoPreventDefault = true
  $pixiApp.renderer.canvas.className = 'mx-auto my-auto'
  // $pixiApp.renderer.resize(pictureSize.value.width,pictureSize.value.height)
  canvasDiv.value.appendChild($pixiApp.canvas)
  usePixiContainerInit()
  $pixiApp.stage.hitArea = $pixiApp.screen;

  // enableBlur()
  console.log("初始化pixi", $pixiApp)
}

onMounted(async () => {
  socketInit()
  usePixiInit()
  // console.log($pixiApp.stage.children)
  handlePixiCanvasAdapt()
})
/**
 * cavans宽高自适应
 */
const handlePixiCanvasAdapt = () => {
  const {ps: {containerWidth, containerHeight}} = perfectscrollbar.value
  cardSizeRation.value = 1 / Math.max(baseConfig.value.width / containerWidth, baseConfig.value.height / containerHeight)
  cardWidth.value = baseConfig.value.width * cardSizeRation.value
  cardHeight.value = baseConfig.value.height * cardSizeRation.value
}
/**
 * 调整画布容器的尺寸
 */
const handlePixiCanvasResize = () => {
  console.log(cardWidth.value, cardHeight.value)
  cardWidth.value = baseConfig.value.width * cardSizeRation.value
  cardHeight.value = baseConfig.value.height * cardSizeRation.value
  if ($pixiApp?.renderer?.canvas) {
    $pixiApp.renderer.canvas.style.width = cardWidth.value + "px"
    $pixiApp.renderer.canvas.style.height = cardHeight.value + "px"
  }
}
const {selectTarget} = storeToRefs(usePixiStore())
const clipBorder = new Graphics();//裁剪框
handleContainer.addChild(clipBorder)
const handlePixiClip = () => {
  //增加按钮
  if (!selectTarget.value) {
    return
  }
  clipBorder.clear()
  clipBorder.rect(-selectTarget.value?.width / 2, -selectTarget.value?.height / 2, selectTarget.value?.width, selectTarget.value?.height);
  clipBorder.position = selectTarget.value?.position
  clipBorder.stroke({width: 2, color: 'blue'});
  clipButton.position.set(selectTarget.value?.x + selectTarget.value?.width / 2, selectTarget.value?.y + selectTarget.value?.height / 2)
  clipButton.on("mousedown", onClipStart)
}

function onClipStart() {
  clipButton.on("mousemove", onClipMove)
}
function onClipMove(event: any) {
}
const {inputText} = storeToRefs(usePixiStore())
watch(inputText, (newValue) => {
  // 监听文本选中，同步到选中的文本内容
  if (selectTarget.value && selectTarget.value.constructor.name === "Text") {
    selectTarget.value.text = newValue
  }
})

const handleSavecanvas = async () => {
  //赢藏背景
  // background.visible = false
  $pixiApp.canvas.toBlob((blob) => {
    saveAs(blob, "image1.png")
  })
}
const clearAll = () => {
  $pixiApp.stage.children.forEach(item => {
    item.removeChildren(0, item.children.length)
  })
}


//监听图片生成
// watch(sdStore.ouputimgList, async (newValue) => {
//   const sprit = await usePixiLoadOutputImage(newValue[0].url, newValue[0].name)
//   sprit.on('pointerdown', usePixiOnDragStart)
//   console.log(newValue[0])
// })

const positive = ref("一个女孩")
const hanlePixiImageGenerate = () => {
  switch (baseConfig.value.editType) {
    case "text2img":
      usePixiText2Image()
      break
    case "img2img_canvas":
      //AI重绘
      usePixiCavansToImage()
      break
    case "img2img":
      usePixiSelectToImage()
      break
    case "hdfix":
      usePixiHdfix()
      break
    case "matting":
      usePixiMatting()
      break
    case "impainting":
      usePixiImPaiting()
      break
    case "removebg":
      usePixiRemoveBg()
      break
  }
}

//设置页面默认的布局
definePageMeta({
  //布局
  layout: 'default',
  validate: async (route: any) => {
    return true
  }
})

const {ouputimgList} = storeToRefs(sdStore)
//测试数据
const selection = ref()

//控制弹出层
const {isGernateDisable} = storeToRefs(sdStore)
const handPixiOverlayShow = () => {
  isGernateDisable.value ? isGernateDisable.value = false : isGernateDisable.value = true
}

//选项卡
const tab = ref("base")

//笔刷功能

function onClearSelect(event: any) {
  console.log(event)
}

const handleSaveMask = async () => {
  // maskContainer.visible = false
}
const handleselectTargetToImage = async () => {
  const blob = await useSelectTargetToblob(selectTarget.value)
  saveAs(blob, "select.png")
}

class MoveSprite extends Sprite {
  direction: number = 0
  turningSpeed: number = 0
  speed: number = 0
  offset: number = 0
}

// Animate the blur filters

const waveFilter = new ShockwaveFilter({
  center: new Point(),
  speed: 100,
  amplitude: 30,
  wavelength: 200,
  radius: 160, // 半径
})
// container.filters=[waveFilter]
// 控制震波的方法
function createWave(resetTime: number) {
  waveFilter.centerX = Math.random() * $pixiApp.screen.width
  waveFilter.centerY = Math.random() * $pixiApp.screen.height
  // 震波的时间变化

  waveFilter.time += 0.01
  if (waveFilter.time > resetTime) {
    waveFilter.time = 0
    waveFilter.center = [Math.random() * $pixiApp.screen.width, Math.random() * $pixiApp.screen.height]
  }
}

const handleEnableBlur = () => {
  createWave(2)
  // 监听点击事件,产生震波
  $pixiApp.stage.addEventListener('click', (e) => {
    waveFilter.center = [e.clientX, e.clientY]
    console.log(e)
    waveFilter.time = 0
  })
  if (!selectTarget.value) {
    return
  }
  // container.filters = [waveFilter]
  selectTarget.value.visible = false
  // selectBorder.visible = false
  const totalSprites = 200
  for (let i = 0; i < totalSprites; i++) {
    // Create an array to store all the sprites
    const maggots = [] as MoveSprite[];
    // Create a new maggot Sprite
    const dude = new MoveSprite(selectTarget.value.texture);

    // Set the anchor point so the texture is centerd on the sprite
    dude.anchor.set(0.5);
    // Different maggots, different sizes
    dude.scale.set(0.8 + Math.random() * 0.05);

    // Scatter them all
    dude.x = Math.random() * $pixiApp.screen.width;
    dude.y = Math.random() * $pixiApp.screen.height;
    // dude.rotation = Math.PI /4
    dude.tint = Math.random() * 0xFF0000;

    // Create a random direction in radians
    // dude.rotation = Math.random() * Math.PI * 2;
    dude.direction = Math.random() * Math.PI * 2;

    // This number will be used to modify the direction of the sprite over time
    dude.turningSpeed = Math.random() - 0.8;

    // Create a random speed between 0 - 2, and these maggots are slooww
    dude.speed = (2 + Math.random() * 2) * 0.2;

    dude.offset = Math.random() * 100;

    // Finally we push the dude into the maggots array so it it can be easily accessed later
    maggots.push(dude);
    container.addChild(dude);
    // Create a bounding box for the little maggots
    // const dudeBoundsPadding = 300;
    const dudeBounds = new Rectangle(
        -$pixiApp.screen.width / 2,
        -$pixiApp.screen.height / 2,
        $pixiApp.screen.width,
        $pixiApp.screen.height,
    );

    let tick = 0;
    $pixiApp.ticker.add(() => {
      // Iterate through the sprites and update their position
      for (let i = 0; i < maggots.length; i++) {
        const dude = maggots[i];

        dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
        dude.direction += dude.turningSpeed * 0.01;
        dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
        dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
        dude.rotation = -dude.direction + Math.PI;

        // Wrap the maggots
        if (dude.x < dudeBounds.x) {
          dude.x += dudeBounds.width;
        } else if (dude.x > dudeBounds.x + dudeBounds.width) {
          dude.x -= dudeBounds.width;
        }

        if (dude.y < dudeBounds.y) {
          dude.y += dudeBounds.height;
        } else if (dude.y > dudeBounds.y + dudeBounds.height) {
          dude.y -= dudeBounds.height;
        }
      }

      // Increment the ticker
      tick += 0.1;
    });
  }
}
const handleDisableBlur = () => {
  $pixiApp.ticker.stop()
}
/**
 * 将当前cavans导出为视频
 */
const handleExportVideo = () => {
  usePixiExportCanvasVideo()
}

/**
 * delete删除选中图片并自动选中下一层级
 */
onKeyStroke('Delete', (e) => {
  e.preventDefault()
  usePixiRemoveSelect()
})
/**
 * 监听容易元素变化，并添加选中和拖拽动作
 */
container!.addListener("childAdded", (item) => {
  if (item.constructor.name === 'Text') {
    item.on("pointerdown", usePixiOnSelect)
    item.on("pointerdown", _usePixiOnDragStart)
  }
})

//固钉
const bottom = ref<number>(10);
//计算容器的宽和高
const perfectscrollbar = ref()
const cardWidth = ref<number>(0) //显示的画布的视图尺寸
const cardHeight = ref<number>(0)//显示的画布的视图尺寸
const cardSizeRation = ref<number>(1)//显示的画布的视图的放大比例
watch(cardSizeRation, (newValue) => {
  handlePixiCanvasResize()
})


// 监听字体样式变化，同步更新选中目标
watch(textStyle, (newValue) => {
  console.log("字体配置变化了", newValue)
  if (selectTarget.value && selectTarget.value.constructor.name === "Text") {
    toRaw(selectTarget.value).visible = false
    toRaw(selectTarget.value).style = cloneDeep(newValue)
    toRaw(selectTarget.value).visible = true
  }
}, {
  deep: true
})

/**
 * 测试，保存stage数据
 */
const handleSavaStageData = () => {
  const data = container.children
  data.forEach(item => {
    // console.log(item.texture.source._sourceOrigin)
    // console.log(item)
    const obj = cloneDeep(item)
    console.log(obj)
  })
}

/**
 * 测试，生成视频
 */
const handleGernateVideo=()=>{
  const [container]=$pixiApp.stage.children
  let time=0
  const  Interval=400
  const blurFilter=new BlurFilter()
  const list=container.children
  const length=list.length
  $pixiApp.ticker.add(({deltaTime})=>{
    time+=deltaTime
    if (time>Interval*length){
      time=0
    }
    console.log(time)
    list.forEach((item,index)=>{
      if(Math.floor(time/Interval)%length===index){
        item.visible=true
        item.alpha=(time-index*Interval)/Interval+0.5
      }else {
        item.visible=false
      }
    })
    // console.log(ticker)
  })
}
const stop=()=>{
  $pixiApp.ticker.destroy()
}
const start=()=>{
  $pixiApp.ticker.start()
}

</script>


<template>

  <div>
    <!--    顶部菜单栏-->
    <pixi-editor-toolbar>
      <template v-slot:download>
<!--        <v-btn @click="start" class="text-none" stacked>-->
<!--          <v-badge content="2" color="error">-->
<!--            <v-icon>mdi-play</v-icon>-->
<!--          </v-badge>-->
<!--        </v-btn>-->
<!--        <v-btn @click="stop" class="text-none" stacked>-->
<!--          <v-badge content="2" color="error">-->
<!--            <v-icon>mdi-stop</v-icon>-->
<!--          </v-badge>-->
<!--        </v-btn>-->
<!--        <v-btn @click="handleGernateVideo" class="text-none" stacked>-->
<!--          <v-badge content="2" color="error">-->
<!--            <v-icon>mdi-motion-play-outline</v-icon>-->
<!--          </v-badge>-->
<!--        </v-btn>-->
        <upload-image-button class="ma-2" v-model="uploadImage"/>

        <v-btn @click="handleSavecanvas" class="text-none" stacked>
          <v-badge content="2" color="error">
            <v-icon>mdi-cloud-download</v-icon>
          </v-badge>
        </v-btn>
        <v-btn class="text-none" stacked>
          <v-badge content="2" color="error">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-badge>

          <v-menu activator="parent">
            <v-list>
              <v-list-item>
                <v-btn @click="handleSavaStageData" size="small" prepend-icon="mdi-download" variant="text">
                  保存画板数据
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn @click="handleselectTargetToImage" size="small" prepend-icon="mdi-download" variant="text">
                  保存当前所选
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn @click="handleSaveMask" size="small" prepend-icon="mdi-download" variant="text">保存蒙版</v-btn>
              </v-list-item>
              <v-list-item>
                <v-btn @click="handleExportVideo" size="small" prepend-icon="mdi-download" variant="text">下载视频
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

      </template>
    </pixi-editor-toolbar>
    <!--右侧编辑栏-->
    <pixi-editor-slider-bar></pixi-editor-slider-bar>
  </div>

  <v-main>

    <!--左侧菜单-->

    <!--    右侧菜单-->
    <pixi-edit-handle-drawer>
      <template v-slot:default>
        <v-window
            v-model="rightDrawerwindow"
        >
          <!--          基础和高级配置-->
          <v-window-item key="0">
            <v-card
                class="mx-auto"
            >
              <v-tabs
                  v-model="tab"
                  bg-color="primary"
              >
                <v-tab value="base">基础</v-tab>
                <v-tab value="advance">高级</v-tab>
              </v-tabs>
              <v-card-text>
                <v-window v-model="tab">
                  <v-window-item value="base">
                    <pixi-base-handle-panel v-model="positive"/>
                  </v-window-item>
                  <v-window-item value="advance">
                    <pixi-advance-handle-panel/>
                  </v-window-item>
                </v-window>
              </v-card-text>
              <v-card-text>
                <v-btn class="ma-2" color="primary" block @click="hanlePixiImageGenerate">开始生成</v-btn>
              </v-card-text>

            </v-card>
          </v-window-item>
          <!--          文本编辑窗口-->
          <v-window-item key="1">
            <pixi-text-edit-panel/>
          </v-window-item>
        </v-window>

      </template>
    </pixi-edit-handle-drawer>
    <v-container height="100%">

      <!--        canvas画布-->
      <perfect-scrollbar ref="perfectscrollbar"
                         style="height: 80vh;width: 100%;">

        <v-card style="position: absolute;top:50%;left: 50%;transform: translateY(-50%)translateX(-50%);"
                class="mx-auto my-auto" elevation="10" :width="cardWidth" :height="cardHeight">
          <div class="my-auto" :class="baseConfig.width>1000?'grid-background-sm':'grid-background-lg'" ref="canvasDiv">
          </div>
        </v-card>

      </perfect-scrollbar>

      <!--          底部-->
      <div>
        <a-affix :offset-bottom="bottom">
          <v-sheet color="transparent" class="mx-auto d-flex flex-row  justify-end" width="90%">

            <v-btn size="small" elevation="10" @click="cardSizeRation>4?cardSizeRation=4:cardSizeRation+=0.1">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn id="menu-activator" size="small" elevation="10" variant="text"
                   :text="parseInt(cardSizeRation*100+'')+'%'"></v-btn>
            <v-menu activator="#menu-activator">
              <v-list>
                <v-list-item>
                  <v-btn @click="cardSizeRation=4" size="small" variant="text">400%
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="cardSizeRation=2" size="small" variant="text">200%
                  </v-btn>
                </v-list-item>

                <v-list-item>
                  <v-btn @click="cardSizeRation=1" size="small" variant="text">100%
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn @click="cardSizeRation=0.5" size="small" variant="text">50%
                  </v-btn>
                </v-list-item>
                <v-list-item
                >
                  <v-btn @click="handlePixiCanvasAdapt" size="small" prepend-icon="mdi-fullscreen" variant="text">
                    自动适应
                  </v-btn>

                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn size="small" elevation="10" @click="cardSizeRation>0.1?cardSizeRation-=0.1:cardSizeRation=0.1">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn id="menu-activator2" size="small" elevation="10">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-menu activator="#menu-activator2">
              <v-slider class="my-auto" thumb-label="always" min="0.1" max="2" step="0.01" label="缩放"
                        direction="vertical"
                        color="primary"
                        v-model="scaleRate" width="300"></v-slider>
            </v-menu>
          </v-sheet>
        </a-affix>
      </div>
    </v-container>
    <loading-overlay v-model="isGernateDisable"/>
    <!--    悬浮快捷操作工具条-->
    <pixi-hover-image-handle v-model="toolbarConfig"/>
  </v-main>


</template>

<style lang="scss">

.grid-background-lg {
  background: linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.1) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.1) 75%,
          rgba(0, 0, 0, 0.1) 100%
  ),
  linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.1) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.1) 75%,
          rgba(0, 0, 0, 0.1) 100%
  );
  /* 背景大小必须小于盒子的大小 */
  background-size: 40px 40px;
  /* 第二种渐变的偏移必须为为背景大小的一半 */
  background-position: 0 0, 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

}

.grid-background-sm {
  background: linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.1) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.1) 75%,
          rgba(0, 0, 0, 0.1) 100%
  ),
  linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.1) 25%,
          transparent 25%,
          transparent 75%,
          rgba(0, 0, 0, 0.1) 75%,
          rgba(0, 0, 0, 0.1) 100%
  );
  /* 背景大小必须小于盒子的大小 */
  background-size: 20px 20px;
  /* 第二种渐变的偏移必须为为背景大小的一半 */
  background-position: 0 0, 10px 10px;
  width: 100%;
  height: 100%;

}


</style>
