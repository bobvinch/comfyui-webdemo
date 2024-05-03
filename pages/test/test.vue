<script setup lang="ts">

//密码测试
const {user}=storeToRefs(useAuthStore())
if(user.value?._id){
  const token= useTokenUtilgenerateToken(user.value?._id)
  console.log("加密结果" +token)
  // 解密
  // const detoken=—useTokenUtildecodeToken(token)
  // console.log("解密结果" + detoken)
}



import io from 'socket.io-client'
import axios from "axios";
import {Vue3Lottie} from "vue3-lottie";
//
// const socket = io('http://127.0.0.1:3002')
// socket.on('connect', () => {
//   console.log('connected')
//   socket.emit('message', `hello,服务器，我是客户端，我的id是${socket.id}`)
// })
//
// socket.on('message', (msg) => {
//   console.log(msg)
// })
//
// const video1='https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/image2video_output_final__00006.mp4'
// // const video1=''
// const video2='https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/%E6%9D%8E%E4%BA%91%E6%80%9D1130-01.mp4'
// const videourl = ref<string>('')
// const videourl2 = ref<string>('')
// // videourl.value = video1
// // videourl2.value = video2
//
// const generateImage = async () => {
//   videourl.value = video2
//   videourl2.value = video1
// }


</script>

<template>


</template>

<style scoped lang="scss">

</style>