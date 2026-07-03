<script setup lang="ts">
import { getSurveys, addSlotAPI, setSlotAPI, delSlotAPI } from '@/apis/admin';
import { getSlotsAPI } from '@/apis/survey';
import type { SurveySlot, SurveyInfoItem } from '@/types/survey';
import { openAlert } from '@/utils/TsAlert';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';
import ModalCloseButton from './ModalCloseButton.vue';
import { ref, reactive } from 'vue';

const slots = ref<SurveySlot[]>([]);
const surveys = ref<SurveyInfoItem[]>([]);

const showAddModal = ref(false);
const newSlot = reactive({
  slotName: '',
  mountedSID: null as number | null,
});

const handleRes = (res: any) => {
  if (res.code === 0) { getSlots(); getSurveyIds(); }
  openAlert(res.desc);
};

const getSlots = () => {
  getSlotsAPI().then((res) => { slots.value = res.data.data; });
};

const openAddModal = () => {
  newSlot.slotName = '';
  newSlot.mountedSID = null;
  showAddModal.value = true;
};

const addSlot = () => {
  if (!newSlot.slotName || !newSlot.mountedSID) {
    openAlert('请填写完整信息');
    return;
  }
  addSlotAPI({ slotName: newSlot.slotName, mountedSID: newSlot.mountedSID }).then((res: any) => {
    handleRes(res.data);
    showAddModal.value = false;
  });
};

const delSlot = (slot: SurveySlot) => {
  delSlotAPI(slot).then((res: any) => handleRes(res.data));
};

const getSurveyIds = () => {
  getSurveys().then((res: any) => { surveys.value = res.data.data; });
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
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
      <h1 class="text-2xl font-bold">问卷发布</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="hover:text-[#5268bc] transition-colors">后台首页</router-link>
        <span>/</span>
        <router-link to="/admin/exam" class="hover:text-[#5268bc] transition-colors">试卷管理</router-link>
        <span>/</span>
        <span class="text-gray-700">试卷发布</span>
      </nav>
    </div>

    <div class="p-5">
      <p class="text-sm text-gray-500 mb-5">插槽名就是用户可选的问卷类型的名称，这里有几个插槽，用户就有几种选择</p>
      <MCButton length="medium" @click="openAddModal">新建插槽</MCButton>
      <h3 class="text-xl font-bold mb-3">插槽列表</h3>
      <BaseTable :table-props="{ columnMap, stripe: true, bordered: true }" :data="slots" actions-width="110px">
        <template #mountedSID="{ row, value }">
          <select :value="value" class="w-full px-2 py-1 border border-gray-300 rounded bg-white outline-none text-sm"
            @change="handleChange({ ...row, mountedSID: Number(($event.target as HTMLSelectElement).value) } as unknown as SurveySlot)">
            <option v-for="i in surveys" :key="i.id" :value="i.id">{{ i.name }}</option>
          </select>
        </template>
        <template #actions="{ row }">
          <MCButton class="!text-red-500" length="short" @click="delSlot(row as unknown as SurveySlot)">删除</MCButton>
        </template>
      </BaseTable>
    </div>
  </div>

  <!-- 新建插槽模态框 -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        @click.self="showAddModal = false">
        <div class="bg-white rounded-xl p-6 w-[420px] max-w-[90vw] shadow-2xl">
          <ModalCloseButton @click="showAddModal = false" />
          <h2 class="text-xl font-bold mb-4">新建插槽</h2>
          <form @submit.prevent="addSlot" class="flex flex-col gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium">插槽名</label>
              <input v-model="newSlot.slotName" type="text" required placeholder="输入插槽名"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">应用问卷</label>
              <select v-model="newSlot.mountedSID" required
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc] bg-white">
                <option :value="null" disabled>请选择问卷</option>
                <option v-for="s in surveys" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <MCButton length="short" disabled-style @click="showAddModal = false">取消</MCButton>
              <MCButton length="short" type="submit">创建</MCButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active>div,
.modal-fade-leave-active>div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from>div,
.modal-fade-leave-to>div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
