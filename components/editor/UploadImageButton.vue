<template>
  <a-upload
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      :multiple="false"
      :show-upload-list="false"
      name="file"
  >
    <v-btn color="white" class="text-none" stacked>
      <v-badge content="2" color="error">
        <v-icon>mdi-cloud-upload</v-icon>
      </v-badge>
    </v-btn>
  </a-upload>
</template>
<script lang="ts" setup>
import {message, type UploadProps} from 'ant-design-vue';

const fileList = defineModel<any>()

const beforeUpload: UploadProps['beforeUpload'] = async (file: any) => {
  console.log(fileList.value)
  fileList.value = [file];
  return false;
};

</script>

