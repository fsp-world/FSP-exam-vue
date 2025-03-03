<script setup>
import { getResponses, getSurveys, addSurvey } from '@/apis/admin';
import EditExam from './EditExam.vue';
import { ref } from 'vue';

const surveysData = ref({
  code: -1,
  list: [],
  desc: '',
});
const responsesData = ref({
  code: -1,
  list: [],
  desc: '',
});

const flag = ref(false);
const sid = ref(0);

getSurveys().then((res) => {
  surveysData.value = res.data;
});
getResponses().then((res) => {
  responsesData.value = res.data;
});

const createSurvey = () => {
  addSurvey({
    name: prompt('name'),
    description: prompt('description'),
  }).then((res) => {
    console.log(res.data);
  });
};
</script>

<template>
  <EditExam v-if="flag" :sid="sid" @close="flag = false"></EditExam>
  <h2>问卷管理</h2>
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
  <hr />
  <hr />
  <h2>答卷管理</h2>
  <hr />
  <div>
    <p v-if="!responsesData.list.length">暂无数据</p>
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
}
.survey-box .title,
.survey-box .lite-title,
.survey-box .desc {
  margin-left: 16px;
  margin-right: 16px;
}
</style>
