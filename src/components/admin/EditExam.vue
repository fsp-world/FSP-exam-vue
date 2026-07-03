<script setup lang="ts">
import { getSurvey, addQuestionAPI, editQuestionAPI, delQuestionAPI, sortQuestionsAPI } from '@/apis/admin';
import QuestionCard from '@/components/QuestionCard.vue';
import EditQuestion from './EditQuestion.vue';
import SetSurveyMetaData from './SetSurveyMetaData.vue';
import MigrationQuestionMenu from './MigrationQuestionMenu.vue';
import MCButton from '@/components/MCButton.vue';
import ModalCloseButton from './ModalCloseButton.vue';
import { ref, computed } from 'vue';
import { openAlert } from '@/utils/TsAlert';
import { dateFormatYYYYMMDDHH } from '@/utils/date';
import type { UploadEditQuestion, AdminViewQuestion, AdminViewSurvey, ModeType, UploadAddQuestion, EditQuestionData } from '@/types/survey';
import type { FetchResponse } from '@/types';

interface Props {
  sid: number
  editable: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
})

const emit = defineEmits(['close', 'flush']);

const toggleSetSurveyMetaData = ref(false);
const toggleEditQuestion = ref(false);
const toggleSortQuestionMode = ref(false);
const toggleMigrationQuestionMenu = ref(false);
const migrationQuestionId = ref(0);
const currentMode = ref<ModeType>('add');
const currentData = ref<AdminViewQuestion | null>(null);
const currentOrder = ref(0);

const migrationQuestion = (question_id: number) => {
  toggleMigrationQuestionMenu.value = true;
  migrationQuestionId.value = question_id;
};

const survey = ref<AdminViewSurvey>({
  id: props.sid,
  name: '加载中...',
  description: '加载中...',
  createTime: '加载中...',
  questions: [],
});
const sumScore = ref(0);

const openEditQuestion = (mode: ModeType, order: number, data: AdminViewQuestion | null = null) => {
  currentMode.value = mode;
  currentData.value = data;
  currentOrder.value = order;
  toggleEditQuestion.value = true;
};

const deleteQuestion = (question: AdminViewQuestion) => {
  const tmp = question.title.slice(0, 10);
  const confirmDelete = confirm(`确定删除标题为"${tmp}..."的题目吗，任何状态下的问卷都会被影响！`);
  if (confirmDelete) {
    const confirmDeleteAgain = confirm('操作不可挽回，确定要删除吗！');
    if (confirmDeleteAgain) {
      delQuestionAPI(question.id).then((res) => {
        openAlert(res.data.desc);
        if (res.data.code === 0) _getSurvey();
      });
    }
  }
};

const _getSurvey = () => {
  getSurvey(props.sid).then((res) => {
    survey.value = res.data.data;
    sumScore.value = 0;
    for (let i in survey.value.questions) {
      sumScore.value += survey.value.questions[i].score;
    }
    orderMapBak = survey.value.questions.map(({ id, display_order }) => ({ id, display_order }));
    orderMap.value = JSON.parse(JSON.stringify(orderMapBak));
  });
};

_getSurvey();

const SurveyMetaDataUpdate = () => {
  _getSurvey();
  emit('flush');
};

const handleEdit = (mode: string, QuestionData: EditQuestionData) => {
  const handleRes = (res: FetchResponse) => {
    if (res.data.code === 0) {
      closeEditQuestion();
      openAlert(res.data.desc);
      _getSurvey();
    } else {
      openAlert(res.data.desc);
    }
  };

  if (mode === 'add') {
    const sendData: UploadAddQuestion = {
      surveyId: props.sid,
      questions: [QuestionData],
    };
    addQuestionAPI(sendData).then((res) => handleRes(res));
  } else if (mode === 'edit') {
    const sendData: UploadEditQuestion = {
      surveyId: props.sid,
      question: QuestionData,
    };
    editQuestionAPI(sendData).then((res) => handleRes(res));
  }
};

const closeEditQuestion = () => {
  toggleEditQuestion.value = false;
  currentMode.value = 'add';
  currentData.value = null;
};

