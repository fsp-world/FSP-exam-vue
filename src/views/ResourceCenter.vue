<script lang="ts" setup>
import { ref } from 'vue'
import type { Schematic } from '@/types';
import UploadSchematic from '@/components/UploadSchematic.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import GrassAndDirtBackground from '@/components/background/GrassAndDirtBackground.vue';
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
  <GrassAndDirtBackground>
    <div class="main">
      <div class="nav">
        <h1>资源中心</h1>
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
          <li class="schematic" v-for="item in schematicList">{{ item.fileName }}</li>
        </ul>
      </div>
    </div>
  </GrassAndDirtBackground>
</template>
<style scoped>
.main {
  width: calc(100% - 40px);
  padding: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  height: calc(100vh - 40px);
  background-color: rgba(255, 255, 255, 0.4);
  overflow-x: hidden;

  .nav {
    border-bottom: 5px solid #eee;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }

  .nav .back {
    margin-top: 20px;
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
      gap: 10px;
      padding: 10px 0;
      /* background-color: #eee; */
    }
  }
}

.schematic {
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
}
</style>
