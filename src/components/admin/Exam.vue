<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import { getSurveys, delSurvey } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';
import { importSurveyData, exportSurveyToJsonFile } from '@/utils/survey';
import { selectSingleFile } from '@/utils/file';
import EditExam from './EditExam.vue';
import SetSurveyMetaData from './SetSurveyMetaData.vue';
import MCButton from '@/components/MCButton.vue';
import type { SurveyInfoItem } from '@/types/survey';

const toggleSetSurveyMetaData = ref(false);

const surveys = ref<SurveyInfoItem[]>([]);

const flag = ref(false);
const currentSurveyId = ref(0);
const currentSurveyEditable = ref(false);

const attachEditableToSurveys = (surveys: SurveyInfoItem[]) => {
  for (let survey of surveys) {
    survey.editable = !(survey.notCompletedCount > 0 || survey.notReviewedCount > 0);
    survey.editable = survey.status === 0 ? survey.editable : false;
  }
  return surveys;
};

provide('attachEditableToSurveys', attachEditableToSurveys);

const _getSurveys = async () => {
  try {
    const res = await getSurveys();
    if (res.data.code === 0) {
      const list = attachEditableToSurveys(res.data.data);
      surveys.value = res.data.data;
    }
  } catch (error) {
    openAlert('获取问卷列表失败！');
  }
};

const editSurvey = (survey: SurveyInfoItem) => {
  flag.value = true;
  currentSurveyId.value = survey.id;
  currentSurveyEditable.value = survey.editable ? true : false;
};

const deleteSurvey = (id: number) => {
  const confirmDelete = confirm('确定要删除这个问卷吗，问卷中的题目会被一并删除！请三思！');
  if (confirmDelete) {
    delSurvey(id).then((res) => {
      if (res.data.code === 0) {
        _getSurveys();
      }
      openAlert(res.data.desc);
    });
  }
};

const exportSurvey = (sid: number) => {
  exportSurveyToJsonFile(sid);
};

const importSurvey = (): void => {
  selectSingleFile('.json', async (content) => {
    try {
      const jsonData = JSON.parse(content);
      const importRes = await importSurveyData(jsonData);
      openAlert(importRes.msg);
      _getSurveys();
    } catch (error) {
      console.error('不是一个有效的JSON文件:', error);
      openAlert('导入失败：不是有效的JSON文件');
    }
  });
};
onMounted(() => {
  _getSurveys();
});
</script>

<template>
  <EditExam
    v-if="flag"
    :sid="currentSurveyId"
    :editable="currentSurveyEditable"
    @close="flag = false"
    @flush="_getSurveys"
  >
  </EditExam>
  <SetSurveyMetaData :mode="'set'" v-model="toggleSetSurveyMetaData" @on-edit="_getSurveys"></SetSurveyMetaData>

  <div v-if="!flag" class="rounded-lg bg-white shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
      <h1 class="text-2xl font-bold">问卷管理</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="transition-colors hover:text-[#5268bc]">后台首页</router-link>
        <span>/</span>
        <router-link to="/admin/exam" class="transition-colors hover:text-[#5268bc]">试卷管理</router-link>
        <span>/</span>
        <span class="text-gray-700">试卷列表</span>
      </nav>
    </div>

    <div class="p-5">
      <div class="mb-4 space-y-1 text-sm text-gray-500">
        <p>注意：已发布的问卷无法编辑或删除！存在未完成或未批改的答卷的问卷也无法编辑或删除！</p>
        <p>注意：删除题目只是逻辑删除，被逻辑删除的题目仅在批卷时可见</p>
        <p>
          注意：建议只在题目不严谨，需要完善的情况下使用"编辑题目"功能，其他情况请使用新建题目，尽量不要删除题目。因为系统只会保存用户的答题卡，不会保存源题目，改变题目原有的内容可能在阅卷时产生困扰。
        </p>
      </div>
      <hr class="mb-5 border-gray-200" />

      <div class="mb-5 flex gap-3">
        <MCButton length="medium" @click="toggleSetSurveyMetaData = true">新建问卷</MCButton>
        <MCButton length="medium" @click="importSurvey()">导入问卷</MCButton>
      </div>

      <div class="space-y-3">
        <p v-if="surveys.length === 0" class="py-8 text-center text-gray-400">暂无数据</p>
        <div v-for="survey in surveys" :key="survey.id" class="rounded-lg border border-gray-200 bg-gray-50/40 p-4">
          <div class="mb-1 flex items-center gap-2">
            <span
              v-show="survey.status === 1"
              class="inline-flex shrink-0 items-center gap-1 rounded border border-green-300 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 select-none"
            >
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              已发布
            </span>
            <span
              v-show="survey.status === 0"
              class="inline-flex shrink-0 items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 select-none"
            >
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-10h2v8h-2z"
                />
              </svg>
              未发布
            </span>
            <p class="text-xl font-bold">{{ survey.name }}</p>
          </div>
          <p class="mb-3 text-lg leading-relaxed text-gray-600">
            问卷描述：{{ survey.description }}，答题中的问卷：{{ survey.notCompletedCount }}，未批改的问卷：{{
              survey.notReviewedCount
            }}
          </p>
          <div class="flex flex-wrap gap-2">
            <MCButton length="medium" @click="editSurvey(survey)">查看问卷</MCButton>
            <MCButton length="medium" @click="exportSurvey(survey.id)">导出问卷</MCButton>
            <MCButton length="medium" :disabled="!survey.editable" @click="deleteSurvey(survey.id)">删除问卷</MCButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
