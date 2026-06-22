<script setup lang="ts">
import { type ConfigItem, ConfigItemType } from '@/types';
import { ref, computed } from 'vue';
import { getConfig, getConfigs, setConfig, deleteConfig } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';

const data = ref<ConfigItem[]>([]);
const searchData = ref('');
const searchType = ref('');
const showModal = ref(false);
const isAdd = ref(false);
const selectedConfigItem = ref<ConfigItem>({
  key: '',
  value: '',
  type: ConfigItemType.STR,
  description: '',
});

const maskValue = (val: string) => {
  if (!val || val.length <= 6) return val;
  return val.slice(0, 3) + '*****' + val.slice(-3);
};

const columnMap = new Map([
  ['key', { title: '键', width: '200px' }],
  ['value', { title: '值', width: '240px', callback: maskValue }],
  ['type', { title: '类型', width: '60px' }],
  ['desc', { title: '描述' }],
] as const);

const getConfig_ = () => {
  getConfigs().then((res: { data: { code: number; desc: string; data: { items: ConfigItem[] } } }) => {
    data.value = res.data.data?.items ?? [];
  });
};
getConfig_();

const checkConfigKey = (key: string): boolean => {
  const ALLOWED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_';
  for (const char of key) {
    if (!ALLOWED_CHARS.includes(char)) {
      return false;
    }
  }
  return true;
};

const editItem = (key: string) => {
  selectedConfigItem.value = {
    key: '',
    value: '',
    type: ConfigItemType.STR,
    description: '',
  };
  getConfig(key).then((res: { data: { code: number; desc: string; data: ConfigItem | { items: ConfigItem[] } } }) => {
    const d = res.data.data;
    selectedConfigItem.value = (d as { items: ConfigItem[] }).items?.[0] ?? (d as ConfigItem);
  });
  showModal.value = true;
  isAdd.value = false;
};

const deleteItem = (key: string) => {
  const check = confirm(`确认删除 ${key} 吗`);
  if (check) {
    deleteConfig(key).then((res) => {
      openAlert(res.data.desc);
      if (res.data.code === 0) {
        getConfig_();
      }
    });
  }
};

const add = () => {
  selectedConfigItem.value = {
    key: '',
    value: '',
    type: ConfigItemType.STR,
    description: '',
  };
  showModal.value = true;
  isAdd.value = true;
};

const save = async () => {
  if (!checkConfigKey(selectedConfigItem.value.key)) {
    openAlert('键名只允许包含大写的26个字母或者下划线');
    showModal.value = false;
    return;
  }
  const res = await setConfig(selectedConfigItem.value);
  if (res.data.code === 0) {
    openAlert('成功!');
  } else {
    openAlert('失败!');
  }
  showModal.value = false;
  getConfig_();
};

const searchComputed = computed(() => {
  return data.value.filter((item: ConfigItem) => {
    return (
      (!searchData.value || item.key.includes(searchData.value) || item.value.includes(searchData.value)) &&
      (!searchType.value || item.type === searchType.value)
    );
  });
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
      <h1 class="text-2xl font-bold">配置管理</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="hover:text-[#5268bc] transition-colors">管理首页</router-link>
        <span>/</span>
        <span class="text-gray-700">系统配置</span>
      </nav>
    </div>

    <div class="p-5">
      <div class="flex flex-wrap items-center gap-3 py-0 mb-5">
    <input
      type="search"
      v-model="searchData"
      placeholder="搜索"
      class="w-60 h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-base"
    />
    <select
      v-model="searchType"
      class="w-60 h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-base bg-white"
    >
      <option value="">筛选类型</option>
      <option v-for="i in ConfigItemType" :key="i" :value="i">{{ i }}</option>
    </select>
    <button
      class="flex items-center justify-center w-10 h-10 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
      @click="searchType = ''; searchData = ''"
    >
      <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div class="flex gap-px">
      <MCButton length="medium" @click="add">新增</MCButton>
      <MCButton length="medium" @click="getConfig_">刷新</MCButton>
    </div>
  </div>

  <!-- 数据表格 -->
  <BaseTable
    :table-props="{ columnMap, stripe: true, bordered: true }"
    :data="searchComputed"
    actions-width="220px"
  >
    <template #actions="{ row }">
      <MCButton length="short" @click="editItem(row.key)">修改</MCButton>
      <MCButton length="short" disabled-style @click="deleteItem(row.key)">删除</MCButton>
    </template>
  </BaseTable>
    </div>
  </div>

  <!-- 模态框 -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-xl p-6 w-105 max-w-[90vw] shadow-2xl">
          <h2 class="text-xl font-bold mb-4">修改配置项</h2>
          <p class="text-sm text-gray-500 mb-1">data:</p>
          <pre class="text-sm bg-gray-50 p-3 rounded mb-4 overflow-x-auto">{
  key: {{ selectedConfigItem.key }}
  value: {{ selectedConfigItem.value }}
  type: {{ selectedConfigItem.type }}
  desc: {{ selectedConfigItem.description }}
}</pre>

          <form @submit.prevent="save" class="flex flex-col gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium">Key</label>
              <input
                v-model="selectedConfigItem.key"
                type="text"
                required
                placeholder="key"
                :disabled="!isAdd"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc] disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">Value</label>
              <input
                v-model="selectedConfigItem.value"
                type="text"
                required
                placeholder="value"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">Type</label>
              <select
                v-model="selectedConfigItem.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc] bg-white"
              >
                <option v-for="i in ConfigItemType" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">Description</label>
              <input
                v-model="selectedConfigItem.description"
                type="text"
                required
                placeholder="description"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]"
              />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <MCButton length="short" disabled-style @click="showModal = false">取消</MCButton>
              <MCButton length="short" @click="save">保存</MCButton>
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
.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}
</style>
