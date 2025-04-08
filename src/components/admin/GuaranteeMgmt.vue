<script setup lang="ts">
import type { BaseTableProps, IPagination } from '@/types';
import BaseTable from './BaseTable.vue';
import { getGuaranteeAPI } from '@/apis/admin';

const tableProps: BaseTableProps = {
  caption: '担保记录',
  columnMap: new Map([
    ['id', '#'],
    ['guarantee_id', '担保人'],
    ['applicant_id', '申请人'],
    ['player_name', '玩家名称'],
    ['status', '状态'],
    ['create_time', '创建时间'],
  ]),
};

// 定义 fetchData 函数并传递分页参数
const fetchGuaranteeData = (params: IPagination) => {
  return getGuaranteeAPI(params); // 返回 Promise
};
</script>

<template>
  <h1>担保管理</h1>
  <BaseTable :tableProps="tableProps" :fetchData="fetchGuaranteeData"></BaseTable>
</template>
