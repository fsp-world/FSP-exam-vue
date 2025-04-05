<script setup>
import { getSurveys, addSurvey } from '@/apis/admin';
import EditExam from './EditExam.vue';
import { ref } from 'vue';

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
_getSurveys();

const createSurvey = () => {
  addSurvey({
    name: prompt('name'),
    description: prompt('description'),
  });
};
</script>

<template>
  <EditExam v-if="flag" :sid="sid" @close="flag = false" @flush="_getSurveys"></EditExam>
  <h1>问卷管理</h1>
  <p><button @click="createSurvey">新建问卷</button></p>
  <hr />
  <div>
    <div class="survey-box" v-for="i in surveysData.list" :key="i.id">
      <h3 class="title">{{ i.name }}</h3>
      <h4 class="lite-title">
        <button
          @click="
            flag = true;
            sid = i.id;
          "
        >
          编辑问卷
        </button>
        创建时间: <span>{{ i.createTime }}</span> 问卷状态:
        <span>{{ i.status }}</span>
      </h4>
      <p class="desc">问卷描述：{{ i.description }}</p>
    </div>
    <p v-if="!surveysData.list.length">暂无数据</p>
  </div>
</template>

<style scoped>
.survey-box button {
  display: inline-block;
}
.survey-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px 0;
  margin-top: 10px;
  background-color: #dcdbdb69;
}
.survey-box .title,
.survey-box .lite-title,
.survey-box .desc {
  margin-left: 16px;
  margin-right: 16px;
}
button {
  font-size: 16px;
  padding: 5px;
  border-radius: 5px;
  background-color: #ccc;
}
button:hover {
  background-color: #888;
}
</style>
