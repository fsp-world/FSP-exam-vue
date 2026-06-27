<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { openAlert } from '@/utils/TsAlert';
import { compressionFile } from '@/utils/imageCompression';
import request from '@/utils/requers';
import MCButton from '@/components/MCButton.vue';

const props = defineProps<{
  isModalVisible: boolean;
}>();

const emit = defineEmits<{
  'update:is-modal-visible': [value: boolean];
}>();

const userStore = useUserStore();
const { background } = storeToRefs(userStore);

const bgFileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const defaultBgUrl = '/src/assets/images/bg.jpg';

const presetBackgrounds = [
  { name: '默认', url: defaultBgUrl },
  { name: '樱花', url: '/src/assets/images/bg_sakura.jpg' },
  { name: '夜晚', url: '/src/assets/images/bg_night.jpg' },
  { name: '下界', url: '/src/assets/images/bg_nether.jpg' },
];

const setPresetBg = (url: string) => {
  userStore.setBackground(url).then((res: any) => {
    if (res.data.code === 0) {
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
    const compressedFile = await compressionFile(file as File, 'image/jpeg');
    const formData = new FormData();
    formData.append('file', compressedFile);

    const res = await request.post('/user/uploadBackground', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.code === 0) {
      await userStore.setBackground(res.data.data.url);
      openAlert('自定义背景设置成功');
      emit('update:is-modal-visible', false);
    } else {
      openAlert('上传失败：' + res.data.desc);
    }
  } catch (error) {
    console.error(error);
    openAlert('上传失败');
  } finally {
    uploading.value = false;
    if (bgFileInput.value) bgFileInput.value.value = '';
  }
};

const resetBackground = () => {
  userStore.setBackground(defaultBgUrl).then((res: any) => {
    if (res.data.code === 0) {
      openAlert('已恢复默认背景');
      emit('update:is-modal-visible', false);
    }
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
    <div class="bg-upload">
      <p class="bg-section-label">自定义上传</p>
      <input ref="bgFileInput" type="file" accept="image/*" style="display: none" @change="handleBgFileUpload" />
      <MCButton :disabled="uploading" @click="bgFileInput?.click()">
        {{ uploading ? '上传中...' : '选择图片上传' }}
      </MCButton>
    </div>
    <div class="bg-actions">
      <MCButton @click="resetBackground">恢复默认</MCButton>
      <MCButton @click="emit('update:is-modal-visible', false)">取消</MCButton>
    </div>
  </div>
</template>

<style scoped>
.bg-settings {
  padding: 10px;
  color: #fff;
}

.bg-settings-title {
  font-size: var(--title-font-size-medium);
  text-align: center;
  padding-bottom: 16px;
}

.bg-section-label {
  font-size: var(--text-font-size-medium);
  padding-bottom: 8px;
  opacity: 0.8;
}

.bg-preset-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.bg-preset-item {
  width: 100px;
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

.bg-upload {
  padding-bottom: 16px;
}

.bg-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
