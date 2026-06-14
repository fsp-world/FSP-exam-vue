<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { SchematicBrief, GetSchematicsParams, SchematicsResponse, SchematicType } from '@/types/schematic';

import { schematicTypes } from '@/types/schematic';

import StrippedBirchLogBackground from '@/components/background/StrippedBirchLogBackground.vue';
import UploadSchematicForm from '@/components/form/UploadSchematicForm.vue';

import MCButton from '@/components/MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';
import MCSegmentedControl from '@/components/MCSegmentedControl.vue';
import MCDialog from '@/components/MCDialog.vue';
import MCNameTag from '@/components/MCNameTag.vue';

import { getSchematicsByTypeAPI, getSchematicsBySearchAPI } from '@/apis/schematic';
import { openAlert } from '@/utils/TsAlert';

import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import SchematicInfoDetail from '@/components/SchematicInfoDetail.vue';


const store = useUserStore();
const { avatar } = storeToRefs(store);

const schematicList = ref<SchematicBrief[]>([]);
const selectedValue = ref<SchematicType>(1)
const fetchingData = ref(true)
const searchText = ref('')

const isUploadSchematicVisible = ref(false)
const isSchematicDetailVisible = ref(false)

const pagination = reactive({
  page: 1,
  pages: 0,
  total: 0,
  hasNext: false,
  hasPrev: false,
})

const getSchematicsParams: GetSchematicsParams = {
  method: 'type',
  text: '',
  type: 1,
  page: 1,
  per_page: 10
}

const querySchematics = (queryMethod: 'type' | 'search') => {
  if (queryMethod === 'search') {
    if (searchText.value.trim() == '') {
      queryMethod = 'type'
    } else {
      getSchematicsParams.text = searchText.value.trim()
    }
  }

  fetchingData.value = true

  if (selectedValue.value !== getSchematicsParams.type || queryMethod !== getSchematicsParams.method) {
    getSchematicsParams.type = selectedValue.value
    getSchematicsParams.method = queryMethod
    getSchematicsParams.page = 1
    pagination.page = 1
    pagination.pages = 0
    pagination.total = 0
    pagination.hasNext = false
    pagination.hasPrev = false
  } else {
    getSchematicsParams.page = pagination.page
  }

  const apiCall = queryMethod === 'type' ? getSchematicsByTypeAPI : getSchematicsBySearchAPI;

  apiCall(getSchematicsParams).then((res: SchematicsResponse) => {
    if (res.data.code === 0) {
      const { items, page, pages, total, has_next, has_prev } = res.data.data
      schematicList.value = items
      pagination.page = page
      pagination.pages = pages
      pagination.total = total
      pagination.hasNext = has_next
      pagination.hasPrev = has_prev
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  }).catch((error) => {
    console.error('获取投影列表失败:', error);
    openAlert('获取投影列表失败', 'warn-card')
  }).finally(() => {
    fetchingData.value = false
  })
}

const querySchematicId = ref(0)
const showSchematicDetail = (id: number) => {
  querySchematicId.value = id
  isSchematicDetailVisible.value = true
}

const handleDeleteSchematic = (sid: number) => {
  schematicList.value = schematicList.value.filter(item => item.id !== sid);
}

querySchematics('type')

</script>
<template>
  <MCDialog :style="'card'" v-model:isModalVisible="isUploadSchematicVisible">
    <UploadSchematicForm v-model:isModalVisible="isUploadSchematicVisible"></UploadSchematicForm>
  </MCDialog>
  <MCDialog class="detail" :style="'book'" :resizeX="1.3" :resizeY="1.3"
    v-model:isModalVisible="isSchematicDetailVisible">
    <SchematicInfoDetail :sid="querySchematicId" @delete:sid="handleDeleteSchematic"
      v-model:isModalVisible="isSchematicDetailVisible">
    </SchematicInfoDetail>
  </MCDialog>
  <StrippedBirchLogBackground>
    <div class="main">
      <nav class="nav">
        <div class="title">资源中心</div>
        <MCRouterLink :length="'short'" to="/" class="back">
          返回
        </MCRouterLink>
      </nav>
      <div class="content">
        <div class="top scroll-hidden">
          <MCButton :length="'medium'" class="upload-schematic-button" @click="isUploadSchematicVisible = true">
            上传投影
          </MCButton>
          <div class="search">
            <img class="search-icon" src="/src/assets/images/rainbow_pixel_gui/search.png" alt="搜索">
            <input v-model="searchText" @keydown.enter.prevent="querySchematics('search')" type="search"
              class="search-input" />
          </div>
          <MCSegmentedControl :data="schematicTypes" v-model="selectedValue" @change="querySchematics('type')"
            class="segmented-control">
          </MCSegmentedControl>
        </div>
        <div class="no-results" v-if="schematicList.length === 0 && !fetchingData">还没有相关类型的投影</div>
        <TransitionGroup name="stagger" tag="ul" class="list mc-scroll"
          :style="{ '--scrollbar-avatar': `url(${avatar})` }">
          <li class="schematic scroll-hidden" :key="item.id" v-for="item in schematicList"
            @click="showSchematicDetail(item.id)">
            <div class="name">{{ item.name }} <span class="author">{{ item.uploader }}</span></div>
            <div class="author author-mobil">{{ item.uploader }}</div>
            <div class="tags">
              <img v-show="!item.isPublic" class="lock" src="/src/assets/images/rainbow_pixel_gui/locked.png">
              <MCNameTag>{{ item.gameVersion }}</MCNameTag>
              <MCNameTag v-show="tag !== ''" :key="index" v-for="(tag, index) in item.tags">{{ tag }}
              </MCNameTag>
              <MCNameTag>下载量：{{ item.downloadCount }}</MCNameTag>
            </div>
          </li>
        </TransitionGroup>
        <div v-show="pagination.pages > 0" class="paginate">
          <div class="last" :class="{ disabled: !pagination.hasPrev || fetchingData }"
            @click="pagination.hasPrev && !fetchingData && (pagination.page--, querySchematics(getSchematicsParams.method))">
          </div>
          <div class="text">第 {{ pagination.page }} / {{ pagination.pages }} 页</div>
          <div class="next" :class="{ disabled: !pagination.hasNext || fetchingData }"
            @click="pagination.hasNext && !fetchingData && (pagination.page++, querySchematics(getSchematicsParams.method))">
          </div>
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
  }

  100% {
    transform: translateX(100px);
  }
}

