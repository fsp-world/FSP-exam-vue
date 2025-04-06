<script setup>
import { ref } from 'vue';
import { getSurveys } from '@/apis/admin';
import EditExam from './EditExam.vue';
import SetSurveyMetaData from './SetSurveyMetaData.vue';

const toggleSetSurveyMetaData = ref(false);

const surveysData = ref({
  code: -1,
  list: [],
  desc: '',
});

const flag = ref(false);
const sid = ref(0);

const _getSurveys = () => {
  getSurveys().then((res) => {
    surveysData.value = res.data;
  });
};

const editSurvey = (id) => {
  flag.value = true;
  sid.value = id;
};

_getSurveys();
</script>

<template>
  <EditExam v-if="flag" :sid="sid" @close="flag = false" @flush="_getSurveys"></EditExam>
  <SetSurveyMetaData :mode="'set'" v-model="toggleSetSurveyMetaData" @on-edit="_getSurveys"></SetSurveyMetaData>

  <div v-if="!flag">
    <h1 style="user-select: none">问卷管理</h1>
    <hr />
    <ul class="survey-list">
      <li class="survey" v-if="!surveysData.list.length">暂无数据</li>
      <li class="survey" v-for="i in surveysData.list" :key="i.id">
        <p class="name">
          {{ i.name }}
        </p>
        <p class="desc">问卷描述：{{ i.description }}</p>
        <div class="bot">
          <div v-show="i.status === 1" class="button mount">已应用</div>
          <div v-show="i.status === 0" class="button umount">未应用</div>
          <button type="button" class="button hover edit" @click="editSurvey(i.id)">编辑问卷</button>
        </div>
      </li>
      <button type="button" class="survey hover add" @click="toggleSetSurveyMetaData = true">新建问卷</button>
    </ul>
  </div>
</template>

<style scoped>
.button {
  font-size: 16px;
  padding: 5px 8px;
  border-radius: 5px;
  background-color: #ccc;
  user-select: none;
}

.survey-list {
  width: 100%;
}
.survey {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-top: 10px;
  background-color: #dcdbdb69;
  .name {
    font-size: 24px;
    font-weight: bold;
  }
  .desc {
    font-size: 18px;
    line-height: 1.5em;
  }

  .bot {
    padding-top: 5px;
    display: flex;
    gap: 8px;
  }
  .mount {
    background-color: #ccffcc;
    border: 1px solid #ddd;
  }
  .umount {
    background-color: #ccc;
    border: 1px solid #ddd;
  }
  .edit {
    border: 1px solid #ddd;
  }
}
.hover:hover {
  background-color: #999;
}
.add {
  width: 100%;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
</style>