const viewSurveyDirection = ref<'column' | 'column-reverse'>('column');
const toggleDirection = () => {
  viewSurveyDirection.value = viewSurveyDirection.value === 'column' ? 'column-reverse' : 'column';
};

const disabledButton = computed(() => {
  return toggleEditQuestion.value || toggleSetSurveyMetaData.value || toggleSortQuestionMode.value || !props.editable;
});

interface OrderMapItem {
  id: number;
  display_order: number;
}

const orderMap = ref<OrderMapItem[]>([]);
let orderMapBak: OrderMapItem[] = [];

const displayQuestions = computed(() => {
  // 1. 先把 orderMap 按 display_order 从小到大排序
  orderMap.value.sort((a, b) => a.display_order - b.display_order);

  // 2. 遍历排序后的 orderMap，对每一项 i，
  //    从 survey.value.questions 中找出 id 与 i.id 相同的题目
  // .filter(<T>(q: T | undefined): q is T => q !== undefined) 排除find失效
  return orderMap.value
    .map((i) => survey.value.questions.find((j) => j.id === i.id))
    .filter(<T>(q: T | undefined): q is T => q !== undefined)
});

const startSort = () => { toggleSortQuestionMode.value = true; };
const cancelSort = () => {
  toggleSortQuestionMode.value = false;
  orderMap.value = JSON.parse(JSON.stringify(orderMapBak));
};

const moveItem = (questionId: number) => {
  const inputGoToIndex = prompt('要和哪题交换位置？请输入那题的编号');
  if (inputGoToIndex != null && inputGoToIndex != '') {
    const goToIndex = parseInt(inputGoToIndex) - 1;
    if (goToIndex > -1 && goToIndex < orderMap.value.length) {
      for (let index = 0; orderMap.value.length; index++) {
        if (orderMap.value[index].id === questionId) {
          const tmp = orderMap.value[index].display_order;
          orderMap.value[index].display_order = orderMap.value[goToIndex].display_order;
          orderMap.value[goToIndex].display_order = tmp;
          break;
        }
      }
    } else { openAlert('输入无效'); }
  } else { openAlert('输入无效'); }
};

const moveUpItem = (questionId: number) => {
  for (let index = 0; orderMap.value.length; index++) {
    if (orderMap.value[index].id === questionId) {
      const tmp = orderMap.value[index].display_order;
      orderMap.value[index].display_order = orderMap.value[index - 1].display_order;
      orderMap.value[index - 1].display_order = tmp;
      break;
    }
  }
};

const moveDownItem = (questionId: number) => {
  for (let index = 0; index < orderMap.value.length; index++) {
    if (orderMap.value[index].id === questionId) {
      const tmp = orderMap.value[index].display_order;
      orderMap.value[index].display_order = orderMap.value[index + 1].display_order;
      orderMap.value[index + 1].display_order = tmp;
      break;
    }
  }
};

