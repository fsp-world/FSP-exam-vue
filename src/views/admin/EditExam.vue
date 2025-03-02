<script setup>
import { getSurvey, addQuestion } from '@/apis/admin';
import QuestionCard from '@/components/QuestionCard.vue';
import { onMounted, ref } from 'vue';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();
const openAlert = (message) => {
  const data = {
    title: 'conf' + Date(),
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

const survey = ref({
  questions: [],
});

const formData = ref({
  survey: sid,
  title: '',
  type: 1,
  score: 1,
  options: [],
  answer: [],
});

const types = ref([
  { value: 1, name: '单选' },
  { value: 2, name: '多选' },
  { value: 3, name: '填空' },
  { value: 4, name: '简答' },
]);

const options = ref([{ text: '', url: [] }]); // 如果有图片，src装url里
const delOption = (index) => {
  options.value.splice(index, 1);
};
const newOption = () => {
  options.value.push({ text: '', url: [] });
};

onMounted(() => {
  getSurvey(sid).then((res) => {
    survey.value = res.data;
  });
});

const addQuest = () => {
  formData.value.options = options.value;
  const data = formData.value;
  addQuestion(data).then((res) => {
    openAlert(res.data['desc']);
    if (res.data['code'] === 0) {
      formData.value.title = '';
      formData.value.score = 1;
      formData.value.type = 1;
      formData.value.options = [];
      formData.value.answer = [];
      options.value = [{ type: 'text', text: '', url: '' }];
    }
  });
};
</script>

<template>
  <div class="editExam">
    <div class="close" @click="$emit('close', 0)"><span>&times;</span></div>
    <h2>{{ survey.name }}</h2>
    <p>{{ survey.description }}</p>
    <hr />
    <form class="new-question">
      <div class="title">在此添加题目：</div>
      <div class="content">
        <div class="meta">
          <label>题目类型：</label>
          <select class="type" v-model="formData.type">
            <option v-for="i in types" :key="i.value" :value="i.value">
              {{ i.name }}
            </option>
          </select>
          <div class="score">
            <label for="oname">分值：</label
            ><input id="score" type="number" v-model="formData.score" />
          </div>
        </div>
        <div class="data">
          <div>
            <label for="oname">问题：</label
            ><textarea
              class="question"
              id="oname"
              placeholder="请在此输入题目（不要输入题号和题目类型！）"
              v-model.trim="formData.title"
            ></textarea>
          </div>
          <div class="choice" v-if="formData.type === 1 || formData.type === 2">
            <p>选项列表：</p>
            <ul>
              <li class="option">
                <label class="num">编号</label
                ><label class="text">选项（前端会自动打乱选项顺序）</label
                ><label class="correct">正确答案</label>
                <label class="delete"></label>
              </li>
              <li
                class="option"
                v-for="(option, index) in options"
                :key="index"
              >
                <label class="num">选项{{ index + 1 }}</label>
                <div class="text">
                  <textarea
                    v-model="option.text"
                    placeholder="不要写例如ABCD这样的编号！"
                  ></textarea>
                </div>
                <div class="correct">
                  <input
                    v-if="formData.type === 1"
                    type="radio"
                    :value="index"
                    name="correct"
                    v-model="formData.answer"
                  />
                  <input
                    v-if="formData.type === 2"
                    type="checkbox"
                    id="{{ index }}"
                    :value="index"
                    name="correct"
                    v-model="formData.answer"
                  />
                </div>
                <div class="delete">
                  <button type="button" @click="delOption(index)">
                    删除选项
                  </button>
                </div>
              </li>
            </ul>
            <button type="button" class="new-option" @click="newOption">
              新建选项
            </button>
          </div>
          <div class="fill" v-if="formData.type === 3">
            <label>正确答案：</label>
            <input
              type="text"
              placeholder="正确答案"
              v-model="formData.answer"
            />
          </div>
          <div class="subjective" v-if="formData.type === 4">
            <label>参考答案：</label>
            <textarea
              placeholder="参考答案（解析）"
              v-model="formData.answer"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="end">
        <button type="button" class="submit-question" @click="addQuest">
          上传题目
        </button>
      </div>
    </form>
    <hr />
    <p class="sum-score">试卷总分：未知</p>
    <ul class="question-list">
      <li
        class="question"
        v-for="(question, questionIndex) in survey.questions"
        :key="questionIndex"
        :id="'question' + (questionIndex + 1)"
      >
        <QuestionCard
          :question="question"
          :index="questionIndex"
        ></QuestionCard>
      </li>
      <li v-if="!survey.questions.length">暂未添加题目</li>
    </ul>
  </div>
</template>

<style scoped>
.new-question {
  .title {
    padding: 10px 0;
    font-size: 25px;
    font-weight: bold;
  }
  .content {
    font-size: 20px;
    .meta {
      display: flex;
      height: 30px;
      line-height: 30px;

      .type {
        height: 30px;
        margin-right: 10px;
      }
      .score {
        display: flex;
        height: 100%;
        input {
          border-radius: 5px;
          width: 30px;
          padding: 5px;
        }
      }
    }
    .data {
      padding-top: 10px;
      p {
        margin-bottom: 10px;
      }
      .question {
        width: 100%;
        resize: vertical;
        margin: 10px 0;
        border-radius: 5px;
        padding: 5px;
        height: 20px;
      }
      .option {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
        gap: 10px;
        .num {
          width: 100px;
        }
        .text {
          width: 100%;
          textarea {
            padding: 5px;
            width: 100%;
            resize: vertical;
            min-height: 30px;
            border-radius: 5px;
          }
        }

        .correct {
          width: 150px;
          text-align: center;
          input {
            margin: 0 auto;
            height: 40px;
            width: 26px;
          }
        }

        .delete {
          min-width: 110px;

          button {
            height: 40px;
            font-size: 18px;
            padding: 5px;
            background-color: red;
            border-radius: 5px;
            text-align: center;
          }
        }
      }
      .new-option {
        font-size: 20px;
        padding: 5px;
        background-color: skyblue;
        border-radius: 5px;
        text-align: center;
        margin: 0 auto;
        width: 100%;
        height: 40px;
      }
      .fill {
        input {
          width: 100%;
          height: 20px;
          padding: 5px;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 5px;
        }
      }
      .subjective {
        textarea {
          width: 100%;
          height: 20px;
          padding: 5px;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 5px;
          resize: vertical;
          min-height: 30px;
        }
      }
    }
  }

  .end {
    .submit-question {
      font-size: 20px;
      text-align: center;
      padding: 5px;
      margin: 20px auto;
      border-radius: 5px;
      background-color: #ccc;
      width: 100%;
      height: 50px;
    }
  }
}
.editExam {
  width: 70%;
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  padding: 16px;
  background-color: #eee;
  border-radius: 8px;
}

.editExam .close {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 25px;
  background-color: white;
  border-radius: 50%;
  box-sizing: border-box;
}
.editExam .close span {
  margin: 2px 0px 0px 2px;
}
.editExam .close:hover {
  background-color: rgb(139, 139, 139);
}
.sum-score {
  font-size: 20px;
  text-align: center;
}
</style>
