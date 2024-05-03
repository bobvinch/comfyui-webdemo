<script setup lang="ts">
// 组件js部分
import Player, {Events} from 'xgplayer'
import 'xgplayer/dist/index.min.css';
import HlsPlugin from 'xgplayer-hls'

defineOptions({
  name: 'Xplayer'
})

interface Props {
  url: string // 视频地址
  isLive?: boolean // 是否为直播
  poster?: string // 封面图
}

interface optionTypes {
  volume: number
  autoplay: boolean
  screenShot: boolean
  muted: boolean
  videoAttributes: { crossOrigin: string }
  hls: {
    retryCount: number
    retryDelay: number
    loadTimeout: number
    fetchOptions: { mode: string }
  }
  type: string
  url: string
  poster: string
  fluid: boolean
  playbackRate: number[]
  download: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLive: false,
  poster: ''
})
watch(props, (newVal, oldVal) => {
  console.log("url变化了", player.value)
  player.value.src = newVal.url
}, {
  deep: true
})
const player = ref<any>({})
const option = ref({
  // 默认静音
  volume: 0,
  autoplay: false,
  screenShot: true,
  muted: true, // 默认静音
  videoAttributes: {
    // crossOrigin: 'anonymous'
    crossOrigin: 'Access-Control-Allow-Origin'
  },
  hls: {
    retryCount: 3, // 重试 3 次，默认值
    retryDelay: 1000, // 每次重试间隔 1 秒，默认值
    loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
    fetchOptions: {
      // 该参数会透传给 fetch，默认值为 undefined
      mode: 'cors'
    }
  },
  type: 'auto', // "auto | hls | flv | mp4 | m3u8 | dash |webm |ogg | avi | swf | mp3
  url: props.url,
  poster: props.poster,
  fluid: true,
  playbackRate: [0.5, 0.75, 1, 1.5, 2], // 传入倍速可选数组
  download: true
})
const init = (option: optionTypes, plugin = []) => {
  player.value = new Player({
    id: 'flv_live',
    lang: 'zh',
    ...option,
    plugins: [...plugin]
  })
  player.value.on(Events.LOADED_DATA, () => {
    // 加载完毕
  })
  player.value.on(Events.ERROR, (error: any) => {
    // 异常处理，具体可参考 https://h5player.bytedance.com/api/error.html#type
    console.log(error, 'error')
  })
}
onMounted(() => {
  // 直播
  if (props.isLive) {
    init(option.value, [HlsPlugin])
  } else {
    // 非直播
    init(option.value)
  }
})
onUnmounted(() => {
  player.value.destroy()
  player.value == null
})

</script>

<template>
  <div id="flv_live"></div>
</template>

<style scoped lang="scss">

</style>