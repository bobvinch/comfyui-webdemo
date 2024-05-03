<script setup lang="ts">
import {Icon} from "@iconify/vue";
//微信登录相关
import axios from 'axios';

definePageMeta({
  //布局
  layout: 'auth-layout',
  validate: async (route: any) => {
    return true
  }
})
const APPID = 'wx64c50e4c0243c5fb'
const redirect_uri = encodeURIComponent(useRuntimeConfig().public.wxauthredirectUri as string)
const authStore = useAuthStore();
// authStore.getUserinfoByAccout("")
const isLoading = ref(false);
const isSignInDisabled = ref(false);
const refLoginForm = ref();
const account = ref("");
const password = ref("");
const isFormValid = ref(true);
//消息条
// show password field
const showPassword = ref(false);
//登录方式
const loginmethod = ref('wechat')
const snackbarStore=useSnackbarStore()
const handleLogin = async () => {
  const {valid} = await refLoginForm.value.validate();
  if (valid) {
    isLoading.value = true;
    isSignInDisabled.value = true;
    const {status,msg,data:user} = await useAuthloginbyAccount(account.value, password.value);
    if (status!=0) {
      //弹出错误消息
      console.log("@@@@登录失败" + msg)
      isLoading.value = false
      isSignInDisabled.value = false
      snackbarStore.showErrorMessage(msg)
    } else {
      //保存cokie
      snackbarStore.showSuccessMessage(msg)
      authStore.user=user
      useAuthsetCokies(user?.token!,user._id!)
      navigateTo(useGlobalConfig.APP.homepage)
    }
  } else {
    console.log("no");
  }
};


const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) =>
      (v && v.length <= 20 && v.length >= 6) || "Password must be 6-20 characters",
]);

// error provider
const errorProvider = ref(false);
const errorProviderMessages = ref("");

const error = ref(false);
const errorMessages = ref("");
const resetErrors = () => {
  error.value = false;
  errorMessages.value = "";
};

// const signInWithFacebook = () => {
//   alert(authStore.isLoggedIn);
// };
</script>
<template>
  <v-card color="white" class="pa-3 ma-3" elevation="3">


    <v-card-title class="my-4 text-h4">
      <span class="flex-fill"> 欢迎 </span>
    </v-card-title>
    <v-card-subtitle>推荐使用微信登录</v-card-subtitle>
    <!-- sign in form -->


    <v-window v-model="loginmethod">
      <v-window-item value="wechat">
        <!-- 微信登录 -->
        <v-card-text>
          <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
            <WxLogin scope="snsapi_login" :appid="APPID" :redirect_uri="redirect_uri" state="121212" href="">
            </WxLogin>
          </div>
        </v-card-text>
        <!-- 切换到密码登录 -->
        <v-btn class="mb-10 text-capitalize" color="primary" elevation="1" block size="x-large"
               @click="loginmethod='password'"
               :disabled="isSignInDisabled">
          <Icon icon="mdi-login" color="white" class="mr-3 my-2"/>
          账号登录
        </v-btn>
      </v-window-item>
      <!-- 账号密码登录 -->
      <v-window-item value="password">
        <v-card-text>
          <v-form ref="refLoginForm" class="text-left" v-model="isFormValid" lazy-validation>
            <v-text-field ref="refEmail" v-model="account" required :error="error" :label="$t('login.email')"
                          density="default" variant="underlined" color="primary" bg-color="#fff" name="账号" outlined
                          validateOn="blur"
                          placeholder="账号/邮箱/手机号" @keyup.enter="handleLogin"
                          @change="resetErrors"></v-text-field>
            <v-text-field ref="refPassword" v-model="password"
                          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword ? 'text' : 'password'"
                          :error="error" :error-messages="errorMessages" :label="$t('login.password')"
                          placeholder="**********"
                          density="default" variant="underlined" color="primary" bg-color="#fff" :rules="passwordRules"
                          name="password" outlined validateOn="blur" @change="resetErrors" @keyup.enter="handleLogin"
                          @click:append-inner="showPassword = !showPassword"></v-text-field>

            <!-- login btn -->
            <v-btn :loading="isLoading" :disabled="isSignInDisabled" block size="x-large" color="primary"
                   @click="handleLogin" class="mt-2">{{ $t("login.button") }}
            </v-btn>

            <div class="text-grey text-center text-caption font-weight-bold text-uppercase my-5">
              {{ $t("login.orsign") }}
            </div>

            <!-- external providers list -->
            <v-btn class="mb-2 text-capitalize" color="white" elevation="1" block size="x-large"
                   @click="loginmethod='wechat'"
                   :disabled="isSignInDisabled">
              <Icon icon="mdi-wechat" color="green" class="mr-3 my-2"/>
              微信登录
            </v-btn>
            <!-- <v-btn class="mb-2 lighten-2 text-capitalize" elevation="1" color="white" block size="x-large"
          :disabled="isSignInDisabled" @click="wechatLogin">
          <Icon icon="logos:facebook" class="mr-3" />
          Facebook
        </v-btn> -->

            <div v-if="errorProvider" class="error--text my-2">
              {{ errorProviderMessages }}
            </div>

            <div class="mt-5 text-center">
              <router-link class="text-primary" to="/auth/forgot-password">
                {{ $t("login.forgot") }}
              </router-link>
            </div>
          </v-form>
        </v-card-text>

      </v-window-item>
    </v-window>
  </v-card>
  <div class="text-center mt-6">
    {{ $t("login.noaccount") }}
    <nuxt-link class="text-primary font-weight-bold" to="/auth/signup">
      {{ $t("login.create") }}
    </nuxt-link>
    <nuxt-link to="/status/loading"></nuxt-link>
  </div>
</template>
