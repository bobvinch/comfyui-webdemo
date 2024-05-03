<script setup lang="ts">
import {faker} from "@faker-js/faker";
import ImagePreviewFull from "~/components/ai/ImagePreviewFull.vue";
import type {Image} from "~/composables/drawhooks";

onMounted(() => {

});
export interface WaterfallImage {
  src: string;
  title: string;
  description: string;
}

const items=defineModel<Scene[]|Image[]>({
  default:[]
})

const sdStore = useStableDiffusionStore()
onDeactivated(async () => {
  console.log('页面隐藏了')
  preview_src.value = ''
})

// 预览图片
const preview_src = ref('')
const visible = ref(false)
const viewImage = (src: string) => {
  // console.log(src)
  preview_src.value = src
  visible.value = true

}

// 当index为js的偶数时，返回480，否则返回240
const getPhotoHeight = (index: number) => {
  let height = 0;
  if (index % 3 === 0) {
    height = 480;
  } else if (index % 3 === 1) {
    height = 240;
  } else {
    height = 360;
  }
  return height;
};


// const loadMore = () => {
//   photos.value = photos.value.concat(
//     Array.from({ length: 5 }, (value, index) => ({
//       id: photos.value.length + index + "",
//       url: faker.image.animals(undefined, getPhotoHeight(index), true),
//       title: faker.lorem.word(),
//       description: faker.lorem.text(),
//     }))
//   );
// };

const onScroll = (e: any) => {
  const target = e.target;
  const scrollBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;
  console.log(scrollBottom);

  if (scrollBottom < 1) {
    setTimeout(() => {
      // loadMore();
    }, 1000);
  }
};
</script>

<template>
  <v-container class="h-full" v-scroll.self="onScroll">
    <v-card>
      <masonry-wall :items="items" :ssr-columns="1" :column-width="250" :padding="30">
        <template #default="{ item,index }">
          <v-card class="ma-3">
            <v-img
                @click="viewImage(item.src)"
                class="align-end text-white"
                :src="item.src"
                :lazy-src="item.src"
                cover
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
              <v-card-title>{{ item.title  }}</v-card-title>
            </v-img>

            <v-card-subtitle class="pt-2">
              {{ item.description }}
            </v-card-subtitle>

            <v-card-actions>
              <slot name="actions" :item="item" :index="index"></slot>
            </v-card-actions>
          </v-card>
        </template>
      </masonry-wall>
    </v-card>
  </v-container>
  <image-preview-full v-model:src="preview_src" v-model:visible="visible"/>
</template>

<style scoped></style>
