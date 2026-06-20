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

</script>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
      <h1 class="text-2xl font-bold">白名单管理</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="hover:text-[#5268bc] transition-colors">后台首页</router-link>
        <span>/</span>
        <router-link to="/admin/user" class="hover:text-[#5268bc] transition-colors">用户管理</router-link>
        <span>/</span>
        <span class="text-gray-700">白名管理</span>
      </nav>
    </div>

    <div class="p-5">
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
  </BaseTable>
    </div>
  </div>
</template>
