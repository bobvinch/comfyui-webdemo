<template>
  <div>
    <a-image
        :width="200"
        :style="{ display: 'none' }"
        :preview="{
        visible,
        onVisibleChange: setVisible,
      }"
        :src="src"
    />
  </div>
</template>
<script lang="ts" setup>


const src=defineModel("src",{
  default:""
})
const visible=defineModel("visible",{
  default:false
})
// const visible=ref(false)

const setVisible = (value:boolean): void => {
  visible.value = value;
};
</script>

