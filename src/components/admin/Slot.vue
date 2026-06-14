<script setup lang="ts">
import { getSurveys, addSlotAPI, setSlotAPI, delSlotAPI } from '@/apis/admin';
import { getSlotsAPI } from '@/apis/survey';
import { SurveySlot, ISurvey } from '@/types';
import { openAlert } from '@/utils/TsAlert';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';
import { ref } from 'vue';

const slots = ref<SurveySlot[]>([]);
const surveys = ref<ISurvey[]>([]);

const handleRes = (res: any) => {
  if (res.code === 0) { getSlots(); getSurveyIds(); }
  openAlert(res.desc);
};

const getSlots = () => {
  getSlotsAPI().then((res: any) => { slots.value = res.data.list; });
};

const addSlot = () => {
  const sName = String(prompt('插槽名'));
  const sID = Number(prompt('应用的问卷的ID'));
  if (sName && sID) {
    addSlotAPI({ slotName: sName, mountedSID: sID }).then((res: any) => handleRes(res.data));
  } else { openAlert('缺少数据'); }
};

const delSlot = (slot: SurveySlot) => {
  delSlotAPI(slot).then((res: any) => handleRes(res.data));
};

const getSurveyIds = () => {
  getSurveys().then((res: any) => { surveys.value = res.data.list; });
};

const handleChange = (item: SurveySlot) => {
  setSlotAPI(item).then((res: any) => handleRes(res.data));
};

const columnMap = new Map([
  ['id', { title: '#', width: '60px', align: 'center' as const }],
  ['slotName', { title: '插槽名（系统会自动在末尾加"类"字）' }],
  ['mountedSID', { title: '应用的问卷', width: '200px' }],
]);

getSlots();
getSurveyIds();
</script>

<template>
  <h1 class="text-3xl mb-2">问卷发布</h1>
  <p class="text-sm text-gray-500 mb-5">插槽名就是用户可选的问卷类型的名称，这里有几个插槽，用户就有几种选择</p>

  <h3 class="text-xl font-bold mb-2">问卷列表</h3>
  <ul class="space-y-1 mb-5 text-sm">
    <li v-for="s in surveys" :key="s.id">
      问卷id：{{ s.id }}，问卷名称：{{ s.name }}，问卷描述：{{ s.description }}，问卷发布：{{ s.status ? '已发布' : '未发布' }}
    </li>
  </ul>

  <h3 class="text-xl font-bold mb-3">插槽列表</h3>
  <BaseTable
    :table-props="{ columnMap, stripe: true, bordered: true }"
    :data="slots"
    actions-width="110px"
  >
    <template #mountedSID="{ row, value }">
      <select :value="value" class="w-full px-2 py-1 border border-gray-300 rounded bg-white outline-none text-sm" @change="handleChange({ ...row, mountedSID: Number(($event.target as HTMLSelectElement).value) } as unknown as SurveySlot)">
        <option v-for="i in surveys" :key="i.id" :value="i.id">{{ i.name }}</option>
      </select>
    </template>
    <template #actions="{ row }">
      <MCButton length="short" disabled-style @click="delSlot(row as unknown as SurveySlot)">删除</MCButton>
    </template>
  </BaseTable>

  <MCButton length="medium" @click="addSlot">新建插槽</MCButton>
</template>
