<script setup lang="ts">
import videojs from "video.js"
import "video.js/dist/video-js.css"


// video标签
const videoPlayer = ref()

const myPlayer = ref()

interface Props {
  src: string // 视频地址
  width?: number // 宽度
  height?: number // 高度
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  height: 200,
})
//监听属性的变化，动态改变src
watch(props,(newValue)=>{
  init()
  console.log("属性变化",newValue,myPlayer.value)
  const player =toRaw(myPlayer.value)

  // player.reset()
  setTimeout(() => {
    player.options_.sources[0].src = newValue.src
    player.src([
      {
        src: newValue.src,
        // type: "application/x-mpegURL"  //type可以不写，一旦写了一定要符合否则报错
      }
    ])
    player.load()
  },1000)

},{
  deep:true
})
/**
 * 初始化播放器
 */
const init=()=>{

  if(props.src) myPlayer.value = videojs(videoPlayer.value, {
    poster: "",
    controls: true,
    sources: [
      {
        src: props.src,
        type: 'video/mp4',
      }
    ],
    preload: "auto",
    // autoplay:true,
    bigPlayButton: false,
    controlBar: {
      remainingTimeDisplay: {
        displayNegative: false
      }
    },
    playbackRates: [0.5, 1, 1.5, 2]
  }, () => {
    myPlayer.value.log("play.....")
  })
}

onMounted(() => {
  init()
})


onUnmounted(() => {
  if (myPlayer.value) {
    myPlayer.value.dispose()
  }
})


</script>

<template>
  <div>
    <video :height="height" ref="videoPlayer" class="video-js">
      <source :src="src" type="video/mp4" />
    </video>
  </div>
</template>

