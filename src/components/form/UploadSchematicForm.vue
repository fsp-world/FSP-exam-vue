<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import type { SchematicDetail, UploadSchematicFormData } from '@/types/schematic';
import { schematicTypes } from '@/types/schematic';

import MCButton from '@/components/MCButton.vue';

import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { openAlert } from '@/utils/TsAlert';
import { uploadSchematicAPI, updateSchematicAPI, deleteSchematicAPI } from '@/apis/schematic';


interface Props {
  isModalVisible: boolean
  mode?: 'new' | 'update'
  originData?: SchematicDetail
}

interface Emits {
  (e: 'update:isModalVisible', value: boolean): void
  (e: 'refresh'): void
  (e: 'delete'): void
}

const props = withDefaults(defineProps<Props>(), {
  isModalVisible: false,
  mode: 'new'
})

const emit = defineEmits<Emits>()

const store = useUserStore();
const { username } = storeToRefs(store);
const fileInputRef = useTemplateRef('fileInputRef');

const getDefaultSchematic = (): UploadSchematicFormData => {
  if (props.originData && props.mode === 'update') {

    const public_ = props.originData.isPublic ? 'true' : 'false'
    return {
      id: String(props.originData.id),
      name: props.originData.name,
      originalAuthor: props.originData.originalAuthor,
      isPublic: public_,
      type: String(props.originData.type),
      desc: props.originData.description,
      gameVersion: props.originData.gameVersion,
      uploadFileName: '',
      uploadFile: null,
      tags: props.originData.tags.join(' '),
      backupLink: props.originData.backupLink,
    }
  }
  return {
    name: '',
    originalAuthor: '',
    isPublic: 'false',
    type: '0',
    desc: '',
    gameVersion: '',
    uploadFileName: '',
    uploadFile: null,
    tags: '',
    backupLink: '',
  }
}

const schematic = ref<UploadSchematicFormData>(getDefaultSchematic())

const init = () => {
  schematic.value = getDefaultSchematic()
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
  if (props.mode === 'new') {
    if (!schematic.value.uploadFile) {
      openAlert('请选择投影文件')
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
  }

  if (!schematic.value.name.trim()) {
    openAlert('投影名称不能为空')
    return false
  }

  if (schematic.value.name.length > 25) {
    openAlert('投影名称不能超过25个字符');
    return false;
  }

  if (!schematic.value.gameVersion.trim()) {
    openAlert('兼容版本不能为空')
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
  init()
  emit('update:isModalVisible', false)
}

const uploadSchematic = () => {
  if (!checkFormData()) return

  const apiCall = props.mode === 'update' ? updateSchematicAPI : uploadSchematicAPI;

  apiCall(schematic.value).then((res) => {
    if (res.data.code === 0) {
      openAlert(res.data.desc);
      emit('refresh')
      cancel();
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  });
}

const deleteSchematic = () => {
  const confirmDelete = confirm('确定要删除这个投影吗，你将失去它，很久，很久...');
  if (confirmDelete && schematic.value.id) {
    deleteSchematicAPI(Number(schematic.value.id)).then((res) => {
      if (res.data.code === 0) {
        openAlert(res.data.desc);
        emit('delete')
        cancel();
      } else {
        openAlert(res.data.desc, 'warn-card');
      }
    });
  }
}
</script>
<template>
  <form>
    <table class="table">
      <caption class="title">{{ props.mode === 'update' ? '编辑' : '上传' }}投影</caption>
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
              <option :key="item.data" :value="item.data" v-for="item in schematicTypes">{{ item.label }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="label required">投影权限</td>
          <td class="permission">
            <label>公开</label><input v-model="schematic.isPublic" value="true" name="isPublic" type="radio">
            <label>私密</label><input v-model="schematic.isPublic" value="false" name="isPublic" type="radio">
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
      <MCButton v-if="props.mode === 'update'" :length="'medium'" @click="deleteSchematic"><span
          style="color: red;">删除</span></MCButton>
      <MCButton :length="'medium'" @click="cancel">取消</MCButton>
      <MCButton :length="'medium'" @click="uploadSchematic">上传</MCButton>
    </div>
  </form>
</template>
<style scoped>
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
    background-color: #fff;
    margin: 3px;
  }

  select {
    padding: 5px;
    border-radius: 3px;
    width: 100%;
    background-color: #fff;
    margin: 3px;
  }

  .permission {
    display: flex;
    gap: 5px;
    height: var(--hei);
    line-height: var(--hei);
    width: 200px;
    padding-left: 5px;
  }

  .desc {
    padding: 5px;
    border-radius: 3px;
    width: 100%;
    height: 100px;
    resize: none;
    background-color: #fff;
    margin: 3px;
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
