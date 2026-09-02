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
import AdminButton from './AdminButton.vue';
import MCDialog from '@/components/MCDialog.vue';
import { AdminReviewSurvey } from '@/types/survey.js';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const visibility = ref(false);
const detailData = ref<AdminReviewSurvey | null>();
const tableRef = useTemplateRef('tableRef');

// 拒绝理由弹窗
const rejectModalVisible = ref(false);
const rejectId = ref<number | null>(null);
const rejectReason = ref('');

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

// 通过：无需理由，直接提交
const approved = (id: number) => {
  if (!confirm('确定通过吗？')) return;
  reviewedResponse({ response: id, status: 1 }).then((res) => {
    openAlert(res.data.desc);
    if (res.data.code === 0) {
      tableRef.value?.loadData();
    }
  });
};

// 拒绝：先弹出输入框填写拒绝理由
const openReject = (id: number) => {
  rejectId.value = id;
  rejectReason.value = '';
  rejectModalVisible.value = true;
};

const submitReject = () => {
  if (rejectId.value === null) return;
  const reason = rejectReason.value.trim();
  if (!reason) {
    openAlert('请填写拒绝理由！');
    return;
  }
  reviewedResponse({ response: rejectId.value, status: 2, reason }).then((res) => {
    openAlert(res.data.desc);
    if (res.data.code === 0) {
      rejectModalVisible.value = false;
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
    <div class="rounded-lg bg-white shadow-sm">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
        <h1 class="text-2xl font-bold">答卷管理</h1>
        <nav class="flex items-center gap-1.5 text-sm text-gray-500">
          <router-link to="/admin" class="transition-colors hover:text-[#5268bc]">后台首页</router-link>
          <span>/</span>
          <router-link to="/admin/exam" class="transition-colors hover:text-[#5268bc]">试卷管理</router-link>
          <span>/</span>
          <span class="text-gray-700">答卷管理</span>
        </nav>
      </div>

      <div class="p-5">
        <p class="mb-5 text-sm text-gray-500">注意：已过期的答卷自动设置为已完成和已超时</p>
        <BaseTable
          ref="tableRef"
          :table-props="{ columnMap, stripe: true, bordered: true }"
          :fetch-data="fetchResponses"
          :loading="loading"
          actions-width="80px"
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
            <div class="action-btns">
              <AdminButton size="small" @click="openDetail(row.id)">详情</AdminButton>
              <template v-if="!row.isReviewed">
                <AdminButton size="small" variant="primary" @click="approved(row.id)">通过</AdminButton>
                <AdminButton size="small" variant="danger" @click="openReject(row.id)">拒绝</AdminButton>
              </template>
            </div>
          </template>
        </BaseTable>
        <ResponseDetail v-if="visibility && detailData" v-model:visibility="visibility" :data="detailData" />
      </div>
    </div>

    <!-- 拒绝理由弹窗 -->
    <MCDialog v-model:isModalVisible="rejectModalVisible" :style="'card'" :resizeX="1.2" :resizeY="1.1">
      <div class="reject-dialog">
        <h2 class="reject-title">拒绝答卷</h2>
        <p class="reject-tip">请填写拒绝理由，该理由将随邮件发送给用户：</p>
        <textarea
          v-model="rejectReason"
          class="reject-textarea"
          rows="4"
          maxlength="200"
          placeholder="请输入拒绝理由…"
        ></textarea>
        <div class="reject-btns">
          <AdminButton variant="danger" @click="submitReject">确认拒绝</AdminButton>
          <AdminButton @click="rejectModalVisible = false">取消</AdminButton>
        </div>
      </div>
    </MCDialog>
  </div>
</template>

<style scoped>
.reject-dialog {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px;
  color: #3f3f3f;
}

.reject-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
}

.reject-tip {
  font-size: 14px;
  text-align: center;
}

.reject-textarea {
  box-sizing: border-box;
  width: 100%;
  min-height: 96px;
  padding: 10px;
  border: 2px solid #8b8b8b;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.reject-textarea:focus {
  border-color: #5268bc;
}

.reject-btns {
  display: flex;
  justify-content: center;
  gap: 16px;
}

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
