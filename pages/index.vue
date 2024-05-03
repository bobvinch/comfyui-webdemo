<script setup lang="ts">

import HeroFullText from "~/components/hero/HeroFullText.vue";
import FeatureImageRight from "~/components/hero/FeatureImageRight.vue";
import FeatureImageLeft from "~/components/hero/FeatureImageLeft.vue";
import FooterDownload from "~/components/common/FooterDownload.vue";
import Card3D from "~/components/card/Card3D.vue";
import TitleBar from "~/components/toolbar/TitleBar.vue";
import CardCallToAction from "~/components/card/CardCallToAction.vue";
import CardTextImageMix from "~/components/card/CardTextImageMix.vue";

</script>

<template>
  <!--  抬头-->
  <hero-full-text/>
  <!--  3D效果展示-->
  <card3-d/>
  <!--使用教程：属于每个人普通人的人工智能-->
  <card-call-to-action/>

  <!--  号召行动页面-->
  <!--  <title-bar title="标题"/>-->
  <title-bar title="AI+——行业应用"/>
  <card-text-image-mix/>

  <title-bar title="AI基础能力——大语言模型"/>
  <feature-image-right/>
  <title-bar title="AI基础能力——文/图生图"/>
  <feature-image-left/>

  <footer-download/>
</template>

<style scoped lang="scss">

</style>