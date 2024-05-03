
import { Base64 } from 'js-base64';
import { useLocale } from "vuetify";
import promptsZh from "@/data/ai/prompts-zh.json";
import promptsEn from "@/data/ai/prompts-en.json";
import promptsJa from "@/data/ai/prompts-ja.json";
// import models from "@/data/ai/models.json"
import { customAlphabet } from "nanoid"
import {showSuccessMessage} from "~/composables/common";
import {useGPTcreatbyuniId, useGPTcreatToken} from "~/composables/chathooks";
import type {Model, OneAPIUser, OneAPIToken} from "~/composables/chathooks";
import type {Propmpt} from "~/composables/chathooks";
export const useChatGPTStore = defineStore({
  id: "aimodel",
  state: () => ({
    Propmpts: [] as Propmpt[],
    propmpt: {
      act: "默认",
      prompt: "请根据用户的问题回复"
    } as Propmpt,
    showUsersOnly: false,
    currentRole: "默认",
    currentEditPropmpt: {} as Propmpt,
    configDialog: false,
    apiKey: "",
    apiKey_user: "",
    proxyUrl: "",
    proxyUrl_user: "",
    activedModelindex: 0,   //当前使用的模型index
    // model: "gpt-3.5-turbo",
    models: useGlobalConfig.LLM.models as Model[]   //大模型清单
  }),
  persist: [{
    key:'chat_res',
    storage: persistedState.localStorage,
    paths: ["Propmpts", "Propmpts_user", "apiKey_user", "proxyUrl_user", "activedModelindex", "showUsersOnly"]
  },
    {
      key:'chat_config',
      storage: persistedState.sessionStorage,
      paths: ["models", "apiKeyEnconde"]
    }
  ],
  getters: {
    // If you have set up an API key, please use your own key. If not, please use the one I provided.
    // getApiKey: (state) => state.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
    // getApiKey: (state) => state.apiKey_user != "" ? state.proxyUrl_user : Base64.decode(state.apiKeyEnconde),
    getApiKey: (state) => state.apiKey_user ? state.apiKey_user : state.apiKey,
    getProxyUrl: (state) => state.proxyUrl_user ? state.proxyUrl_user : state.proxyUrl,
    getActiveModel: (state) => state.models[state.activedModelindex],
    getActivePromot: (state) => {
      return state.Propmpts.find(item => item.act === state.currentRole)
    },
    getPromoteKeySets: (state) => {
      let keySets = [] as string[]
      const showPropmpts= state.showUsersOnly?state.Propmpts.filter(item=>item.type==='user'):state.Propmpts
      showPropmpts.forEach(item => {
        keySets.push(item.act)
      });
      return keySets
    },
    getShowPropmpts:(state)=>{
      return state.showUsersOnly?state.Propmpts.filter(item=>item.type==='user'):state.Propmpts
    }


  },
  actions: {
    /**
     *初始化GPT
     * @param user_id
     * @param username
     */
    async init(user_id: string, username: string) {
      console.log(`GPTstore init`)
      if(this.proxyUrl===""){
        this.proxyUrl=useRuntimeConfig().public.basellmUrl
      }

      if (this.apiKey === ""||this.apiKey.includes('undefined')) {
        // 创建oneAPI用户
        const data: OneAPIUser = {
          username: username,
          password: '123456',
          quota: 500000,
          github_id: user_id
        }
        const userRes:any = await useGPTcreatbyuniId(data)
        //创建token
        console.log("ChatGPTStore init",userRes)
        const { id } = userRes
        const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 48)
        const tokenData = {
          user_id: parseInt(id),
          key: nanoid(),
          status: 1,
          created_time: Math.floor(new Date().getTime() / 1000),
          accessed_time: Math.floor(new Date().getTime() / 1000),
          expired_time: -1,
          remain_quota: 500000,
          unlimited_quota: false,
        } as OneAPIToken
        const tokenRes:any = await useGPTcreatToken(tokenData)
        const { key } = tokenRes
        if(key){
          this.apiKey = "sk-" + key
        }
      }
    },
    addUserPropmpt(act: string, prompt: string) {
      let propTemp: Propmpt = {
        act,
        prompt,
        type: "user"
      }
      this.Propmpts.unshift(propTemp)
      showSuccessMessage("添加成功")
    },
    updatePropmpt() {
      let propTemp: Propmpt = this.propmpt
      propTemp.type = "user"
      this.Propmpts.unshift(propTemp)
    },
    //初始化预设提示词
    initPropmpts() {
      const propmpts_user=this.Propmpts.filter((item:Propmpt)=>item.type==='user')
      const { current } = useLocale();
      // console.log("@@@@loading promplist&^^^^^^^^^^^^^^^^^^")
      if (current.value === "zhHans") {
        this.Propmpts =propmpts_user.concat(promptsZh) ;
      }
      if (current.value === "en") {
        this.Propmpts = propmpts_user.concat(promptsEn);
      }
      if (current.value === "ja") {
        this.Propmpts = propmpts_user.concat(promptsJa);
      }
    },
    updateModel(index: number) {
      this.activedModelindex = index
    },
  },
});
