<script setup lang="ts">
import axios from "axios";
// ant消息组件
import ImageUpload from "~/components/ai/ImageUpload.vue";


const snackbarStore = useSnackbarStore()
const authStore = useAuthStore()
const sdStore = useStableDiffusionStore()
const {isGernateDisable, totalSteps, excutingApi, imageParam_img2img,imageParam_aimodel, img2imgParams} = storeToRefs(sdStore)
const alertInfo = ref(useGlobalConfig.Draw.exceedSizeRemind)
const cloth_types = useGlobalConfig.Draw.cloth_types
const emptyWarn = () => {
  snackbarStore.showWarningMessage(alertInfo.value)
  isGernateDisable.value = false
};
const exceedsizeWarn = () => {
  snackbarStore.showWarningMessage(useGlobalConfig.Draw.exceedSizeRemind)
  isGernateDisable.value = false
};

export interface Props {
  api: string,
  showClothtype?: boolean,//默认不显示衣服样式
  showDenoise?: boolean,//默认显示重绘幅度
  uploadImgNum?: number,//默认上传组件1个
  img_1_desc?: string,
  img_2_desc?: string,
  showPositive?: boolean,//默认显示正向提示词
  showNagetive?: boolean,//默认显示负向提示词
}

const Props = withDefaults(defineProps<Props>(), {
  api: "img2img",
  showClothtype: false,//默认不显示衣服样式
  showDenoise: true,//默认显示重绘幅度
  uploadImgNum: 1,//默认上传组件1个
  img_1_desc: '点击或拖住上传',
  img_2_desc: '点击或拖住上传',
  showPositive: true,//默认显示正向提示词
  showNagetive: true,//默认显示负向提示词
})


const uploadfile = defineModel('uploadfile')
const uploadfile2 = defineModel('uploadfile2')
const DrawParams = defineModel('DrawParams',{
  default:{
    recogPart: 0,
    positive: '',
    negative: '',
    denoise: 0.5
  }
})
//传递参数
onMounted(() => {
  socketInit()
})

const sizeValidation = ref(false)
const emptyValidation = ref(false)



//生成图片
const imageGenerate = async () => {
  isGernateDisable.value = true
  if (Props.api === 'img2img') {
    //总生成步数计算进度百分比
    totalSteps.value = 36
    excutingApi.value = "图生图"
    //普通图生图
    const image_path = await ComfyUI.uploadImageToOSS(imageParam_img2img.value[0].originFileObj)
    const output = await ComfyUI.img2img({
      image_path,
      denoise: img2imgParams.value.denoise,
    }) as string
    if (output) {
      sdStore.addImage(output)
    }
  }
  if (Props.api === 'AImodel_api') {
    const image_model = await ComfyUI.uploadImageToOSS(imageParam_aimodel.value[0].originFileObj)
    if (image_model) {
      //总生成步数计算进度百分比
      sdStore.totalSteps = 86
      sdStore.excutingApi = "AI模特"
      emptyValidation.value = true
      const image_mask=await ComfyUI.segmentAnything(image_model,cloth_types[sdStore.aimodelParams.recogPart].value)
      // const image_mask = 'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/AI%25E5%2581%2587%25E4%25BA%25BA%25E6%25A8%25A1%25E7%2589%25B9__segment_output_final__0001.png'
      const output = await ComfyUI.aimodel({
        image_path_model: image_model,
        image_path_mask: image_mask,
        parts: useGlobalConfig.Draw.cloth_types[sdStore.aimodelParams.recogPart].value,
        positives: sdStore.aimodelParams.positive,
        negatives: sdStore.aimodelParams.negative,
      })
      if (output) {
        sdStore.addImage(output)
      }
    }
  }

  isGernateDisable.value = false
}

watch([uploadfile, uploadfile2], (newValue) => {
  saveUploadFiletoStore(newValue)
})
const saveUploadFiletoStore = (file: any) => {
  switch (Props.api) {
    case 'img2img':
      sdStore.imageParam_img2img = file[0];
      break;
    case 'AImodel_api':
      sdStore.imageParam_aimodel = file[0]
      break;
    case 'AIstudio_api':
      sdStore.imageParam_aistudio = file[0]
      sdStore.imageParam2_aistudio = file[1]
      break;
  }
}


</script>

<template>
  <div id="container"></div>
  <v-card>
    <!--    <context-holder />-->

    <v-card-text>
      <!-- 图片上传组件 -->
      <image-upload v-model:uploadfile="uploadfile"/>

      <!-- 服装参数:识别区域 -->
      <v-label v-show="Props.showClothtype"
               class="font-weight-medium my-3">识别区域（选中的部分将会被保留）
      </v-label>
      <v-row v-show="Props.showClothtype" justify="space-around">
        <v-col cols="12">
          <v-sheet elevation="10" class="py-4 px-1">
            <v-chip-group v-model="DrawParams.recogPart" mandatory selected-class="text-primary">
              <v-chip filter v-for="cloth_type in cloth_types" :key="cloth_type.value">
                {{ cloth_type.text }}
              </v-chip>
            </v-chip-group>
            <v-img v-show="sdStore.outputImage_Mask" max-height="200"
                   :src="sdStore.outputImage_Mask?.url"></v-img>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- ---------------------------------------------- -->
      <!-- 正向提示词  v-show="props.config?.showPositive || true"-->
      <!-- ---------------------------------------------- -->
      <v-label v-show="Props.showPositive"
               class="font-weight-medium my-3">正向提示词（希望图片中出现？）
      </v-label>
      <v-textarea v-show="Props.showPositive"
                  v-model="DrawParams.positive" color="primary" variant="outlined" density="compact" type="text"
                  placeholder="Prompt" hide-details/>

      <!-- ---------------------------------------------- -->
      <!-- 负向提示词  -->
      <!-- ---------------------------------------------- -->
      <v-label v-show="Props.showNagetive"
               class="font-weight-medium my-3">负向提示词（不希望图片中出现？）
      </v-label>
      <v-textarea v-show="Props.showNagetive"
                  v-model="DrawParams.negative" color="primary" variant="outlined" density="compact" type="text"
                  placeholder="Negative Prompt" hide-details/>

      <!-- ---------------------------------------------- -->
      <!-- 重绘幅度   -->
      <!-- ---------------------------------------------- -->
      <v-label v-show="Props.showDenoise"
               class="font-weight-medium my-3">重绘幅度（越小越接近原图）
      </v-label>
      <v-slider v-show="Props.showDenoise" v-model="DrawParams.denoise"
                thumb-label="always" max="1" min="0.1" step="0.05" color="primary"></v-slider>
      <!-- 生成按钮 -->
      <v-btn class="mt-2" size="x-large" color="primary" :loading="sdStore.isGernateDisable"
             :disabled="sdStore.isGernateDisable"
             block @click="imageGenerate">开始生成
        <template v-slot:loader>
          {{ sdStore.btnStatus }}
          <v-progress-circular
              color="primary"
              indeterminate
              :model-value="sdStore.getProcess"></v-progress-circular>
        </template>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
//  .preview-cover {
//     position: absolute;
//     bottom: 0;
//     box-sizing: border-box;
//     width: 100%;
//     padding: 4px;
//     color: #fff;
//     font-size: 12px;
//     text-align: center;
//     background: rgba(0, 0, 0, 0.3);
//   }
</style>