const submitSort = () => {
  sortQuestionsAPI(orderMap.value).then((res: FetchResponse) => {
    if (res.data.code === 0) {
      toggleSortQuestionMode.value = false;
      openAlert(res.data.desc);
      _getSurvey();
    } else { openAlert(res.data.desc); }
  });
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50" @click.self="emit('close')">
        <div
          class="bg-white md:rounded-xl shadow-2xl w-full md:w-[95vw] max-w-6xl h-full md:h-[90vh] flex flex-col overflow-hidden relative">

          <EditQuestion v-if="toggleEditQuestion" :mode="currentMode" :order="currentOrder" :initial-data="currentData"
            @on-edit="handleEdit" @close="closeEditQuestion" />
          <SetSurveyMetaData :sid="props.sid" :mode="'set'" v-model="toggleSetSurveyMetaData"
            @on-edit="SurveyMetaDataUpdate" />
          <MigrationQuestionMenu v-if="toggleMigrationQuestionMenu" :sid="props.sid" :qid="migrationQuestionId"
            v-model="toggleMigrationQuestionMenu" @on-edit="_getSurvey()" />

          <!-- 关闭按钮 -->
          <ModalCloseButton @click="emit('close')" />

          <!-- 顶部信息区 -->
          <div class="px-4 md:px-6 pt-4 md:pt-6 pb-2 shrink-0">
            <div class="text-base md:text-xl pb-2.5 space-y-1">
              <p class="font-bold">问卷名称：{{ survey.name }}</p>
              <p>问卷描述：{{ survey.description }}</p>
              <p>创建时间：{{ dateFormatYYYYMMDDHH(survey.createTime) }}</p>
            </div>

            <!-- 按钮菜单 -->
            <div class="flex flex-wrap gap-2 md:gap-2.5 mb-2.5">
              <p v-if="!props.editable"
                class="w-full text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-1">
                此问卷已发布或存在未处理答卷，无法编辑</p>
              <MCButton v-show="!toggleSortQuestionMode" length="medium" :disabled="disabledButton"
                @click="toggleSetSurveyMetaData = true">编辑问卷信息</MCButton>
              <MCButton v-show="!toggleSortQuestionMode" length="medium" :disabled="disabledButton"
                @click="openEditQuestion('add', 0)">末尾添加题目</MCButton>
              <MCButton v-show="!toggleSortQuestionMode" length="medium" :disabled="disabledButton"
                @click="startSort()">题目排序模式</MCButton>
              <div v-show="toggleSortQuestionMode" class="flex flex-1 min-w-[100px] gap-2">
                <MCButton length="medium" @click="submitSort()">提交排序</MCButton>
                <MCButton length="medium" disabled-style @click="cancelSort()">取消排序</MCButton>
              </div>
            </div>

            <!-- 信息栏 -->
            <div class="flex flex-wrap items-center justify-center gap-2 md:gap-5 py-2 px-2 mb-2.5 bg-gray-200 rounded">
              <p class="text-sm md:text-xl select-none">试卷总分：{{ sumScore }} 分</p>
              <MCButton length="medium" @click="toggleDirection">正序/倒序</MCButton>
            </div>
          </div>

          <!-- 题目列表 -->
          <div class="flex-1 overflow-y-auto px-4 md:px-6 pb-4 md:pb-6">
            <div class="flex flex-col gap-5 md:gap-7.5 md:pr-25" :style="{ flexDirection: viewSurveyDirection }">
              <div v-for="(question, questionIndex) in displayQuestions" :key="question.id"
                :id="'question' + question.id" class="relative w-full">

                <!-- 操作按钮（桌面端右侧固定 / 移动端内联） -->
                <span v-show="!toggleSortQuestionMode"
                  class="md:absolute md:top-0 md:-right-18 flex flex-row md:flex-col gap-1.5 mb-2 md:mb-0 z-25">
                  <MCButton length="short" :disabled="disabledButton"
                    @click="openEditQuestion('edit', 0, displayQuestions[questionIndex])">编辑</MCButton>
                  <MCButton length="short" :disabled="disabledButton" @click="migrationQuestion(question.id)">迁移
                  </MCButton>
                  <MCButton length="short" :disabled="disabledButton" disabled-style @click="deleteQuestion(question)">
                    删除</MCButton>
                </span>

                <!-- 排序按钮 -->
                <span v-show="toggleSortQuestionMode"
                  class="md:absolute md:top-0 md:-right-25 flex flex-row md:flex-col gap-1.5 mb-2 md:mb-0 z-25">
                  <MCButton length="short" :disabled="orderMap[questionIndex].display_order === 1"
                    @click="moveUpItem(question.id)">上移</MCButton>
                  <MCButton length="short" @click="moveItem(question.id)">指定位置</MCButton>
                  <MCButton length="short" :disabled="orderMap[questionIndex].display_order === displayQuestions.length"
                    @click="moveDownItem(question.id)">下移</MCButton>
                </span>

                <QuestionCard :index="questionIndex" :mode="'admin-view'" v-model="displayQuestions[questionIndex]" />

                <MCButton length="medium" :disabled="disabledButton"
                  @click="openEditQuestion('add', question.display_order + 1, displayQuestions[questionIndex])">在后方插入新题目
                </MCButton>
              </div>
              <p v-if="survey.questions.length === 0" class="text-center pt-2.5 text-xl md:text-3xl text-gray-400">
                暂未添加题目</p>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active>div,
.modal-fade-leave-active>div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from>div,
.modal-fade-leave-to>div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
