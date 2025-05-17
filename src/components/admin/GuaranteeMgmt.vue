<script setup lang="ts">
import type { BaseTableProps, IPagination } from '@/types';
import BaseTable from './BaseTable.vue';
import { getGuaranteeAPI } from '@/apis/admin';
import { dateFormatYYYYMMDDHH } from '@/utils/date';

const statusCallback = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    0: '待同意',
    1: '已同意',
    2: '已拒绝',
  };
  return statusMap[status] || '未知状态';
};

const timeCallback = (time: string): string => {
  return dateFormatYYYYMMDDHH(time);
};

const tableProps: BaseTableProps = {
  caption: '担保记录',
  columnMap: new Map([
    ['id', { title: '#', callback: undefined }],
    ['guarantor_username', { title: '担保人', callback: undefined }],
    ['applicant_username', { title: '申请人', callback: undefined }],
    ['player_name', { title: '玩家名称', callback: undefined }],
    ['status', { title: '状态', callback: statusCallback }],
    ['create_time', { title: '创建时间', callback: timeCallback }],
    ['expiration_time', { title: '过期时间', callback: timeCallback }],
  ]),
};

// 定义 fetchData 函数并传递分页参数
const fetchGuaranteeData = (params: IPagination) => {
  return getGuaranteeAPI(params); // 返回 Promise
};
</script>

<template>
  <h1>担保管理</h1>
  <!-- <p>0待同意1已同意2已拒绝</p> -->
  <BaseTable :tableProps="tableProps" :fetchData="fetchGuaranteeData"></BaseTable>
</template>
