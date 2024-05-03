
import {createPinia} from "pinia";
export default defineNuxtPlugin((nuxtApp) => {
    const {$pinia}=useNuxtApp()
    const sdStore=useStableDiffusionStore($pinia)
    sdStore.init()
    // console.log("插件引入……")
    // const pinia =createPinia()
    // nuxtApp.vueApp.use(pinia)
})
