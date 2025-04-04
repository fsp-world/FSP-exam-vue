<script setup>
import { delQuestion, getSurvey } from '@/apis/admin';
import QuestionCard from '@/components/QuestionCard.vue';
import editQuestion from '@/views/admin/EditQuestion.vue';
import { onMounted, ref } from 'vue';
import { addQuestion } from '@/apis/admin';
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();
const openAlert = (message) => {
  const data = {
    title: 'login' + Date(),
    type: 'info-card',
    message: message,
    age: 3000,
    flag: true,
  };
  alertStore.openAlert(data);
};

const { sid } = defineProps({
  sid: Number,
});

const displayEditQuestion = ref(false);
const currentMode = ref(null); // 当前模式："add" 或 "edit"
const currentData = ref(null); // 当前编辑的数据

const survey = ref({
  name: '加载中...',
  description: '加载中...',
  questions: [],
});

// 打开 editQuestion 组件
const openEditQuestion = (mode, data = null) => {
  currentMode.value = mode;
  currentData.value = data;
  displayEditQuestion.value = true;
};

// 删除题目
const deleteQuestion = (question) => {
  const tmp = question.title.slice(0, 10);
  const confirmDelete = confirm(`确定删除标题为"${tmp}..."的题目吗，任何状态下的问卷都会被影响！`);
  if (confirmDelete) {
    const confirmDeleteAgain = confirm('操作不可挽回，确定要删除吗！');
    if (confirmDeleteAgain) {
      delQuestion(question.id).then((res) => {
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

const handleEdit = (mode, formData) => {
  console.log(`操作类型: ${mode}`);
  if (mode === 'add') {
    addQuestion(formData);
  } else if (mode === 'edit') {
    console.log('编辑题目上传');
  }
  _getSurvey();
  closeEditQuestion();
};

// 关闭 editQuestion 组件
const closeEditQuestion = () => {
  displayEditQuestion.value = false;
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
    <editQuestion
      v-if="displayEditQuestion"
      :sid="sid"
      :mode="currentMode"
      :initial-data="currentData"
      @on-edit="handleEdit"
      @close="closeEditQuestion"
    ></editQuestion>
    <div class="survey-info">
      <div class="close" @click="$emit('close', 0)"><span>&times;</span></div>
      <h1 class="title">{{ survey.name }}</h1>
      <p class="desc">试卷描述：{{ survey.description }}</p>
      <p class="time">创建时间：{{ survey.create_time }}</p>
      <button type="button" class="edit-survey">编辑问卷信息（还没做）</button>
    </div>
    <hr />
    <div class="view-survey">
      <button type="button" class="add-question-button" @click="openEditQuestion('add')">添加题目</button>
      <div class="info">
        <p class="sum-score">试卷总分：{{ survey.sumScore }} 分</p>
        <button type="button" class="toggle-direction" @click="toggleDirection">正序/倒序</button>
      </div>
      <ul class="question-list" :style="{ flexDirection: viewSurveyDirection }">
        <li
          class="question"
          v-for="(question, questionIndex) in survey.questions"
          :key="questionIndex"
          :id="'question' + (questionIndex + 1)"
        >
          <span class="admin-button">
            <button type="button" class="edit" @click="openEditQuestion('edit', survey.questions[questionIndex])">
              编辑
            </button>
            <button type="button" class="delete" @click="deleteQuestion(question)">删除</button>
          </span>

          <QuestionCard
            :mode="'admin-view'"
            v-model="survey.questions[questionIndex]"
            :index="questionIndex"
          ></QuestionCard>
        </li>
        <li class="question-list-none" v-if="!survey.questions.length">暂未添加题目</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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

.edit-exam .add-question-button {
  font-size: 20px;
  padding: 12px 50px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  background-color: #00ffff;
}
.edit-exam .add-question-button:hover {
  background-color: #00bbff;
}

.edit-exam .survey-info {
  .edit-survey {
    font-size: 20px;
    padding: 5px 10px;
    border-radius: 5px;
    margin: 5px;
  }
  .close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 25px;
    background-color: white;
    border-radius: 50%;
    box-sizing: border-box;
  }
  .close span {
    margin: 2px 0px 0px 2px;
  }
  .close:hover {
    background-color: rgb(139, 139, 139);
  }
}

.edit-exam .view-survey {
  width: 100%;
  overflow-y: scroll;

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

  .question-list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(100% - 30px);
    gap: 30px;
    li {
      position: relative;
      width: calc(100% - 55px);
      .admin-button {
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
    }
  }

  .question-list-none {
    text-align: center;
    padding-top: 10px;
    font-size: 30px;
  }
}
</style>
