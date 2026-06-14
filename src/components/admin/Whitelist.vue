<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getWhitelist } from '@/apis/admin';
import { dateFormatYYYYMMDDHH } from '@/utils/date';
import type { IPagination } from '@/types';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';

// 加载状态
const isLoading = ref(false);
const isError = ref('');

const sourceMap: Record<number, string> = {
  0: '考试',
  1: '担保',
  2: '其他',
};

// 列定义
const columnMap = new Map([
  ['id', { title: '#', width: '60px' }],
  ['username', { title: '用户名' }],
  ['name', { title: 'MC NAME' }],
  ['uuid', { title: 'UUID', width: '340px' }],
  ['source', { title: '审核方式', width: '100px' }],
  ['auditor_name', { title: '审核人', width: '130px' }],
  ['created_at', { title: '添加时间', width: '170px' }],
]);

const fetchWhitelist = async (params: IPagination) => {
  isLoading.value = true;
  isError.value = '';
  try {
    const res = await getWhitelist(params);
    return res;
  } catch (e: any) {
    isError.value = e?.message || '加载失败，请稍后重试。';
    throw e;
  } finally {
    isLoading.value = false;
  }
};

// 编辑白名单
const showModal = ref(false);
const editData = ref<Record<string, any>>({});

const editItem = (row: Record<string, any>) => {
  editData.value = { ...row };
  showModal.value = true;
};
</script>

<template>
  <h1 class="text-3xl mb-5">白名单管理</h1>

  <BaseTable
    :table-props="{ columnMap, stripe: true, bordered: true }"
    :fetch-data="fetchWhitelist"
    :loading="isLoading"
    :error="isError"
    actions-width="110px"
  >
    <template #source="{ value }">
      {{ sourceMap[value] ?? '未知' }}
    </template>
    <template #created_at="{ value }">
      <span class="whitespace-nowrap">{{ dateFormatYYYYMMDDHH(value) }}</span>
    </template>
    <template #uuid="{ value }">
      <span class="text-sm">{{ value }}</span>
    </template>
    <template #actions="{ row }">
      <MCButton length="short" @click="editItem(row)">修改</MCButton>
    </template>
  </BaseTable>

  <!-- 修改模态框 -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-xl p-6 w-[420px] max-w-[90vw] shadow-2xl">
          <h2 class="text-xl font-bold mb-4">修改白名单</h2>
          <div class="flex flex-col gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium">用户名</label>
              <input v-model="editData.username" type="text" class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">MC NAME</label>
              <input v-model="editData.name" type="text" class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">UUID</label>
              <input v-model="editData.uuid" type="text" class="w-full px-3 py-2 border border-gray-300 rounded font-mono outline-none focus:border-[#5268bc]" />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <MCButton length="short" disabled-style @click="showModal = false">取消</MCButton>
              <MCButton length="short" @click="showModal = false">保存</MCButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
