<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { openAlert } from '@/utils/TsAlert';
import { compressionFile } from '@/utils/imageCompression';
import MCButton from '@/components/MCButton.vue';

import defaultBg1 from '@/assets/images/default-bg-1.jpg';
import defaultBg2 from '@/assets/images/default-bg-2.jpeg';

const getCode = (res: any) => res?.data?.code ?? res?.code;

const props = defineProps<{
  isModalVisible: boolean;
}>();

const emit = defineEmits<{
  'update:is-modal-visible': [value: boolean];
}>();

const userStore = useUserStore();
const { background } = storeToRefs(userStore);

const bgFileInputRef = useTemplateRef('bgFileInputRef');
const uploading = ref(false);

const presetBackgrounds = [
  { name: '默认', url: defaultBg1 },
  { name: '草地', url: defaultBg2 },
];

const setPresetBg = (url: string) => {
  userStore.setBackground(url).then((res: any) => {
    const code = getCode(res);
    if (code === 0) {
      openAlert('背景修改成功');
      emit('update:is-modal-visible', false);
    } else {
      openAlert('背景修改失败！');
    }
  });
};

const handleBgFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploading.value = true;
  try {
    // 压缩图片
    const compressedFile = await compressionFile(file as File, 'image/jpeg');
    // 转 base64 data URL
    const dataUrl = await fileToDataURL(compressedFile);

    const res = await userStore.setBackground(dataUrl);
    const code = getCode(res);
    if (code === 0) {
      openAlert('自定义背景设置成功');
      emit('update:is-modal-visible', false);
    } else {
      openAlert('背景修改失败！');
    }
  } catch (error) {
    console.error(error);
    openAlert('上传失败');
  } finally {
    uploading.value = false;
    if (bgFileInputRef.value) bgFileInputRef.value.value = '';
  }
};

const fileToDataURL = (file: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


</script>

<template>
  <div class="bg-settings">
    <p class="bg-settings-title">自定义背景</p>
    <div class="bg-presets">
      <p class="bg-section-label">预设背景</p>
      <div class="bg-preset-list">
        <div v-for="item in presetBackgrounds" :key="item.name" class="bg-preset-item"
          :class="{ active: item.url === background }" @click="setPresetBg(item.url)">
          <div class="bg-preset-thumb" :style="{ backgroundImage: `url('${item.url}')` }"></div>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="bg-actions">
      <input ref="bgFileInputRef" type="file" accept="image/*" style="display: none" @change="handleBgFileUpload" />
      <MCButton :length="'medium'" :disabled="uploading" @click="bgFileInputRef?.click()">
        {{ uploading ? '上传中...' : '自定义背景' }}
      </MCButton>
      <MCButton :length="'medium'" @click="emit('update:is-modal-visible', false)">取消</MCButton>
    </div>
  </div>
</template>

<style scoped>
.bg-settings {
  padding: 10px;
  /* color: #fff; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
}

.bg-settings-title {
  font-size: var(--title-font-size-medium);
  user-select: none;
  text-align: center;
  padding-bottom: 16px;
}

.bg-section-label {
  font-size: var(--text-font-size-medium);
  padding-bottom: 8px;
  opacity: 0.8;
  user-select: none;
  text-align: center;
}

.bg-preset-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 16px;
  justify-content: center;
}

.bg-preset-item {
  width: 114px;
  cursor: pointer;
  text-align: center;
  border-radius: 6px;
  padding: 6px;
  transition: background 0.2s;
}

.bg-preset-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.bg-preset-item.active {
  background: rgba(79, 192, 141, 0.3);
  outline: 2px solid #4fc08d;
}

.bg-preset-thumb {
  width: 100px;
  height: 60px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  margin-bottom: 4px;
}


.bg-actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
  justify-content: center;

  button {
    width: 100%;
  }
}
</style>
