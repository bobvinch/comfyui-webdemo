<script setup lang="ts">
import {Icon} from "@iconify/vue";

const authStore = useAuthStore()
definePageMeta({
  layout: "ui-layout"
})
const authorized = reactive({
  google: false,
  facebook: false,
});

const notifications = reactive({
  officialEmails: false,
  followerUpdates: false,
});

const passwords = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const currentPasswordShow = ref(false);
const newPasswordShow = ref(false);
const confirmPasswordShow = ref(false);

</script>
<template>
  <v-sheet elevation="0" class="mx-auto" color="transparent" max-width="1600">
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <div class="d-flex flex-column pa-10">
            <v-avatar size="120" class="mx-auto elevation-12" color="white">
              <v-img :src="authStore.getAvatar_file_url"></v-img>
            </v-avatar>

            <div class="text-center mt-5">
              <h3 class="text-h6 font-weight-bold">
                {{ authStore.user?.nickname ? authStore.user?.nickname : authStore.user?.username }}
                <v-chip size="small" class="font-weight-bold" color="blue">
                  {{ authStore.user?.role ? authStore.user?.role : '普通用户' }}
                </v-chip>
              </h3>
              <!-- <p class="text-body-2">{{ basic.about }}</p> -->
            </div>
          </div>
          <v-divider></v-divider>
          <!-- <div class="py-5 px-10">
            <v-icon color="grey"> mdi-map-marker </v-icon>
            <span class="ml-4">{{ basic.location }}</span>
          </div> -->

          <v-divider></v-divider>
          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-email-check-outline</v-icon>
            <span class="ml-4">{{ authStore.user?.email || '暂无信息' }}</span>
          </div>
          <v-divider></v-divider>

          <div class="py-5 px-10">
            <v-icon color="grey"> mdi-phone-outline</v-icon>
            <span class="ml-4">{{ authStore.user?.mobile || '暂无信息' }}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <!-- ---------------------------------------------- -->
        <!--   Basic Infomation -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="bg-white py-4 font-weight-bold">
            基本信息
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">账号</v-label>
                <v-text-field
                    v-model="authStore.user?.username"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    type="text"
                    placeholder="John Deo"
                    hide-details
                    :disabled=true
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">昵称</v-label>
                <v-text-field
                    v-model="authStore.user?.nickname"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    type="text"
                    placeholder="John Deo"
                    hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">邮箱</v-label>
                <v-text-field
                    class="bg-blue-grey-lighten-5"
                    readonly
                    v-model="authStore.user?.email"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    type="text"
                    placeholder="xxxxxx@163.com"
                    hide-details
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
                class="px-5"
                color="primary"
                elevation="1"
                variant="elevated"
                :disabled="true"
            >
              修改基本信息
            </v-btn
            >
          </v-card-actions>
        </v-card>

        <!-- ---------------------------------------------- -->
        <!--   Authentication  -->
        <!-- ---------------------------------------------- -->
        <!-- <v-card class="mb-5">
          <v-card-title class="bg-white py-4 font-weight-bold">
            Authentication</v-card-title
          >
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" md="6">
                <v-btn
                  color="primary"
                  size="large"
                  block
                  elevation="1"
                  variant="elevated"
                >
                  <Icon
                    icon="logos:google-icon"
                    class="mr-3 my-2"
                  />Google</v-btn
                >
              </v-col>

              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon
                    icon="logos:facebook"
                    class="mr-3 my-2"
                  />Facebook</v-btn
                >
              </v-col>

              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon
                    icon="logos:github-icon"
                    class="mr-3 my-2"
                  />Github</v-btn
                >
              </v-col>
              <v-col cols="12" md="6">
                <v-btn size="large" block variant="outlined" disabled>
                  <Icon icon="logos:twitter" class="mr-3 my-2" />Twitter</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card> -->

        <!-- ---------------------------------------------- -->
        <!--   Change Password  -->
        <!-- ---------------------------------------------- -->
        <v-card class="mb-5">
          <v-card-title class="bg-white py-4 font-weight-bold">
            修改/设置登录密码
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-7">
            <v-row>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">当前密码(无密码登录留空)</v-label>
                <!--                <v-text-field-->
                <!--                    readonly-->
                <!--                    v-model="passwords.currentPassword"-->
                <!--                    class="bg-blue-grey-lighten-5"-->
                <!--                    density="compact"-->
                <!--                    color="primary"-->
                <!--                    variant="outlined"-->
                <!--                    :type="currentPasswordShow ? 'text' : 'password'"-->
                <!--                    placeholder="Current Password"-->
                <!--                    hide-details-->
                <!--                    :append-inner-icon="-->
                <!--                    currentPasswordShow ? 'mdi-eye' : 'mdi-eye-off'-->
                <!--                  "-->
                <!--                    @click:append-inner="-->
                <!--                    currentPasswordShow = !currentPasswordShow-->
                <!--                  "-->
                <!--                >-->
                <!--                </v-text-field>-->
              </v-col>
              <v-col cols="12" sm="6"></v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2">修改密码</v-label>
<!--                <v-text-field-->
<!--                    v-model="passwords.newPassword"-->
<!--                    density="compact"-->
<!--                    color="primary"-->
<!--                    variant="outlined"-->
<!--                    :type="newPasswordShow ? 'text' : 'password'"-->
<!--                    placeholder="new password"-->
<!--                    hide-details-->
<!--                    :append-inner-icon="newPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"-->
<!--                    @click:append-inner="newPasswordShow = !newPasswordShow">-->
<!--                </v-text-field>-->
              </v-col>
              <v-col cols="12" sm="6">
                <v-label class="font-weight-medium mb-2"
                >确认密码
                </v-label
                >
                <!--                <v-text-field-->
                <!--                    v-model="passwords.confirmPassword"-->
                <!--                    density="compact"-->
                <!--                    color="primary"-->
                <!--                    variant="outlined"-->
                <!--                    :type="confirmPasswordShow ? 'text' : 'password'"-->
                <!--                    placeholder="confirm password"-->
                <!--                    hide-details-->
                <!--                    :append-inner-icon="-->
                <!--                    confirmPasswordShow ? 'mdi-eye' : 'mdi-eye-off'"-->
                <!--                    @click:append-inner="confirmPasswordShow = !confirmPasswordShow">-->
                <!--                </v-text-field>-->
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-5">
            <v-spacer></v-spacer>
            <v-btn
                class="px-5"
                color="primary"
                elevation="1"
                variant="elevated"
                :disabled="true"
            >
              提交修改
            </v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
