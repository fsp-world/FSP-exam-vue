<script lang="ts" setup>
import type { Schematic } from '@/types';
import UploadSchematic from '@/components/UploadSchematic.vue';
import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import GrassAndDirtBackground from '@/components/background/GrassAndDirtBackground.vue';

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
          <div class="buttons">
            <MCButton :length="'short'" class="button">红石</MCButton>
            <MCButton :length="'short'" class="button">建筑</MCButton>
            <MCButton :length="'short'" class="button">其他</MCButton>
          </div>
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

      .buttons {
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
