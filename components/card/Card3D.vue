<!--3D 立体图像卡片-->
<script setup lang="ts">
</script>

<template>
  <v-sheet
      width="100%"
      color="#333"
      elevation="0"
      class="mx-auto landing-warpper text-left"
      rounded
  >
    <v-sheet
        elevation="0"
        color="transparent"
        class="mx-auto my-10"
    >
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="4">
            <div class="card">
<!--              第一脏AI摄影-->
              <div class="wrapper">
                <img
                    src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/i2i_1.png"
                    class="cover-image"
                />
              </div>
              <img
                  src="@/assets/amazingai_logo_studio.png"
                  class="title"
              />
              <img
                  src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/i2i_1.jpg"
                  class="character"
              />
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="card my-10">
              <div class="wrapper">
                <img
                    src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/img2video_static.png"
                    class="cover-image"
                />
              </div>
              <img
                  src="@/assets/amazingai_logo_video.png"
                  class="title"
              />
              <img src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/nideyao_540.gif" class="character" />
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="card">
<!--              AI写真-->
              <div class="wrapper">
                <img
                    src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/ym-ai%E5%86%99%E7%9C%9F1.jpg"
                    class="cover-image"
                />
              </div>
              <img
                  src="@/assets/amazingai_logo_studio.png"
                  class="title"
              />
              <img
                  src="https://wangbo0808.oss-cn-shanghai.aliyuncs.com/aidraw/ym-ai%E5%86%99%E7%9C%9F3.jpg"
                  class="character"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-sheet>
</template>

<style scoped lang="scss">
.card {
  //max-width: 400px;
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 36px;
  perspective: 2500px;
  margin: 400px auto 0 auto
;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wrapper {
  transition: all 0.5s;
  position: absolute;
  width: 100%;
  z-index: -1;
}

.card:hover .wrapper {
  transform: perspective(900px) translateY(-5%) rotateX(25deg) translateZ(0);
  box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
  -webkit-box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
}

.wrapper::before,
.wrapper::after {
  content: "";
  opacity: 0;
  width: 100%;
  height: 80px;
  transition: all 0.5s;
  position: absolute;
  left: 0;
}
.wrapper::before {
  top: 0;
  height: 100%;
  background-image: linear-gradient(
          to top,
          transparent 46%,
          rgba(12, 13, 19, 0.5) 68%,
          rgba(12, 13, 19) 97%
  );
}
.wrapper::after {
  bottom: 0;
  opacity: 1;
  background-image: linear-gradient(
          to bottom,
          transparent 46%,
          rgba(12, 13, 19, 0.5) 68%,
          rgba(12, 13, 19) 97%
  );
}

.card:hover .wrapper::before,
.wrapper::after {
  opacity: 1;
}

.card:hover .wrapper::after {
  height: 120px;
}
.title {
  width: 100%;
  transition: transform 0.5s;
}
.card:hover .title {
  transform: translate3d(0%, -50px, 100px);
}

.character {
  width: 100%;
  opacity: 0;
  transition: all 0.5s;
  position: absolute;
  z-index: -1;
}

.card:hover .character {
  opacity: 1;
  transform: translate3d(0%, -30%, 100px);
}
</style>
