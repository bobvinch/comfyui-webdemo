<script setup lang="ts">

import ComfyModelSelect from "~/components/common/DropSelect.vue";
import DropSelect from "~/components/common/DropSelect.vue";

const sdStore = useStableDiffusionStore()
const {ouputimgList, txt2imgParams, isGernateDisable, ckpt_id} = storeToRefs(sdStore)
// SD3 图像比例
const aspect_ratio=ref('1:1')
const style_preset=ref('')

// console.log(txt2img)
//生成图片
const imageGenerate = async () => {
  isGernateDisable.value = true
  txt2imgParams.value.seed = useTokenUtilgenerateRandomNumber(15)
  txt2imgParams.value.ckpt_name_id = ckpt_id.value
  const output = await ComfyUI.text2img({
    ...txt2imgParams.value,
    sd3_aspect_ratio: aspect_ratio.value,
    sd3_style_preset: style_preset.value
  },{
    apisource: apisource.value
  })
  if (output) {
    const image = {
      url: output,
      souce: 'txt2img'
    } as Image
    ouputimgList.value.unshift(image)
  }
  isGernateDisable.value = false
}
const ckpt_nameList = ref<any>([])
onMounted(async () => {
  //获取本地支持的大模型
  await ComfyUI.Initalize()
  console.log(ComfyUI.ckpt_names)
  ComfyUI.ckpt_names.forEach((item, index) => {
    const ckpt = {
      value: index,
      name: item
    }
    ckpt_nameList.value.push(ckpt)
  })
})


// 绘图渠道
const apisources = useGlobalConfig.Draw.apisources
const apisource = ref(apisources[1].value)
watch(apisource, (newValue) => {
  console.log(newValue)
})


</script>

<template>
  <v-card height="auto">
    <v-card-text>

      <!-- ---------------------------------------------- -->
      <!-- Prompt  -->
      <!-- ---------------------------------------------- -->
      <v-label class="font-weight-medium">正向提示词（希望图片中出现？）</v-label>
      <v-textarea v-model="txt2imgParams.positive" color="primary" variant="outlined" density="compact"
                  type="text" placeholder="Prompt" hide-details/>
      <!-- ---------------------------------------------- -->
      <!-- Negative Prompt  -->
      <!-- ---------------------------------------------- -->
      <v-label class="font-weight-medium my-2">负向提示词（不希望图片中出现？）</v-label>
      <v-textarea v-model="txt2imgParams.negative" color="primary" variant="outlined" density="compact"
                  type="text" placeholder="Negative Prompt" hide-details/>
      <!--      绘画渠道选择-->
      <v-sheet class="d-flex justify-space-between align-center">
        <v-label class="text-capitalize font-weight-bold">绘画渠道选择</v-label>
        <v-chip-group v-model="apisource" filter>
          <v-chip v-for="(item,index) in apisources" :key="index" :value="item.value">{{ item.text }}</v-chip>
        </v-chip-group>
      </v-sheet>
      <!-- 模型选择 -->
      <v-divider class="my-2"></v-divider>
      <!--      选择大模型-->
      <v-sheet v-show="apisource==='default'">
        <drop-select :items="ckpt_nameList" label="选择大模型" v-model="ckpt_id"/>
      </v-sheet>
      <!--      SD3参数比率选择-->
      <v-sheet v-show="apisource==='sd3'">
        <drop-select label="画面比例" v-model="aspect_ratio" :items="useGlobalConfig.Draw.SD3_aspect_ratios"/>
      </v-sheet>
      <!--      风格-->
      <v-sheet v-show="apisource==='sd3'" >
        <drop-select v-model="style_preset" :items="useGlobalConfig.Draw.SD3_style_presets" label="风格"/>
      </v-sheet>
<!--图片尺寸-->
      <v-row v-show="apisource==='default'" justify="space-around">
        <v-col cols="6">
          <!-- ---------------------------------------------- -->
          <!-- Width   -->
          <!-- ---------------------------------------------- -->
          <v-label class="font-weight-medium my-2">宽度：</v-label>
          <v-slider v-model="txt2imgParams.width" thumb-label="always" min="512" max="1024" step="16"
                    color="primary"></v-slider>
        </v-col>
        <v-col cols="6">

          <!-- ---------------------------------------------- -->
          <!-- Height   -->
          <!-- ---------------------------------------------- -->
          <v-label class="font-weight-medium my-2">高度：</v-label>
          <v-slider v-model="txt2imgParams.height" thumb-label="always" min="512" max="1024" step="16"
                    color="primary"></v-slider>
        </v-col>


      </v-row>

      <!--       生成按钮-->
      <v-btn class="mt-2" size="x-large" color="primary"
             :loading="isGernateDisable"
             :disabled="isGernateDisable"
             block @click="imageGenerate">开始生成
        <template v-slot:loader>
          {{ sdStore.btnStatus }}
          <v-progress-circular
              indeterminate
              color="primary"
              :model-value="sdStore.getProcess"></v-progress-circular>
        </template>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
