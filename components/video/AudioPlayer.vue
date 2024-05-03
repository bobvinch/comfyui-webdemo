<template>
  <v-sheet>
    <audio
        @timeupdate="updateProgress"
        controls
        ref="audioRef"
        style="display: none"
    >
      <source :src="src" type="audio/mpeg"/>
      您的浏览器不支持音频播放
    </audio>
<!--    右侧控制按键-->
    <div class="audio-right">
      <v-btn
          @click="playAudio"
          variant="text"
          :icon="audioStatus === 'pause'?'mdi-pause':'mdi-play'">
      </v-btn>

      <v-sheet v-show="displayStyle === 'default'" class="progress-bar-bg" id="progressBarBg" v-dragto="setAudioIcon">
        <div class="progress-bar" id="progressBar"></div>
      </v-sheet>
      <v-sheet v-show="displayStyle === 'default'" class="audio-time" style="min-height: 10px">
        <span class="audio-length-current" id="audioCurTime">{{
            audioStart
          }}</span
        >/
        <span class="audio-length-total">{{ duration }}</span>
      </v-sheet>
      <v-sheet v-show="displayStyle === 'default'" class="volume">
        <div
            @click.stop="
            () => {
              return false;
            }
          "
            class="volume-progress"
            v-show="audioHuds"
        >
          <div
              class="volume-bar-bg"
              id="volumeBarBg"
              v-adjuster="handleShowMuteIcon"
          >
            <div class="volume-bar" id="volumeBar"></div>
          </div>
        </div>
        <!-- <i class="iconfont pl-1" :class="audioIcon" @click.stop="audioHuds = !audioHuds"> </i> -->
        <v-btn
            variant="text"
            size="small"
            icon="mdi-volume-high"
            @click.stop="audioHuds = !audioHuds">
        </v-btn>
      </v-sheet>

    </div>
  </v-sheet>
  <span class="audio-length-total">时长：{{ duration }}s</span>
</template>

<script setup>

const props = defineProps({
  src: "",
  displayStyle: "default",
});


// 监听资源变化，重新加载
watch(props, (newVal) => {
  audioRef.value.load();
},{
  deep: true
})
const audioStatus = ref("play");
const audioStart = ref("0:00");
const duration = ref(0);
const audioVolume = ref(0.5);
const audioHuds = ref(false);
const audioRef = ref();
const VDragto = reactive({
  mounted: function (el, binding, vnode) {
    el.addEventListener(
        "click",
        (e) => {
          let wdiv = document.getElementById("progressBarBg").clientWidth;
          let audio = vnode.ctx.refs.audioRef;
          // console.log(audio,77);
          // return;
          // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
          let ratemin = e.offsetX / wdiv;
          let rate = ratemin * 100;
          document.getElementById("progressBar").style.width = rate + "%";
          audio.currentTime = audio.duration * ratemin;
          audio.play();
          binding.value();
        },
        false
    );
  },
});
const VAdjuster = reactive({
  mounted: function (el, binding, vnode) {
    el.addEventListener(
        "click",
        (e) => {
          let hdiv = document.getElementById("volumeBarBg").clientHeight;
          let audio = vnode.ctx.refs.audioRef;
          // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
          let ratemin = e.offsetY / hdiv;
          let rate = ratemin * 100;
          document.getElementById("volumeBar").style.height = rate + "%";
          audio.volume = ratemin;
          binding.value(rate / 100);
        },
        false
    );
  },
});
onMounted(() => {
  fetch();
});

function fetch() {
  // let that = this;
  var myVid = audioRef.value;
  myVid.loop = false;
  // 监听音频播放完毕
  myVid.addEventListener(
      "ended",
      function () {
        audioStatus.value = "play"; // 显示播放icon
        document.getElementById("progressBar").style.width = "0%"; // 进度条初始化
      },
      false
  );
  if (myVid != null) {
    myVid.oncanplay = function () {
      // duration.value = transTime(myVid.duration); // 计算音频时长
      duration.value = myVid.duration; // 计算音频时长
    };
    myVid.volume = 0.5; // 设置音量50%
  }
}

// 播放暂停控制
function playAudio() {
  let recordAudio = audioRef.value; // 获取audio元素
  if (recordAudio.paused) {
    recordAudio.play();
    audioStatus.value = "pause";
  } else {
    recordAudio.pause();
    audioStatus.value = "play";
  }
}

// 更新进度条与当前播放时间
function updateProgress(e) {
  var value = e.target.currentTime / e.target.duration;
  if (document.getElementById("progressBar")) {
    document.getElementById("progressBar").style.width = value * 100 + "%";
    if (e.target.currentTime === e.target.duration) {
      audioStatus.value = "pause";
    }
  } else {
    audioStatus.value = "pause";
  }

  audioStart.value = transTime(audioRef.value.currentTime);
}

/**
 * 音频播放时间换算
 * @param {number} value - 音频当前播放时间，单位秒
 */
function transTime(time) {
  var duration = parseInt(time);
  var minute = parseInt(duration / 60);
  var sec = (duration % 60) + "";
  var isM0 = ":";
  if (minute === 0) {
    minute = "00";
  } else if (minute < 10) {
    minute = "0" + minute;
  }
  if (sec.length74 === 1) {
    sec = "0" + sec;
  }
  return minute + isM0 + sec;
}

function setAudioIcon() {
  console.log(99);
  audioStatus.value = "pause";
}

function handleShowMuteIcon(val) {
  console.log(4444);
  audioVolume.value = val;
}

computed(() => {
  function audioIcon() {
    if (audioHuds.value) {
      return audioVolume.value < 0.01
          ? "checked icon-jingyin"
          : "checked icon-shengyin";
    } else {
      return "icon-shengyin";
    }
  }
});
</script>

<style lang="scss" scoped>
.volume {
  position: relative;

  .volume-progress {
    position: absolute;
    top: -150px;
    width: 32px;
    height: 140px;
    background: #f6f6f6;
    border-radius: 4px;
    padding-top: 10px;
  }

  .volume-bar-bg {
    margin: 0 auto;
    width: 6px;
    height: 120px;
    background: #dcdcdc;
    border-radius: 100px;
    flex: 1;
    position: relative;
    transform: rotate(180deg);
    cursor: pointer;

    .volume-bar {
      width: 6px;
      height: 50%;
      background: #56bf8b;
      border-radius: 100px;
    }
  }

  .checked {
    color: #56bf8b;
  }
}

.audio-right {
  height: 49px;
  line-height: 49px;
  background: transparent;
  border-radius: 6px;
  display: flex;
  padding: 0 15px;

  .dialogAudioPlay {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .progress-bar-bg {
    background-color: #fff;
    flex: 1;
    position: relative;
    height: 10px;
    top: 50%;
    transform: translateY(-50%);
    margin-top: -1px;
    cursor: pointer;
    margin: 0 10px;
  }

  .progress-bar {
    background-color: #56bf8b;
    width: 0%;
    height: 10px;
    border-radius: 5px;
  }

  .audio-time {
    overflow: hidden;
    font-size: 14px;

    .audio-length-total {
      float: right;
    }

    .audio-length-current {
      float: left;
    }
  }
}

.audio_high {
  width: 50px;
  height: 50px;
}
</style>

