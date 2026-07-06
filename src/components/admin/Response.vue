<script setup lang="ts">
import { getResponses, reviewedResponse, responseDetail } from '@/apis/admin';
import type { IPagination } from '@/types';
import { ref, watch, onMounted, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResponseDetail from '@/components/admin/ResponseDetail.vue';
import { dateFormatYYYYMMDDHH } from '@/utils/date';
import { reviewedStatus, reviewedColor } from '@/utils/statusUtil';
import { openAlert } from '@/utils/TsAlert';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';
import { AdminReviewSurvey } from '@/types/survey.js';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const visibility = ref(false);
const detailData = ref<AdminReviewSurvey | null>();
const tableRef = useTemplateRef('tableRef');

const columnMap = new Map([
  ['id', { title: '#', width: '60px' }],
  ['isCompleted', { title: '完成', width: '80px' }],
  ['isReviewed', { title: '审核状态', width: '80px' }],
  ['reviewerName', { title: '审核人', width: '100px' }],
  ['surveyName', { title: '试卷名称' }],
  ['surveyId', { title: '试卷ID', width: '80px' }],
  ['score', { title: '分数', width: '60px' }],
  ['userName', { title: '用户名', width: '100px' }],
  ['playerName', { title: '玩家名', width: '100px' }],
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
      tableRef.value?.loadData();
    }
  });
};

const openDetail = (id: number) => {
  responseDetail(id).then((res) => {
    detailData.value = res.data.data;
    visibility.value = true;
  });
};

watch(visibility, (newValue) => {
  if (!newValue) {
    tableRef.value?.loadData();
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
    <div class="bg-white rounded-lg shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold">答卷管理</h1>
        <nav class="flex items-center gap-1.5 text-sm text-gray-500">
          <router-link to="/admin" class="hover:text-[#5268bc] transition-colors">后台首页</router-link>
          <span>/</span>
          <router-link to="/admin/exam" class="hover:text-[#5268bc] transition-colors">试卷管理</router-link>
          <span>/</span>
          <span class="text-gray-700">答卷管理</span>
        </nav>
      </div>

      <div class="p-5">
        <p class="text-sm text-gray-500 mb-5">注意：已过期的答卷自动设置为已完成和已拒绝</p>
        <BaseTable ref="tableRef" :table-props="{ columnMap, stripe: true, bordered: true }"
          :fetch-data="fetchResponses" :loading="loading" actions-width="80px">
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
            <div class="action-btns">
              <MCButton length="short" @click="openDetail(row.id)">详情</MCButton>
              <template v-if="!row.isReviewed">
                <MCButton length="short" class="btn-pass" @click="reviewed(row.id, true)">通过</MCButton>
                <MCButton length="short" class="btn-reject" @click="reviewed(row.id, false)">拒绝</MCButton>
              </template>
            </div>
          </template>
        </BaseTable>
        <ResponseDetail v-if="visibility && detailData" v-model:visibility="visibility" :data="detailData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.action-btns {
  display: flex;
  gap: 4px;
}

@media (max-width: 768px) {
  .action-btns {
    flex-direction: column;
    gap: 2px;

    button {
      width: 60px;
      height: 30px;
    }
  }
}
</style>
