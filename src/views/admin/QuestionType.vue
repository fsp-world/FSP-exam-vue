<template>
  <h1>试卷类型</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>类型名</th>
        <th>试卷</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in types">
        <td>{{ i.id }}</td>
        <td>{{ i.typeName }}</td>
        <td>
          <select v-model="i.surveyId" @change="handleChange(i, $event)">
            <option v-for="i in surveys" :value="i.id">{{ i.name }}</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { getQuestionType, getSurveys, setQuestionType } from '@/apis/admin';
import { ref } from 'vue';

const types = ref([]);
const surveys = ref([]);

const getTypeMapper = () => {
  getQuestionType().then((res) => {
    types.value = res.data.list;
  });
};

const getSurveyIds = () => {
  getSurveys().then((res) => {
    surveys.value = res.data.list;
  });
};
getTypeMapper();
getSurveyIds();

const handleChange = (item, e) => {
  console.log(item, e.target.value);
  setQuestionType(item).then((res) => {
    console.log(res);
  });
};
</script>

<style scoped>
table,
table td,
table th {
  border: 1px solid #000000;
}
table {
  width: 100%;
}
td,
th {
  padding: 5px;
  text-align: center;
}

.dialog {
  position: fixed;
  z-index: 11;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  padding: 20px;
  background-color: antiquewhite;
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
