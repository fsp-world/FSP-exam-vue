<script setup lang="ts">
import { ref } from 'vue';
import { modSurveyMetaData } from '@/apis/admin';

import { useAlertStore } from '@/stores/alert';
import { IalertData } from '@/types';

const alertStore = useAlertStore();
const openAlert = (message: string) => {
  const data: IalertData = {
    title: 'login' + Date(),
    type: 'info-card',
    message: message,
    age: 3000,
    flag: true,
  };
  alertStore.openAlert(data);
};

const { sid, sName, sDesc, sTime } = defineProps({
  sid: {
    type: Number,
    required: true,
  },
  sName: String,
  sDesc: String,
  sTime: String,
});

const emit = defineEmits(['onEdit']);

const toggleForm = ref(false);

const formData = ref({
  sid: sid,
  name: '',
  description: '',
});

const submitMetaData = () => {
  modSurveyMetaData(formData.value).then((res) => {
    if (res.data.code === 0) {
      toggleForm.value = !toggleForm.value;
      openAlert(res.data.desc);
      emit('onEdit');
    } else {
      openAlert(res.data.desc);
    }
  });
};
</script>
<template>
  <div class="survey-meta-data">
    <div class="name">
      <p>
        问卷名称：<span>{{ sName }}</span>
      </p>
      <button type="button" class="edit" @click="toggleForm = !toggleForm">编辑</button>
    </div>
    <div class="description">
      <p>
        问卷描述：<span>{{ sDesc }}</span>
      </p>
    </div>
    <div class="create-time">
      <p>
        创建时间：<span>{{ sTime }}</span>
      </p>
    </div>
    <form v-if="toggleForm">
      <input v-model="formData.name" type="text" class="input-name" placeholder="新问卷名称" />
      <input v-model="formData.description" type="text" class="input-description" placeholder="新问卷描述" />
      <button type="button" class="submit" @click="submitMetaData">提交信息</button>
    </form>
  </div>
</template>
<style scoped>
.survey-meta-data {
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid #000;
  p {
    padding: 5px 0;
  }
  .name {
    font-size: 30px;
    display: flex;
    .edit {
      margin-left: 10px;
      padding: 5px 20px;
      border-radius: 5px;
      font-size: 20px;
      background-color: #eee;
    }
    .edit:hover {
      background-color: #ccc;
    }
  }
  .description,
  .create-time {
    font-size: 16px;
  }
  form {
    width: 350px;
    margin: 5px 0;
    input {
      font-size: 20px;
      border: 1px solid #ccc;
      padding: 5px;
      margin-bottom: 5px;
      width: 100%;
    }
    .submit {
      font-size: 20px;
      border-radius: 5px;
      padding: 5px 10px;
      margin: 0 auto;
      background-color: #eee;
    }
    .submit:hover {
      background-color: #ccc;
    }
  }
}
</style>
