<script setup lang="ts">
import { ref } from 'vue';
import type { BaseTableProps, IPagination } from '@/types';
import BaseTable from './BaseTable.vue';
import { getGuaranteeAPI } from '@/apis/admin';
import { dateFormatYYYYMMDDHH } from '@/utils/date';

const loading = ref(false);
const error = ref('');

const statusCallback = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    0: '待同意',
    1: '已同意',
    2: '已拒绝',
  };
  return statusMap[status] || '未知状态';
};

const columnMap = new Map([
  ['id', { title: '#', width: '60px' }],
  ['guarantor_username', { title: '担保人' }],
  ['applicant_username', { title: '申请人' }],
  ['player_name', { title: '玩家名称' }],
  ['status', { title: '状态', width: '90px', callback: statusCallback }],
  ['create_time', { title: '创建时间', width: '170px' }],
  ['expiration_time', { title: '过期时间', width: '170px' }],
]);

const fetchGuaranteeData = async (params: IPagination) => {
  loading.value = true;
  error.value = '';
  try {
    return await getGuaranteeAPI(params);
  } catch (e: any) {
    error.value = e?.message || '加载失败，请稍后重试。';
    throw e;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
      <h1 class="text-2xl font-bold">担保管理</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="hover:text-[#5268bc] transition-colors">后台首页</router-link>
        <span>/</span>
        <router-link to="/admin/user" class="hover:text-[#5268bc] transition-colors">用户管理</router-link>
        <span>/</span>
        <span class="text-gray-700">担保管理</span>
      </nav>
    </div>

    <div class="p-5">
      <BaseTable
    :table-props="{ columnMap, stripe: true, bordered: true }"
    :fetch-data="fetchGuaranteeData"
    :loading="loading"
    :error="error"
  >
    <template #create_time="{ value }">
      <span class="whitespace-nowrap">{{ dateFormatYYYYMMDDHH(value) }}</span>
    </template>
    <template #expiration_time="{ value }">
      <span class="whitespace-nowrap">{{ dateFormatYYYYMMDDHH(value) }}</span>
    </template>
  </BaseTable>
    </div>
  </div>
</template>
