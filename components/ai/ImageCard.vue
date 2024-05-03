<script lang="ts" setup>
import ContextMenu from '@imengyu/vue3-context-menu'
import {Icon} from '@iconify/vue'
import ImagePreviewFull from "~/components/ai/ImagePreviewFull.vue";
import type {Image} from "~/composables/drawhooks";
const sdStore=useStableDiffusionStore()
const {ouputimgList,isGernateDisable,imageParam_img2img,imageParam_aistudio,imageParam_aimodel,imageParam2_aistudio}=storeToRefs(sdStore)
const snackbarStore = useSnackbarStore();
const authStore = useAuthStore()
//接受父组件的图片参数，需要传入三个参数：1、图片显示的list,2、cols(大屏幕和小屏幕分别控制的参数)
const prop = defineProps(['imgs', 'cols_default', 'cols_md'])
const imageList = computed(() => {
  return prop.imgs
})
//遍历数组
// const num = 4//分割的数组数量
const imgList = ref<Array<Image>>([])
imgList.value = prop.imgs
// const imgListList: Array<any> = []//定义一个新的数组过滤后的数组
// for (let i = 0; i < num; i++) {
//     const templist = imgList.filter((item, index) => index % num === i)
//     imgListList.push(templist)
// }
// console.log(imgListList)

onMounted(() => {
})

const upscaleImage = async (name: string, subfolder: string, index: number) => {
  //对应图片的编辑状态改为true
  if (name.includes('upscale')) {
    snackbarStore.showWarningMessage("已经是放大处理之后的图片")
    return
  }
  ouputimgList.value[index].onhandleprocess = true
  subfolder = subfolder === "" ? "output" : "output/" + subfolder
  const basepth = "./ComfyUI/" + subfolder + "/"

  const output = await ComfyUI.imageUpscale(basepth + name)
  if (output){
    const image={
      url:output,
      souce:'upscalex4'
    } as Image
    ouputimgList.value.unshift(image)
  }
  isGernateDisable.value=false
}

const upscaleImageAndfixdetail = async (name: string, subfolder: string, index: number, multiple: number) => {
  if (name.includes('upscale')) {
    snackbarStore.showWarningMessage("已经是放大处理之后的图片")
    return
  }
  ouputimgList.value[index].onhandleprocess = true
  subfolder = subfolder === "" ? "output" : "output/" + subfolder
  const basepth = "./ComfyUI/" + subfolder + "/"
  const output = await ComfyUI.imageUpscaleAndDetailFix(basepth + name, multiple)
  if (output) {
    const image = {
      url: output,
      souce: 'upscaleAndFix'
    } as Image
    ouputimgList.value.unshift(image)
  }
  isGernateDisable.value = false
}

/**
 * 发送到图生图
 * @param img
 */
const sendToImg2img = (img: Image) => {
  imageParam_img2img.value[0]=img
}
/**
 * 发送到AI写真
 * @param img
 */
const sendToAimodel = (img: Image) => {
  imageParam_aimodel.value[0]=img
}
/**
 * 发送到AI写真-脸部参考
 * @param img
 */
const sendToAistudio_1 = (img: Image) => {
  imageParam_aistudio.value[0]=img
}
/**
 * 发送到AI写真-央视参考
 * @param img
 */
const sendToAistudio_2 = (img: Image) => {
  imageParam2_aistudio.value[0]=img
}

const onContextMenu = (e: MouseEvent, item:Image,index:any) => {
  //prevent the browser's default menu

  console.log(e.target)
  e.preventDefault();
  //show our menu
  ContextMenu.showContextMenu({
    theme: 'default',
    preserveIconWidth: false,
    x: e.x,
    y: e.y,
    items: [
      {
        label: "高清放大",
        onClick: () => {
          if (item.name != null) {
            if (item.subfolder != null) {
              upscaleImage(item.name, item.subfolder, parseInt(index))
            }
          }
        }
      },
      {
        label: "放大2倍+细节优化",
        onClick: () => {
          if (item.name != null) {
            if (item.subfolder != null) {
              upscaleImageAndfixdetail(item.name, item.subfolder, parseInt(index), 2)
            }
          }
        }
      },
      {
        label: "放大4倍+细节优化",
        onClick: () => {
          if (item.name != null) {
            if (item.subfolder != null) {
              upscaleImageAndfixdetail(item.name, item.subfolder, parseInt(index), 4)
            }
          }
        }
      },
      {
        label: "高清放大",
        onClick: () => {
          if (item.name != null) {
            if (item.subfolder != null) {
              upscaleImage(item.name, item.subfolder, parseInt(index))
            }
          }
        }
      },
      {
        label: "发送到图生图",
        onClick: () => {
          sendToImg2img(item)
        }
      },
      {
        label: "发送到AI模特",
        onClick: () => {
          sendToAimodel(item)
        }
      },
      {
        label: "发送到AI写真-脸部",
        onClick: () => {
          sendToAistudio_1(item)
        }
      },
      {
        label: "发送到AI写真-样式",
        onClick: () => {
          sendToAistudio_2(item)
        }
      },
    ]
  });
}

const preview_src=ref("")
const visible=ref(false)
const viewImage=(src:string)=>{
  console.log(src)
  preview_src.value=src
  visible.value=true
}


</script>

<template>
<image-preview-full v-model:src="preview_src" v-model:visible="visible"/>

  <v-container fluid>
    <v-row dense>
      <v-col v-for="(item, index) in imageList" :key="index" :cols="prop.cols_default" :md="prop.cols_md">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card @contextmenu="onContextMenu($event,item,index)"
                    :disabled="item.onhandleprocess" height="100%" v-bind="props">
              <!-- 图片显示 -->
              <v-img
                  @click="viewImage(item.url)"
                  :lazy-src="item.url"
                  :src="item.url">
              </v-img>

              <v-progress-circular v-show="item.onhandleprocess"
                                   style="position: absolute;top: 45%;left: 45%;" color="primary"
                                   :model-value="sdStore.getProcess"></v-progress-circular>
              <!-- 操作按钮 -->
              <v-card-actions v-show="isHovering"
                              style="position: absolute;bottom: 0;right: 0;z-index: 999;">
                <v-spacer></v-spacer>
                <v-btn size="x-small" color="white" variant="plain" icon="mdi-delete"
                       @click="sdStore.deleteByIndex(index)"></v-btn>

                <v-btn size="x-small" color="white" variant="plain" icon="mdi-download"
                       @click=""></v-btn>
              </v-card-actions>
            </v-card>
          </template>

        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 200px;
  border: 3px dashed rgba(90, 167, 164, 0.9);
  border-radius: 8px;
  background-color: rgba(90, 167, 164, 0.2);
}
</style>
