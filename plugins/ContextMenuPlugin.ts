/**
 * This kind of plugin runs very early in the Nuxt lifecycle, before we revive the payload.
 * You will not have access to the router or other Nuxt-injected properties.
 *
 * Note that the "DateTime" string is the type identifier and must
 * be the same on both the reducer and the reviver.
 */
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import Vue3Lottie from "vue3-lottie";
import {autoAnimatePlugin} from '@formkit/auto-animate/vue'
import MasonryWall from '@yeger/vue-masonry-wall'

// 导入视频播放组件
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'



export default definePayloadPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ContextMenu)
    nuxtApp.vueApp.use(PerfectScrollbar, {
        watchOptions: true,
        options: {
            suppressScrollX: false,
            suppressScrollY: false
        }
    })
    nuxtApp.vueApp.use(Vue3Lottie, {name: "LottieAnimation"});
    nuxtApp.vueApp.use(autoAnimatePlugin);
    nuxtApp.vueApp.use(MasonryWall);


    nuxtApp.vueApp.use(VueVideoPlayer)

    // 注册全局组件
    // nuxtApp.vueApp.component('VueVideoPlayer', VueVideoPlayer)



})
