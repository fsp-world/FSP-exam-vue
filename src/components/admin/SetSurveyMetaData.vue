<script setup lang="ts">
import { ref, watch } from 'vue';
import { addSurvey, modSurveyMetaData } from '@/apis/admin';

import { openAlert } from '@/utils/TsAlert';

interface Props {
  sid?: number;
  mode: 'add' | 'set';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
});

const emit = defineEmits(['onEdit']);

const toggleForm = defineModel();

const formData = ref({
  sid: props.mode === 'set' ? props.sid : undefined,
  name: '',
  description: '',
});
const cancel = () => {
  toggleForm.value = false;
};

const handleResponse = (res: any) => {
  if (res.data.code === 0) {
    toggleForm.value = !toggleForm.value;
    openAlert(res.data.desc);
    emit('onEdit');
  } else {
    openAlert(res.data.desc);
  }
};

const submitMetaData = () => {
  if (formData.value.sid) {
    modSurveyMetaData(formData.value).then(handleResponse);
  } else {
    addSurvey(formData.value).then(handleResponse);
  }
};

watch(
  () => toggleForm.value,
  () => {
    formData.value.name = '';
    formData.value.description = '';
  },
);
</script>
<template>
  <div class="form" v-if="toggleForm">
    <p>设置问卷信息</p>
    <input required v-model="formData.name" type="text" class="input-name" placeholder="问卷名称" />
    <input required v-model="formData.description" type="text" class="input-description" placeholder="问卷描述" />
    <div class="menu">
      <button type="button" class="cancel" @click="cancel">取消</button>
      <button type="button" class="submit" @click="submitMetaData">提交</button>
    </div>
  </div>
</template>
<style scoped>
.form {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 260px;
  background-color: #eee;
  border-radius: 5px;
  box-shadow: 10px 10px 5px #888888;
  z-index: 100;
  padding: 30px 10px;
  p {
    text-align: center;
    font-size: 26px;
    font-weight: bold;
    padding: 20px;
    user-select: none;
  }
  input {
    font-size: 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px;
    margin-bottom: 8px;
    width: calc(100% - 10px);
  }
  .menu {
    display: flex;
    gap: 10px;
    .cancel,
    .submit {
      flex: 1;
      font-size: 20px;
      border-radius: 5px;
      text-align: center;
      line-height: 2em;
      background-color: #ccc;
      user-select: none;
    }
    .cancel:hover,
    .submit:hover {
      background-color: #888;
    }
  }
}
@media (max-width: 800px) {
  .form {
    width: calc(100% - 30px);
  }
}
</style>
