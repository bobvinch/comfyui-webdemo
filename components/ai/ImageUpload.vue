<script lang="ts" setup>
/**
 * 图片上传组件
 */

// 图片上传
import type {UploadProps} from 'ant-design-vue';

const sdStore = useStableDiffusionStore()
const snackbarStore = useSnackbarStore()
const uploadfile: any = defineModel('uploadfile')
export interface Props {
  src?: string
  width?:number
  height?: number
  decription?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: "",
  width: 200,
  height: 300,
  decription: "上传图片"
})
const preview_src = ref<string>("")
onMounted(() => {
  preview_src.value = props.src
})



/**
 * 预览image
 */
const previewImage = async (file: File): Promise<any> => {
  if (!window.FileReader) {
    console.log("@@@浏览器不支持reader")
  }
  console.log(file)
  return await blobToBase64(file)
}
const preview = async () => {
  if (!uploadfile.value || uploadfile.value.length == 0) {
    return
  }
  preview_src.value = await previewImage(uploadfile.value[0].originFileObj)
  console.log(preview_src.value)
}


//返回上传之后的url
const url=defineModel('url')


//预览图片
// if (!isEmptyObj(props.imgParams[0]||!isEmptyObj(props.imgParams[1]))){
//     previewImg()
// }

//监听上传将图片上传到预览
watch(() => uploadfile, async (newValue) => {
  //上传预览
  console.log("监听触发来", newValue)
  if (!newValue.value || newValue.value.length == 0) {
    preview_src.value = ""
    return
  }
  preview()
  //上传图片到OSS，并且返回url
  url.value = await useUtilsUploadFileToOSS(newValue.value[0].originFileObj, 'image')
  snackbarStore.showSuccessMessage("上传成功")
}, {
  deep: true
})

//上传链接
const fileList = ref<UploadProps['fileList']>([]);
const uploading = ref<boolean>(false);

const beforeUpload: UploadProps['beforeUpload'] = async (file: any) => {
  // if (!await ComfyUI.validateImage(file)) {
  //   snackbarStore.showWarningMessage("建议图片尺寸在4MB以内，长宽不超过1024")
  // }
  fileList.value = [...(fileList.value || []), file];
  return false;
};



</script>


<template>
  <v-container>
    <v-row>
      <!-- 上传1 -->
      <v-col class="pt-0 my-auto" :cols="12">
        <a-upload-dragger :supportServerRender="true" :showUploadList="false" :max-count="1"
                          v-model:fileList="uploadfile" name="file"
                          :before-upload="beforeUpload" :multiple="false">
          <v-card v-if="!preview_src && !src" variant="text">
            <v-sheet class="d-flex flex-column align-center justify-center mx-auto" :height="height" :width="width" color="grey-lighten-4">
              <v-label class="text-h6">{{ decription }}</v-label>
              <animation-upload :size="100"/>
            </v-sheet>
          </v-card>
          <v-img v-else :height="height" :src="preview_src?preview_src:src"></v-img>
        </a-upload-dragger>
      </v-col>
    </v-row>


    <!--
    <v-file-input density="compact" v-model="uploadImageStore.fileList" :rules="rules" accept="image/png, image/jpeg, image/bmp"
        placeholder="Upload image here^^" prepend-icon="mdi-camera" label="上传图片">
    </v-file-input> -->

  </v-container>
</template>
<style scoped></style>