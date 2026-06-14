<script setup lang="ts">
import { getResponses, reviewedResponse, responseDetail } from '@/apis/admin';
import type { IResponse, IPagination } from '@/types';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResponseDetail from '@/components/admin/ResponseDetail.vue';
import { dateFormatYYYYMMDDHH } from '@/utils/date';
import { openAlert } from '@/utils/TsAlert';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const visibility = ref(false);
const detailData = ref();

const reviewedStatus = (key: number) => {
  switch (key) {
    case 0: return '待审核';
    case 1: return '已通过';
    case 2: return '已拒绝';
    default: return '未知';
  }
};

const reviewedColor = (key: number) => {
  if (key === 1) return 'text-green-600';
  if (key === 2) return 'text-red-500';
  return 'text-gray-400';
};

const columnMap = new Map([
  ['id', { title: '#', width: '60px' }],
  ['isCompleted', { title: '完成', width: '80px' }],
  ['isReviewed', { title: '审核状态', width: '80px' }],
  ['reviewer_name', { title: '审核人', width: '100px' }],
  ['survey', { title: '试卷名称' }],
  ['surveyId', { title: '试卷ID', width: '80px' }],
  ['score', { title: '分数', width: '60px' }],
  ['username', { title: '用户名', width: '100px' }],
  ['playername', { title: '玩家名', width: '100px' }],
  ['createTime', { title: '开考日期', width: '170px' }],
  ['responseTime', { title: '交卷日期', width: '170px' }],
]);

const fetchResponses = async (params: IPagination) => {
  loading.value = true;
  const res = await getResponses(params);
  loading.value = false;
  return res;
};

const reviewed = (id: number, pass: boolean) => {
  const text = pass ? '确定通过吗？' : '确定拒绝吗？';
  if (!confirm(text)) return;
  reviewedResponse({ response: id, status: pass ? 1 : 2 }).then((res) => {
    openAlert(res.data.desc);
    if (res.data.code === 0) {
      loading.value = true;
      getResponses({ page: 1, size: 10 }).then(() => (loading.value = false));
    }
  });
};

const openDetail = (id: number) => {
  responseDetail(id).then((res: { data: any }) => {
    detailData.value = res.data;
    detailData.value.archived = res.data.isReviewed ? true : false;
    visibility.value = true;
  });
};

watch(visibility, (newValue) => {
  if (!newValue) {
    loading.value = true;
    getResponses({ page: 1, size: 10 }).then(() => (loading.value = false));
  }
});

onMounted(async () => {
  const id = parseInt(route.query.id as string);
  if (id) {
    openDetail(id);
    const newQuery = { ...route.query };
    delete newQuery.id;
    router.replace({ query: newQuery });
  }
});
</script>

<template>
  <div class="h-full overflow-y-auto">
    <h1 class="text-3xl mb-2">答卷管理</h1>
    <p class="text-sm text-gray-500 mb-5">注意：已过期的答卷自动设置为已完成和已拒绝</p>

    <BaseTable
      :table-props="{ columnMap, stripe: true, bordered: true }"
      :fetch-data="fetchResponses"
      :loading="loading"
      actions-width="340px"
    >
      <template #isCompleted="{ value }">
        <span :class="value ? 'text-green-600' : 'text-red-500'">{{ value ? '已完成' : '未完成' }}</span>
      </template>
      <template #isReviewed="{ value }">
        <span :class="reviewedColor(value)">{{ reviewedStatus(value) }}</span>
      </template>
      <template #reviewer_name="{ value, row }">
        {{ row.isReviewed ? value : '/' }}
      </template>
      <template #createTime="{ value }">
        <span class="whitespace-nowrap">{{ dateFormatYYYYMMDDHH(value) }}</span>
      </template>
      <template #responseTime="{ value }">
        <span class="whitespace-nowrap">{{ value ? dateFormatYYYYMMDDHH(value) : '未交卷' }}</span>
      </template>
      <template #actions="{ row }">
        <MCButton v-if="!row.isReviewed" length="short" @click="reviewed(row.id, true)">通过</MCButton>
        <MCButton v-if="!row.isReviewed" length="short" disabled-style @click="reviewed(row.id, false)">拒绝</MCButton>
        <MCButton length="short" @click="openDetail(row.id)">详情</MCButton>
      </template>
    </BaseTable>

    <ResponseDetail v-if="visibility" v-model:visibility="visibility" :data="detailData" />
  </div>
</template>
