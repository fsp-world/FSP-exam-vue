<script lang="ts" setup>
import { type Schematic } from '@/types';
import UploadSchematic from '@/components/UploadSchematic.vue';
import MCButton from '@/components/MCButton.vue';

const schematicTypes = [
  'redstone', 'architecture', 'abstract'
]

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
    gameVersion: '1.21'
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
    gameVersion: '1.21'
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
    gameVersion: '1.21'
  }
]
</script>
<template>
  <div class="bg">
    <div class="grass bga"></div>
    <div class="dirt1 bga"></div>
    <div class="dirt2 bga"></div>
    <div class="dirt3 bga"></div>
    <div class="dirt4 bga"></div>
    <div class="dirt5 bga"></div>
  </div>
  <div class="main">
    <div class="nav">
      <h1>资源中心</h1>
    </div>
    <div class="content">
      <div class="top">
        <UploadSchematic></UploadSchematic>
        <div class="buttons">
          <MCButton class="button">红石</MCButton>
          <MCButton class="button">建筑</MCButton>
          <MCButton class="button">抽象</MCButton>
        </div>
      </div>
      <ul class="list">
        <li class="schematic" v-for="item in schematicList">{{ item.fileName }}</li>
      </ul>


    </div>
  </div>
</template>
<style scoped>
.main {
  width: calc(100% - 40px);
  padding: 20px;

  .nav {
    border-bottom: 5px solid #eee;
    margin-bottom: 10px;
  }

  .content {
    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 10px;

      .buttons {
        display: flex;
        gap: 10px;

        .button {
          height: 50px;
          padding: 0px 10px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 5px;
          font-size: 18px;
          min-width: 80px;
        }
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

.bg {
  width: 100%;
  height: 100vh;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.9;
  z-index: -1;

  .bga {
    --block-hei: 130px;
    width: 100%;
    image-rendering: pixelated;
    position: absolute;
    background-repeat: repeat;
    background-size: var(--block-hei) var(--block-hei);
  }

  .grass {
    background-image: url(/src/assets/images/vanilla_gui/block/grass_block_side.png);
    top: 0;
    z-index: 1;
    height: var(--block-hei);
  }

  .dirt1 {
    background-image: url(/src/assets/images/vanilla_gui/block/dirt.png);
    top: var(--block-hei);
    z-index: 0;
    height: var(--block-hei);
  }

  .dirt2 {
    background-image: url(/src/assets/images/vanilla_gui/block/dirt.png);
    top: var(--block-hei);
    z-index: 0;
    height: calc(var(--block-hei) * 2);
  }

  .dirt3 {
    background-image: url(/src/assets/images/vanilla_gui/block/dirt.png);
    top: var(--block-hei);
    z-index: 0;
    height: calc(var(--block-hei) * 3);
  }

  .dirt4 {
    background-image: url(/src/assets/images/vanilla_gui/block/dirt.png);
    top: var(--block-hei);
    z-index: 0;
    height: calc(var(--block-hei) * 4);
  }

  .dirt5 {
    background-image: url(/src/assets/images/vanilla_gui/block/dirt.png);
    top: var(--block-hei);
    z-index: 0;
    height: calc(var(--block-hei) * 5);
  }
}
</style>
