import type {User} from "~/composables/authhooks";
import {useTokenUtilverifyToken} from "~/utils/tokenUtils";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    activate:true,
    isLoggedIn: false,
    profile: null as Profile | null,
    user: null as User|null,
    wechatAuth: {} as WechatAuth,
    count:1,
    tweetToken:"",
    lastShowTime:0
  }),

  persist: {
    storage:persistedState.localStorage
  },

  getters: {
    getNickname: (state) => state.user?.nickname ? state.user.nickname : "",
    getAvatar_file_url: (state) => state.user?.avatar_url ? state.user.avatar_url : "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/default_avatar.png",
    getLoginStatus: (state) => {
      let token = ""
      if (!state.user) {
        return () => state.isLoggedIn = false
      }
      if (state.user.token && typeof state.user.token === "string") {
        token = state.user.token
      } else if (state.user.token) {
        //防止出现多个token的情况
        token = state.user.token ? state.user.token[0] : ""
      }
      if (token && useTokenUtilverifyToken(token as string)) {
        state.isLoggedIn = true
      } else {
        state.isLoggedIn = false
      }
      return state.isLoggedIn

    }
  },

  actions: {

    setLoggedIn(payload: boolean) {
      this.isLoggedIn = payload;
    },
    //注册

    loginWithEmailAndPassword(email: string, password: string) {
      navigateTo("/");
    },

    loginWithGoogle() {
      navigateTo("/");
    },
  },
});
