<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import { getSurveys, delSurvey } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';
import { importSurveyData, exportSurveyToJsonFile } from '@/utils/survey';
import { selectSingleFile } from '@/utils/file';
// @ts-ignore: Allow importing JS component into TS file.
import EditExam from './EditExam.vue';
import SetSurveyMetaData from './SetSurveyMetaData.vue';
import MCButton from '@/components/MCButton.vue';
import type { ISurvey } from '@/types';

const toggleSetSurveyMetaData = ref(false);

const surveysData = ref({
  code: -1,
  list: <ISurvey[]>[],
  desc: '',
});

const flag = ref(false);
const sid = ref(0);
const current_survey_editable = ref(false);

const attachEditableToSurveys = (surveys: ISurvey[]) => {
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
    res.data.list = attachEditableToSurveys(res.data.list);
    surveysData.value = res.data;
  } catch (error) {
    openAlert('获取问卷列表失败！');
  }
};

const editSurvey = (survey: ISurvey) => {
  flag.value = true;
  if (survey.id) {
    sid.value = survey.id;
    current_survey_editable.value = survey.editable ? true : false;
  }
};

const deleteSurvey = (id: number) => {
  const confirmDelete = confirm('确定要删除这个问卷吗，问卷中的题目会被一并删除！请三思！');
  if (confirmDelete) {
    const confirmInput = prompt('请输入：确认删除问卷');
    if (confirmInput === '确认删除问卷') {
      delSurvey(id).then((res) => {
        if (res.data.code === 0) {
          _getSurveys();
        }
        openAlert(res.data.desc);
      });
    } else {
      alert('二次确认失败');
    }
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
    :sid="sid"
    :editable="current_survey_editable"
    @close="flag = false"
    @flush="_getSurveys"
  ></EditExam>
  <SetSurveyMetaData :mode="'set'" v-model="toggleSetSurveyMetaData" @on-edit="_getSurveys"></SetSurveyMetaData>

  <div v-if="!flag" class="h-full overflow-y-auto">
    <h1 class="text-3xl mb-4 select-none">问卷管理</h1>
    <div class="text-sm text-gray-500 space-y-1 mb-4">
      <p>注意：已发布的问卷无法编辑或删除！存在未完成或未批改的答卷的问卷也无法编辑或删除！</p>
      <p>注意：删除题目只是逻辑删除，被逻辑删除的题目仅在批卷时可见</p>
      <p>注意：建议只在题目不严谨，需要完善的情况下使用"编辑题目"功能，其他情况请使用新建题目，尽量不要删除题目。因为系统只会保存用户的答题卡，不会保存源题目，改变题目原有的内容可能在阅卷时产生困扰。</p>
    </div>
    <hr class="border-gray-200 mb-5" />

    <div class="space-y-3">
      <p v-if="surveysData.list.length === 0" class="text-center text-gray-400 py-8">暂无数据</p>
      <div
        v-for="i in surveysData.list"
        :key="i.id"
        class="border border-gray-200 rounded-lg p-4 bg-gray-50/40"
      >
        <p class="text-xl font-bold mb-1">{{ i.name }}</p>
        <p class="text-lg text-gray-600 leading-relaxed mb-3">
          问卷描述：{{ i.description }}，答题中的问卷：{{ i.notCompletedCount }}，未批改的问卷：{{ i.notReviewedCount }}
        </p>
        <div class="flex flex-wrap gap-2">
          <span v-show="i.status === 1" class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded bg-green-100 text-green-700 select-none">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            已发布
          </span>
          <span v-show="i.status === 0" class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded bg-amber-100 text-amber-700 select-none">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2zm0-10h2v8h-2z"/></svg>
            未发布
          </span>
          <MCButton length="medium" @click="editSurvey(i)">查看问卷</MCButton>
          <MCButton length="medium" @click="exportSurvey(i.id)">导出问卷</MCButton>
          <MCButton length="medium" :disabled="!i.editable" @click="deleteSurvey(i.id)">删除问卷</MCButton>
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <MCButton length="medium" @click="toggleSetSurveyMetaData = true">新建问卷</MCButton>
        <MCButton length="medium" @click="importSurvey()">导入问卷</MCButton>
      </div>
    </div>
  </div>
</template>
