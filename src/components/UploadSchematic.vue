<script setup lang="ts">
import MCButton from './MCButton.vue';
import type { UploadSchematicFormData } from '@/types';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { openAlert } from '@/utils/TsAlert';
import { uploadSchematic, getSchematics } from '@/apis/schematic';

const store = useUserStore();
const { username } = storeToRefs(store);
const displayCard = ref<boolean>(false)
const fileInputRef = ref<HTMLInputElement | null>(null);
const fileName = ref<string>('');

const schematicTypes = [
  { displayName: '红石', name: 'redstone' },
  { displayName: '建筑', name: 'architecture' },
  { displayName: '其他', name: 'other' }
]

const getDefaultSchematic = (): UploadSchematicFormData => ({
  fileName: '',
  originalAuthor: '',
  isPublic: 'false',
  type: '',
  desc: '',
  gameVersion: '',
  uploadFile: null,
  tags: '',
})

const schematic = ref<UploadSchematicFormData>(getDefaultSchematic())

const init = () => {
  schematic.value = getDefaultSchematic()
  fileName.value = ''
}

const upload = () => {
  displayCard.value = true
}

const openFileSelector = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileSelect = (event: any) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    if (selectedFile.name.toLowerCase().endsWith('.litematic')) {
      fileName.value = selectedFile.name;
      schematic.value.fileName = selectedFile.name;
      schematic.value.uploadFile = selectedFile
    } else {
      alert('请选择 .litematic 格式的文件');
      fileName.value = '';
      event.target.value = '';
    }
  }
};

const checkFormData = (): boolean => {
  if (!schematic.value.uploadFile) {
    openAlert('请选择投影文件')
    return false
  }

  if (!schematic.value.fileName.trim()) {
    openAlert('文件名不能为空')
    return false
  }

  if (!schematic.value.fileName.endsWith('.litematic')) {
    openAlert('文件后缀名不符')
    return false
  }

  const invalidChars = /[\\/:*?"<>|]/;
  if (invalidChars.test(schematic.value.fileName)) {
    openAlert('文件名不能包含以下字符: \\ / : * ? " < > |');
    return false;
  }

  if (schematic.value.fileName.length > 25) {
    openAlert('文件名不能超过25个字符');
    return false;
  }

  if (!schematic.value.gameVersion.trim()) {
    openAlert('游戏版本不能为空')
    return false
  }

  if (!schematic.value.type.trim()) {
    openAlert('类型不能为空')
    return false
  }

  const tagsArray = schematic.value.tags.trim().split(/\s+/);
  if (tagsArray.length > 5) {
    openAlert('标签数量不能超过5个')
    return false
  }

  if (!['true', 'false'].includes(schematic.value.isPublic)) {
    openAlert('公开状态格式错误')
    return false
  }

  if (!schematic.value.originalAuthor?.trim()) {
    schematic.value.originalAuthor = username.value
  }

  return true
}

const cancel = () => {
  displayCard.value = false
  init()
}

const confirmUpload = () => {
  // console.log(schematic.value)

  if (!checkFormData()) {
    return
  }

  uploadSchematic(schematic.value).then((res) => {
    if (res.data.code === 0) {
      openAlert(res.data.desc);
      cancel()
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  })
}

</script>
<template>
  <MCButton :length="'medium'" class="show-card-button" @click="upload">上传投影</MCButton>
  <form v-if="displayCard" class="card">
    <table class="table">
      <tbody>
        <tr>
          <td>
            <button type="button" class="select-file" @click="openFileSelector">点击选择投影文件</button>
            <input ref="fileInputRef" type="file" accept=".litematic" @change="handleFileSelect"
              style="display: none;" />
          </td>
          <td>
            <p v-if="fileName">已选择: {{ fileName }}</p>
          </td>
        </tr>
        <tr>
          <td>文件名</td>
          <td>
            <input v-model="schematic.fileName" type="text" placeholder="默认为原文件名">
          </td>
        </tr>
        <tr>
          <td>游戏版本</td>
          <td><input v-model="schematic.gameVersion" type="text" placeholder="例如1.18.2"></td>
        </tr>
        <tr>
          <td>类型</td>
          <td>
            <select v-model="schematic.type">
              <option :key="item.name" :value="item.name" v-for="item in schematicTypes">{{ item.displayName }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>标签</td>
          <td>
            <input v-model="schematic.tags" type="text" placeholder="多个标签用空格分隔, 最多5个标签">
          </td>
        </tr>
        <tr>
          <td>权限</td>
          <td class="permission">
            <label>公开</label><input v-model="schematic.isPublic" value="true" name="isPublic" type="radio">
            <label>私密</label><input checked v-model="schematic.isPublic" value="false" name="isPublic" type="radio">
          </td>
        </tr>
        <tr>
          <td>作者</td>
          <td>
            <input disabled :value="username" type="text" placeholder="默认为上传用户用户名">
          </td>
        </tr>
        <tr>
          <td>原作者</td>
          <td><input v-model="schematic.originalAuthor" type="text" placeholder="不填默认和作者一致"></td>
        </tr>
        <tr>
          <td>描述</td>
          <td><textarea v-model="schematic.desc" class="desc" placeholder="写一些说明和链接"></textarea></td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <MCButton :length="'medium'" @click="cancel">取消</MCButton>
      <MCButton :length="'medium'" @click="confirmUpload">上传</MCButton>
    </div>
  </form>
</template>
<style scoped>
.show-card-button {
  min-width: 120px;
}

.card {
  width: 90%;
  max-width: 900px;
  height: 450px;
  background-image: url('@/assets/images/vanilla_gui/demo_background.png');
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 30px;
  z-index: 10;
  overflow-x: auto;
}

.table {
  --font-size: 15px;
  width: 100%;
  user-select: none;
  font-size: var(--font-size);

  td {
    --hei: 30px;
    height: var(--hei);
  }

  input[type="text"] {
    padding: 3px;
    border-radius: 3px;
    width: 100%;
  }

  select {
    padding: 3px;
    border-radius: 3px;
    width: calc(100% + 6px);
  }

  .permission {
    display: flex;
    gap: 5px;
    height: var(--hei);
    line-height: var(--hei);
    width: 200px
  }

  .desc {
    padding: 3px;
    border-radius: 3px;
    width: 100%;
    height: 100px;
    resize: none;
  }

  .select-file {
    font-size: var(--font-size);
    border-radius: 3px;
    background-color: #ccc;
    color: blue
  }
}

.buttons {
  margin-top: 20px;
  width: 100%;
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