@keyframes shelfOut {
  0% {
    transform: translateX(100px);
  }

  100% {
    transform: translateX(0);
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
    position: relative;

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      gap: 10px;
      overflow-x: auto;

      .upload-schematic-button {
        min-width: 120px;
      }
    }

    .segmented-control {
      display: flex;
      gap: 10px;
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

.search {
  position: relative;
  border-bottom: #555 2px solid;
  min-width: 100px;
  display: flex;
  gap: 8px;

  .search-icon {
    width: 25px;
    height: 25px;
    image-rendering: pixelated;
    position: relative;
    bottom: -5px;
    left: 0;
  }

  .search-input {
    background: transparent;
    font-size: var(--title-font-size-small);
  }

  .search-input:focus {
    outline: none
  }
}



.no-results {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  font-size: var(--title-font-size-medium);
}

.schematic {
  min-height: 100px;
  background-image: url(/src/assets/images/vanilla_gui/block/stripped_oak_log_rt.png);
  background-size: 100px 100px;
  background-repeat: repeat;
  image-rendering: pixelated;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  position: relative;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: scroll;

  .name {
    padding-top: 15px;
    padding-left: 10px;
    font-size: var(--title-font-size-medium);
    color: #333;
  }

  .author {
    font-size: var(--title-font-size-small);
    color: #444;
    padding-left: 5px;
  }

  .author-mobil {
    display: none;
  }

  .tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 30px;
    padding: 10px;
    margin-left: 8px;
    height: 30px;
  }

  .lock {
    width: 22px;
    margin-right: -15px;
    user-select: none;
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

  .disabled {
    display: none;

  }
}

.detail :deep(.normal) {
  display: flex;
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

.mc-scroll::-webkit-scrollbar {
  width: 32px;
  background-color: transparent;
  background-image: url('/src/assets/images/vanilla_gui/item/ladder.png');
  background-repeat: repeat-y;
  background-size: 32px;
  image-rendering: pixelated;
}

.mc-scroll::-webkit-scrollbar-thumb {
  background-image: var(--scrollbar-avatar);
  background-repeat: no-repeat;
  background-size: 32px;
  background-position: center;
  image-rendering: pixelated;
}

@media screen and (max-width: 500px) {
  .schematic {
    min-height: 130px;
    background-size: 130px 130px;

    .author {
      display: none;
    }

    .author-mobil {
      display: block;
      padding-left: 15px;
    }
  }
}
</style>
