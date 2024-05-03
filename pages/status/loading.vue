<script setup lang="ts">
import AnimationChat1 from "~/components/animation/AnimationLoading.vue";
import axios from "axios";
import AnimationLoading from "~/components/animation/AnimationLoading.vue";
import {useAuthgetWechatUserInfo, useAuthloginByWechat} from "~/composables/authhooks";

//处理微信登录
//获取微信登录的返回code参数
const route = useRoute()
const {code} = route.query
onMounted(async ()=>{
  if (code) {
    console.log("获取到的code是：" + code)
    //第二步：通过code获取access_token
    const user=await useAuthgetWechatUserInfo(code+'' )
    console.log("获取到的用户信息",user)

    //第三步：通过access_token获取用户信息
    if (user) {
      await useAuthloginByWechat(user)
    }else {
      // 返回登录页面
      navigateTo(useGlobalConfig.APP.loginpage)
    }
  }
})

</script>

<template>
  <div style="height:100%;display: flex;justify-content: center;align-items: center;flex-direction: column;">
    <animation-loading/>
  </div>

</template>

<style scoped lang="scss">

</style>