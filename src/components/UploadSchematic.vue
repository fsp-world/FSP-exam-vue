<script setup lang="ts">
import MCButton from './MCButton.vue';
import type { UploadSchematicFormData } from '@/types';
import { schematicTypes } from '@/types';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { openAlert } from '@/utils/TsAlert';
import { uploadSchematic } from '@/apis/schematic';

const store = useUserStore();
const { username } = storeToRefs(store);
const dialogRef = ref<HTMLDialogElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const getDefaultSchematic = (): UploadSchematicFormData => ({
  name: '',
  originalAuthor: '',
  isPublic: 'false',
  type: '',
  desc: '',
  gameVersion: '',
  uploadFileName: '',
  uploadFile: null,
  tags: '',
  backupLink: '',
})

const schematic = ref<UploadSchematicFormData>(getDefaultSchematic())

const init = () => {
  schematic.value = getDefaultSchematic()
}

const openDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.showModal();
  }
}
const closeDialog = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
    init()
  }

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
      schematic.value.name = selectedFile.name.slice(0, -10);
      schematic.value.uploadFileName = selectedFile.name;
      schematic.value.uploadFile = selectedFile
    } else {
      alert('请选择 .litematic 格式的文件');
      schematic.value.name = '';
      schematic.value.uploadFileName = '';
      event.target.value = '';
    }
  }
};

const checkFormData = (): boolean => {
  if (!schematic.value.uploadFile) {
    openAlert('请选择投影文件')
    return false
  }

  if (!schematic.value.name.trim()) {
    openAlert('投影名称不能为空')
    return false
  }

  if (!schematic.value.uploadFileName.trim()) {
    openAlert('投影文件名不能为空')
    return false
  }

  if (!schematic.value.uploadFileName.endsWith('.litematic')) {
    openAlert('投影文件后缀名不符')
    return false
  }

  const invalidChars = /[\\/:*?"<>|]/;
  if (invalidChars.test(schematic.value.uploadFileName)) {
    openAlert('投影文件名不能包含以下字符: \\ / : * ? " < > |');
    return false;
  }

  if (schematic.value.name.length > 25) {
    openAlert('投影名称不能超过25个字符');
    return false;
  }

  if (!schematic.value.gameVersion.trim()) {
    openAlert('兼容版本不能为空')
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



const confirmUpload = () => {
  if (!checkFormData()) {
    return
  }

  uploadSchematic(schematic.value).then((res) => {
    if (res.data.code === 0) {
      openAlert(res.data.desc);
      closeDialog()
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  })
}

</script>
<template>
  <MCButton :length="'medium'" class="show-card-button" @click="openDialog">上传投影</MCButton>
  <dialog ref="dialogRef" class="dialog">
    <form class="card">
      <table class="table">
        <caption class="title">上传投影</caption>
        <tbody>
          <tr>
            <td class="label required">文件选择</td>
            <td>
              <input type="text" class="selectd-file" @click="openFileSelector" placeholder="点击选择文件"
                v-model="schematic.uploadFileName" readonly />
              <input ref="fileInputRef" type="file" accept=".litematic" @change="handleFileSelect"
                style="display: none;" />
            </td>
          </tr>
          <tr>
            <td class="label required">投影名称</td>
            <td>
              <input v-model="schematic.name" type="text" placeholder="默认为原文件名">

            </td>
          </tr>
          <tr>
            <td class="label required">兼容版本</td>
            <td><input v-model="schematic.gameVersion" type="text" placeholder="例如1.17+"></td>
          </tr>
          <tr>
            <td class="label required">投影类型</td>
            <td>
              <select v-model="schematic.type">
                <option :key="item.value" :value="item.value" v-for="item in schematicTypes">{{ item.label }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="label required">投影权限</td>
            <td class="permission">
              <label>公开</label><input v-model="schematic.isPublic" value="true" name="isPublic" type="radio">
              <label>私密</label><input checked v-model="schematic.isPublic" value="false" name="isPublic" type="radio">
            </td>
          </tr>
          <tr>
            <td class="label">投影标签</td>
            <td>
              <input v-model="schematic.tags" type="text" placeholder="多个标签用空格分隔, 最多5个标签">
            </td>
          </tr>
          <tr>
            <td class="label">上传用户</td>
            <td>
              <input disabled :value="username" type="text" placeholder="默认为上传用户用户名">
            </td>
          </tr>
          <tr>
            <td class="label">原始作者</td>
            <td><input v-model="schematic.originalAuthor" type="text" placeholder="不填默认和作者一致"></td>
          </tr>
          <tr>
            <td class="label">备用链接</td>
            <td><input v-model="schematic.backupLink" type="text" placeholder="填写备用链接，例如百度网盘、蓝奏云"></td>
          </tr>
          <tr>
            <td class="label">投影描述</td>
            <td><textarea v-model="schematic.desc" class="desc" placeholder="写一些说明和链接"></textarea></td>
          </tr>
        </tbody>
      </table>
      <div class="buttons">
        <MCButton :length="'medium'" @click="closeDialog">取消</MCButton>
        <MCButton :length="'medium'" @click="confirmUpload">上传</MCButton>
      </div>
    </form>
  </dialog>
</template>
<style scoped>
.show-card-button {
  min-width: 120px;
}

.dialog {
  padding: 0;
  border: none;
  margin: 0;
  background: transparent;
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
}

.dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.card {
  width: 90%;
  max-width: 700px;
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
  overflow-x: auto;
}

.title {
  font-size: var(--title-font-size-medium);
  font-weight: bold;
  padding-bottom: 12px;
}

.table {
  width: 100%;
  user-select: none;
  font-size: var(--text-font-size-medium);

  p {
    display: inline;
  }

  td {
    --hei: 30px;
    height: var(--hei);
    position: relative;
  }

  .label {
    min-width: 70px;
  }

  input[type="text"] {
    padding: 5px;
    border-radius: 3px;
    width: 100%;
  }

  select {
    padding: 5px;
    border-radius: 3px;
    width: calc(100% + 10px);
  }

  .permission {
    display: flex;
    gap: 5px;
    height: var(--hei);
    line-height: var(--hei);
    width: 200px
  }

  .desc {
    padding: 5px;
    border-radius: 3px;
    width: 100%;
    height: 100px;
    resize: none;
  }

  .required::after {
    content: '*';
    color: red;
    font-size: var(--text-font-size-small);
    position: relative;
    top: -6px;
    left: 2px;
  }
}

.buttons {
  margin-top: 20px;
  margin-bottom: 5px;
  width: 100%;
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
