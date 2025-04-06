<script setup lang="ts">
import { getSurveys, setSlotAPI } from '@/apis/admin';
import { getSlotsAPI } from '@/apis/survey';
import { SurveySlot, ISurvey } from '@/types';
import { openAlert } from '@/utils/TsAlert';

import { ref } from 'vue';

const slots = ref<SurveySlot[]>([]);
const surveys = ref<ISurvey[]>([]);

const handleRes = (res: any) => {
  if (res.code === 0) {
    getSlots();
    getSurveyIds();
  }
  openAlert(res.desc);
};

const getSlots = () => {
  getSlotsAPI().then((res: any) => {
    slots.value = res.data.list;
  });
};

const getSurveyIds = () => {
  getSurveys().then((res: any) => {
    surveys.value = res.data.list;
  });
};

const handleChange = (item: SurveySlot) => {
  setSlotAPI(item).then((res: any) => {
    handleRes(res.data);
  });
};

getSlots();
getSurveyIds();
</script>

<template>
  <h1>问卷发布</h1>
  <p>插槽名就是用户可选的问卷类型的名称，这里有几个插槽，用户就有几种选择</p>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>插槽名</th>
        <th>应用的问卷</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="slot in slots">
        <td>{{ slot.id }}</td>
        <td>{{ slot.slotName }}</td>
        <td>
          <select v-model="slot.mountedSID" @change="handleChange(slot)">
            <option v-for="i in surveys" :value="i.id">{{ i.name }}</option>
          </select>
        </td>
        <td><button type="button" class="delete">删除</button></td>
      </tr>
    </tbody>
  </table>
  <button type="button" class="add-slot">新建插槽</button>
</template>

<style scoped>
p {
  padding: 10px 0;
}
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
.add-slot {
  margin: 10px auto;
  padding: 5px 10px;
  font-size: 20px;
  border-radius: 5px;
  background-color: #eee;
}
.add-slot:hover {
  background-color: #ccc;
}
</style>
