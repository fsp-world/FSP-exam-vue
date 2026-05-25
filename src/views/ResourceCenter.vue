<script lang="ts" setup>
import { ref } from 'vue'
import type { Schematic } from '@/types';
import UploadSchematic from '@/components/UploadSchematic.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import StrippedBirchLogBackground from '@/components/background/StrippedBirchLogBackground.vue';
import MCSegmentedControl from '@/components/MCSegmentedControl.vue';

const schematicList: Schematic[] = [
  {
    fileName: '全无品',
    size: '4KB',
    type: 'redstone',
    author: 'Sakurashido',
    originalAuthor: 'Busypacket',
    uploadDate: '11',
    EditDate: '11',
    desc: '描述',
    isPublic: true,
    downloadVolume: 114514,
    gameVersion: '1.21',
    tags: ['标签1', '标签2']
  },
  {
    fileName: '熔炉组',
    size: '1KB',
    type: 'redstone',
    author: 'tangsu99',
    originalAuthor: 'Busypacket',
    uploadDate: '11',
    EditDate: '11',
    desc: '描述',
    isPublic: true,
    downloadVolume: 114514,
    gameVersion: '1.21',
    tags: ['标签1', '标签2']
  },
  {
    fileName: '教堂',
    size: '4KB',
    type: 'architecture',
    author: 'packet',
    originalAuthor: 'Busypacket',
    uploadDate: '11',
    EditDate: '11',
    desc: '描述',
    isPublic: false,
    downloadVolume: 114514,
    gameVersion: '1.21',
    tags: ['标签1', '标签2']
  }
]

const filterButtonList = [
  { label: '红石', value: 'redstone', default: true },
  { label: '建筑', value: 'architecture' },
  { label: '其他', value: 'other' }
]

const selectedValue = ref('')
const changeViewList = (value: any) => {
  // console.log('选中的值:', value);
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
          <MCSegmentedControl :data="filterButtonList" v-model="selectedValue" @change="changeViewList"
            class="segmented-control">
          </MCSegmentedControl>
        </div>
        <ul class="list">
          <li class="schematic" v-for="item in schematicList">
            <div class="name">{{ item.fileName }}</div>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </li>
        </ul>
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

.main {
  width: calc(100% - 40px);
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  height: calc(100vh - 40px);
  overflow-x: hidden;

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
    /* font-weight: bold; */
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
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 10px 0;
      /* background-color: #eee; */
    }
  }

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
  left: 0px;
  border-radius: 5px;
  box-shadow: 3px 0px 5px rgba(0, 0, 0, 0.5);

}

.schematic {
  width: 100%;
  height: 100px;
  background-image: url(/src/assets/images/vanilla_gui/block/stripped_oak_log_rt.png);
  /* clip-path: inset(38px 0 0 0); */
  background-size: 100px 100px;
  background-repeat: repeat;
  image-rendering: pixelated;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  /* filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.3)); */
  position: relative;

  .name {
    margin-top: 10px;
    margin-left: 10px;
    font-size: var(--title-font-size-medium);
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    user-select: none;
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
    background-color: #ccc;
    color: #333;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 14px;
  }
}
</style>
