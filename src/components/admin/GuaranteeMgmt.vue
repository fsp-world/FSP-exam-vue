<script setup lang="ts">
import type { BaseTableProps, IPagination } from '@/types';
import BaseTable from './BaseTable.vue';
import { getGuaranteeAPI } from '@/apis/admin';
// import moment from 'moment';
// const statusMap: { [key: number]: string } = {
//   0: '待同意',
//   1: '已同意',
//   2: '已拒绝',
// };

const tableProps: BaseTableProps = {
  caption: '担保记录',
  columnMap: new Map([
    ['id', '#'],
    ['guarantor_username', '担保人'],
    ['applicant_username', '申请人'],
    ['player_name', '玩家名称'],
    ['status', '状态'],
    ['create_time', '创建时间'],
    ['expiration_time', '过期时间'],
  ]),
};

// 定义 fetchData 函数并传递分页参数
const fetchGuaranteeData = (params: IPagination) => {
  return getGuaranteeAPI(params); // 返回 Promise
};
</script>

<template>
  <h1>担保管理</h1>
  <p>0待同意1已同意2已拒绝，这里把表格组件化了，但是日期格式和status的map不知道怎么传进去</p>
  <BaseTable :tableProps="tableProps" :fetchData="fetchGuaranteeData"></BaseTable>
</template>
