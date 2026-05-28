<script lang="ts" setup>
import { ref } from 'vue'
import type { Schematic, GetSchematicParams } from '@/types/schematic';
import { schematicTypes } from '@/types/schematic';
import UploadSchematic from '@/components/UploadSchematic.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import StrippedBirchLogBackground from '@/components/background/StrippedBirchLogBackground.vue';
import MCSegmentedControl from '@/components/MCSegmentedControl.vue';
import { getSchematicsByType } from '@/apis/schematic';
import { openAlert } from '@/utils/TsAlert';

import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

const store = useUserStore();
const { avatar } = storeToRefs(store);

const schematicList = ref<Schematic[]>([]);
const selectedValue = ref('redstone')

const getSchematicsParams: GetSchematicParams = {
  type: selectedValue.value,
  page: 1,
  per_page: 10
}

const querySchematics = (type?: string) => {
  if (type) {
    getSchematicsParams.type = type;
  }
  getSchematicsByType(getSchematicsParams).then((res) => {
    // console.log('获取到的schematic列表:', res);
    if (res.data.code === 0) {
      schematicList.value = res.data.data.items;
      // console.log('schematicList:', schematicList.value);
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  }).catch((error) => {
    console.error('获取schematic列表失败:', error);
  });
}

querySchematics()

const changeViewList = (value: any) => {
  schematicList.value = [];
  querySchematics(value)
};

</script>
<template>
  <StrippedBirchLogBackground>
    <div class="main">
      <div class="nav">
        <div class="title">资源中心</div>
        <MCRouterLink :length="'short'" to="/" class="back">
          返回
        </MCRouterLink>
      </div>
      <div class="content">
        <div class="top scroll-hidden">
          <UploadSchematic></UploadSchematic>
          <MCSegmentedControl :data="schematicTypes" v-model="selectedValue" @change="changeViewList"
            class="segmented-control">
          </MCSegmentedControl>
        </div>
        <TransitionGroup name="stagger" tag="ul" class="list y-scroll">
          <li class="schematic" :key="item.name" v-for="item in schematicList">
            <div class="name">{{ item.name }} <span class="author">{{ item.uploader }}</span></div>
            <div class="tags">
              <span class="tag">{{ item.gameVersion }}</span>
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
              <span class="tag">下载量：{{ item.downloadCount }}</span>
            </div>
          </li>
        </TransitionGroup>
        <div class="paginate">
          <div class="no-results" v-if="schematicList.length === 0">还没有相关类型的投影</div>
          <div class="last"></div>
          <div class="text">第{{ getSchematicsParams.page }}页 每页{{
            getSchematicsParams.per_page }}项</div>
          <div class="next"></div>
        </div>
        <img class="avatar" :src="avatar"></img>
        <div class="shelf"></div>
      </div>
    </div>
  </StrippedBirchLogBackground>
</template>
<style scoped>
@keyframes titleIn {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes titleOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
}

@keyframes shelfIn {
  0% {
    transform: translateX(0);
    /* opacity: 0; */
  }

  100% {
    transform: translateX(100px);
    /* opacity: 1; */
  }
}

@keyframes shelfOut {
  0% {
    transform: translateX(100px);
    /* opacity: 1; */
  }

  100% {
    transform: translateX(0);
    /* opacity: 0; */
  }
}

.stagger-enter-active {
  transition: all 0.5s ease;
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* 给前 10 个元素分别加上递增的延迟，每个延迟 0.1 秒 */
.stagger-enter-active:nth-child(1) {
  transition-delay: 0.1s;
}

.stagger-enter-active:nth-child(2) {
  transition-delay: 0.2s;
}

.stagger-enter-active:nth-child(3) {
  transition-delay: 0.3s;
}

.stagger-enter-active:nth-child(4) {
  transition-delay: 0.4s;
}

.stagger-enter-active:nth-child(5) {
  transition-delay: 0.5s;
}



.main {
  width: calc(100% - 40px);
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  height: calc(100vh - 40px);
  overflow: hidden;

  .nav {
    display: flex;
    justify-content: space-between;
  }

  .nav .title {
    width: 160px;
    height: 100px;
    background-image: url(/src/assets/images/vanilla_gui/block/oak_sign.png);
    background-size: 160px 160px;
    background-repeat: no-repeat;
    image-rendering: pixelated;
    position: relative;
    top: -20px;
    filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.3));

    font-size: var(--title-font-size-medium);
    user-select: none;
    color: #fff;
    padding-top: 90px;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

    animation: titleIn ease-out 0.5s 0.1s backwards;
  }

  .nav .title:hover {
    animation: titleOut ease-in-out 0.5s 0.1s forwards;
  }

  .nav .back {
    margin-top: 30px;
  }

  .content {
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 10px;
      overflow-x: auto;

      .segmented-control {
        display: flex;
        gap: 10px;
      }
    }

    .list {
      width: calc(100% + 8px);
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: calc(100vh - 380px);
      overflow-y: auto;
      padding-bottom: 20px;
    }
  }
}

.schematic {
  /* width: 100%; */
  min-height: 100px;
  background-image: url(/src/assets/images/vanilla_gui/block/stripped_oak_log_rt.png);
  background-size: 100px 100px;
  background-repeat: repeat;
  image-rendering: pixelated;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  margin-right: 10px;

  .name {
    margin-top: 10px;
    margin-left: 10px;
    font-size: var(--title-font-size-medium);
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    user-select: none;

    .author {
      font-size: var(--title-font-size-small);
      color: #eee;
      padding-left: 5px;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .tag {
    background-color: rgba(255, 255, 255, 0.3);
    color: #333;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
  }
}

.schematic:hover {
  box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.7);
}

.paginate {
  --button-width: 30px;

  display: flex;
  justify-content: center;

  position: relative;
  margin-top: 20px;

  .no-results {
    position: absolute;
    top: -250px;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--title-font-size-medium);
  }

  .text {
    text-align: center;
    color: #fff;
    font-size: var(--title-font-size-small);
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    line-height: var(--button-width);
    position: relative;
    top: 1px;
    user-select: none;
  }

  .last {
    height: var(--button-width);
    width: var(--button-width);
    background-image: url(/src/assets/images/rainbow_pixel_gui/unselect.png);
    background-repeat: no-repeat;
  }

  .next {
    height: var(--button-width);
    width: var(--button-width);
    background-image: url(/src/assets/images/rainbow_pixel_gui/select.png);
    background-repeat: no-repeat;
  }

  .last:hover {
    background-image: url(/src/assets/images/rainbow_pixel_gui/unselect_highlighted.png);
  }

  .next:hover {
    background-image: url(/src/assets/images/rainbow_pixel_gui/select_highlighted.png);
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  image-rendering: pixelated;
}

.shelf {
  width: 100px;
  height: 100px;
  background-image: url(/src/assets/images/vanilla_gui/block/bookshelf.png);
  background-size: 100px 100px;
  background-repeat: repeat-x;
  image-rendering: pixelated;
  position: fixed;
  bottom: 0px;
  right: 0px;
  border-radius: 5px;
  box-shadow: 3px 0px 5px rgba(0, 0, 0, 0.5);
  animation: shelfOut ease-out 0.5s 0.5s backwards;
}

.shelf:hover {
  animation: shelfIn ease-in-out 0.5s 0.1s forwards;
}
</style>
