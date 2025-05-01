<script setup lang="ts">
import InfoDialog from '@/components/InfoDialog.vue';
import MCButton from '../MCButton.vue';
import { ref, inject } from 'vue';
import { openAlert } from '@/utils/TsAlert';
import { getSurveys, migrationQuestionAPI } from '@/apis/admin';
import type { ISurvey } from '@/types';

interface SurveyType extends ISurvey {
  selected: boolean;
  editable: boolean;
}

interface SurveysDataType {
  code: number;
  list: SurveyType[];
  desc: string;
}

const { sid, qid } = defineProps({
  sid: {
    type: Number,
    required: true,
  },
  qid: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['onEdit']);

const toggleMenu = defineModel<boolean>({ required: true });
const surveysData = ref<SurveysDataType>({
  code: -1,
  list: [],
  desc: '',
});

const complete = () => {
  let flag = false;
  for (const item of surveysData.value.list) {
    if (item.selected && item.id) {
      flag = true;
      const data = { target_sid: item.id, qid: qid };
      migrationQuestionAPI(data).then((res) => {
        if (res.data.code === 0) {
          openAlert(res.data.desc);
          toggleMenu.value = false;
          emit('onEdit');
        } else {
          openAlert(res.data.desc);
        }
      });
      break;
    }
  }
  if (!flag) {
    openAlert('请选择一个问卷');
  }
};

type AttachEditableToSurveys = (surveys: ISurvey[]) => SurveysDataType;
const attachEditableToSurveys = inject<AttachEditableToSurveys>('attachEditableToSurveys');
if (!attachEditableToSurveys) {
  throw new Error('attachEditableToSurveys must be provided by parent component');
}

const selectedSurvey = (index: number) => {
  for (const i of surveysData.value.list) {
    i.selected = false;
  }
  surveysData.value.list[index].selected = true;
};

const _getSurveys = async () => {
  try {
    const res = await getSurveys();
    res.data.list = attachEditableToSurveys(res.data.list);
    surveysData.value = res.data;
    surveysData.value.list = surveysData.value.list.filter((item) => item.id !== sid);
  } catch (error) {
    openAlert('获取问卷列表失败！');
    console.log(error);
  }
};
_getSurveys();
</script>
<template>
  <InfoDialog :show="toggleMenu" dialogType="book-card">
    <div class="migration-question-menu">
      <p class="title">想把这道题迁移到哪张问卷的末尾？</p>
      <p class="tips">已发布或存在未交卷、未批改答卷的问卷不能被编辑</p>
      <ul class="surveys">
        <li
          class="survey"
          :class="{ selected: item.selected }"
          v-for="(item, itemIndex) of surveysData.list"
          :key="item.id"
          @click="selectedSurvey(itemIndex)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="buttons">
        <MCButton class="btn" @click="toggleMenu = false">取消</MCButton>
        <MCButton class="btn" @click="complete()">确认</MCButton>
      </div>
    </div>
  </InfoDialog>
</template>
<style scoped>
.migration-question-menu {
  padding: 50px;
  display: flex;
  height: calc(100% - 100px);
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  .title {
    font-size: 26px;
    line-height: 1.5em;
    user-select: none;
  }
  .tips {
    font-size: 18px;
    line-height: 2em;
    color: #888;
    user-select: none;
  }
  .surveys {
    padding: 20px;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    .survey {
      text-align: left;
      padding: 10px;
      margin: 5px;
      border-radius: 5px;
      user-select: none;
    }
    .survey:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
    .selected {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .buttons {
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    gap: 15px;
    .btn {
      font-size: 26px;
      padding: 5px 10px;
      width: 30%;
    }
  }
}
</style>
