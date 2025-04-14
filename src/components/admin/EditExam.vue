<script setup>
import { addQuestionAPI, editQuestionAPI, delQuestionAPI, getSurvey } from '@/apis/admin';
import QuestionCard from '@/components/QuestionCard.vue';
import EditQuestion from './EditQuestion.vue';
import SetSurveyMetaData from './SetSurveyMetaData.vue';
import { onMounted, ref } from 'vue';
import { openAlert } from '@/utils/TsAlert';

const { sid, editable } = defineProps({
  sid: {
    type: Number,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'flush']);

const toggleSetSurveyMetaData = ref(false);
const toggleEditQuestion = ref(false);
const currentMode = ref(null); // 当前模式："add" 或 "edit"
const currentData = ref(null); // 当前编辑的数据
const currentOrder = ref(undefined);

const survey = ref({
  name: '加载中...',
  description: '加载中...',
  create_time: '加载中...',
  questions: [],
});

// 打开 editQuestion 组件
const openEditQuestion = (mode, order, data = null) => {
  // 新建题目到末尾和编辑题目order都传0，新建题目并插入到指定位置，order就是具体的数字了
  currentMode.value = mode;
  currentData.value = data;
  currentOrder.value = order;
  toggleEditQuestion.value = true;
};

// 删除题目
const deleteQuestion = (question) => {
  const tmp = question.title.slice(0, 10);
  const confirmDelete = confirm(`确定删除标题为"${tmp}..."的题目吗，任何状态下的问卷都会被影响！`);
  if (confirmDelete) {
    const confirmDeleteAgain = confirm('操作不可挽回，确定要删除吗！');
    if (confirmDeleteAgain) {
      delQuestionAPI(question.id).then((res) => {
        openAlert(res.data.desc);
        if (res.data.code === 0) {
          _getSurvey();
        }
      });
    }
  }
};

onMounted(() => {
  _getSurvey();
});

const _getSurvey = () => {
  getSurvey(sid).then((res) => {
    survey.value = res.data;
    survey.value.sumScore = 0;
    for (let i in survey.value.questions) {
      survey.value.sumScore += survey.value.questions[i].score;
    }
  });
};

const SurveyMetaDataUpdate = () => {
  _getSurvey();
  emit('flush');
};

// 新建或编辑题目完成后，点击“上传题目”按钮，触发此函数
const handleEdit = (mode, formData) => {
  const handleRes = (res) => {
    if (res.code === 0) {
      closeEditQuestion();
      openAlert(res.desc);
      _getSurvey();
    } else {
      openAlert(res.desc);
    }
  };
  if (mode === 'add') {
    addQuestionAPI(formData).then((res) => {
      handleRes(res.data);
    });
  } else if (mode === 'edit') {
    editQuestionAPI(formData).then((res) => {
      handleRes(res.data);
    });
  }
};

// 关闭 editQuestion 组件
const closeEditQuestion = () => {
  toggleEditQuestion.value = false;
  currentMode.value = null;
  currentData.value = null;
};

const viewSurveyDirection = ref('column');
const toggleDirection = () => {
  viewSurveyDirection.value = viewSurveyDirection.value === 'column' ? 'column-reverse' : 'column';
};
</script>

<template>
  <div class="edit-exam">
    <div class="close" @click="emit('close')">&times;</div>
    <EditQuestion
      v-if="toggleEditQuestion"
      :sid="sid"
      :mode="currentMode"
      :order="currentOrder"
      :initial-data="currentData"
      @on-edit="handleEdit"
      @close="closeEditQuestion"
    ></EditQuestion>
    <SetSurveyMetaData
      :sid="sid"
      :mode="'set'"
      v-model="toggleSetSurveyMetaData"
      @on-edit="SurveyMetaDataUpdate"
    ></SetSurveyMetaData>
    <div class="top">
      <div class="meta">
        <p class="name">问卷名称：{{ survey.name }}</p>
        <p class="desc">问卷描述：{{ survey.description }}</p>
        <p class="time">创建时间：{{ survey.create_time }}</p>
      </div>
      <div class="button-menu">
        <button
          type="button"
          class="add-question-button"
          @click="toggleSetSurveyMetaData = true"
          :disabled="toggleEditQuestion || toggleSetSurveyMetaData || !editable"
        >
          编辑问卷信息
        </button>
        <button
          type="button"
          class="add-question-button"
          @click="openEditQuestion('add', 0)"
          :disabled="toggleEditQuestion || toggleSetSurveyMetaData || !editable"
        >
          末尾添加题目
        </button>
      </div>
      <div class="info">
        <p class="sum-score">试卷总分：{{ survey.sumScore }} 分</p>
        <button type="button" class="toggle-direction" @click="toggleDirection">正序/倒序</button>
      </div>
    </div>
    <div class="view-survey">
      <ul class="question-list" :style="{ flexDirection: viewSurveyDirection }">
        <li
          class="question"
          v-for="(question, questionIndex) in survey.questions"
          :key="questionIndex"
          :id="'question' + (questionIndex + 1)"
        >
          <span class="buttons">
            <button
              type="button"
              class="edit"
              @click="openEditQuestion('edit', 0, survey.questions[questionIndex])"
              :disabled="toggleEditQuestion || toggleSetSurveyMetaData || !editable"
            >
              编辑
            </button>
            <button
              type="button"
              class="delete"
              @click="deleteQuestion(question)"
              :disabled="toggleEditQuestion || toggleSetSurveyMetaData || !editable"
            >
              删除
            </button>
          </span>

          <QuestionCard
            :mode="'admin-view'"
            v-model="survey.questions[questionIndex]"
            :index="questionIndex"
          ></QuestionCard>
          <button
            type="button"
            class="insert"
            @click="openEditQuestion('add', question.display_order + 1, survey.questions[questionIndex])"
            :disabled="toggleEditQuestion || toggleSetSurveyMetaData || !editable"
          >
            在后方插入新题目
          </button>
        </li>
        <li class="question-list-none" v-if="!survey.questions.length">暂未添加题目</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.close {
  width: 50px;
  height: 50px;
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 40px;
  line-height: 50px;
  text-indent: 14px;
  background-color: #eee;
  border-radius: 50%;
  box-sizing: border-box;
  z-index: 6;
}
.close:hover {
  background-color: #ccc;
}
.edit-exam {
  width: calc(100% - 32px);
  height: calc(100% - 32px);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #fff;
}
.meta {
  font-size: 20px;
  padding-bottom: 10px;
}
.button-menu {
  display: flex;
  gap: 10px;
}
.add-question-button {
  font-size: 20px;
  padding: 12px 50px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  background-color: #00ffff;
}
.add-question-button:hover {
  background-color: #00bbff;
}
.info {
  display: flex;
  height: 40px;
  padding: 5px 8px;
  justify-content: center;
  gap: 20px;
  background-color: #eee;
  border-radius: 5px;
  margin-bottom: 10px;
  .sum-score {
    font-size: 20px;
    text-align: center;
    user-select: none;
    line-height: 30px;
    padding: 5px;
  }

  .toggle-direction {
    height: 40px;
    font-size: 20px;
    padding: 5px 8px;
    border-radius: 5px;
  }

  .toggle-direction:hover {
    background-color: #ccc;
  }
}

.view-survey {
  width: 100%;
  overflow-y: scroll;

  .question-list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(100% - 30px);
    gap: 30px;
    li {
      position: relative;
      width: calc(100% - 55px);
      .buttons {
        width: 55px;
        position: absolute;
        top: 0;
        right: -75px;
        z-index: 5;
        button {
          font-size: 15px;
          margin: 5px;
          display: block;
          padding: 3px 5px;
          border-radius: 5px;
          background-color: #eee;
        }
        .edit:hover {
          background-color: #ccc;
        }
        .delete {
          background-color: red;
        }
        .delete:hover {
          background-color: crimson;
        }
      }
      .insert {
        font-size: 15px;
        margin: 5px;
        display: block;
        padding: 3px 5px;
        border-radius: 5px;
        background-color: #eee;
      }
      .insert:hover {
        background-color: #ccc;
      }
    }
  }

  .question-list-none {
    text-align: center;
    padding-top: 10px;
    font-size: 30px;
  }
}
</style>
