<script setup>
import { getSurvey, addQuestion } from '@/apis/admin';
import QuestionCard from '@/components/QuestionCard.vue';
import AddQuestion from '@/views/admin/AddQuestion.vue';
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
  name: '加载中...',
  description: '加载中...',
  questions: [],
});

// const defaultFormData = {
//   survey: sid,
//   title: '',
//   type: 1,
//   score: 5,
//   options: [{ text: '' }],
//   single_answer: undefined,
//   multiple_answer: [],
//   text_answer: '',
//   img_url: [],
// };

// const formData = ref({ ...defaultFormData });

// const types = ref([
//   { value: 1, name: '单选' },
//   { value: 2, name: '多选' },
//   { value: 3, name: '填空' },
//   { value: 4, name: '简答' },
// ]);

// const delOption = (index) => {
//   formData.value.options.splice(index, 1);
//   formData.value.multiple_answer = formData.value.multiple_answer.filter((item) => item.index !== index);
// };
// const newOption = () => {
//   formData.value.options.push({ ...defaultFormData.options[0] });
// };

onMounted(() => {
  _getSurvey()
});

const _getSurvey = () => {
  getSurvey(sid).then((res) => {
    survey.value = res.data;
    survey.value.sumScore = 0;
    for (let i in survey.value.questions) {
      survey.value.sumScore += survey.value.questions[i].score;
    }
  });
}

// const checkData = (data) => {
//   if (!data.title) {
//     return false;
//   }

//   switch (data.type) {
//     case 1: // 单选题
//       if (data.single_answer === undefined) {
//         return false;
//       }
//       data.answer = [];
//       data.answer.push(data.single_answer);
//       break;
//     case 2: // 多选题
//       if (!Array.isArray(data.multiple_answer) || data.multiple_answer.length === 0) {
//         return false;
//       }
//       data.answer = data.multiple_answer;
//       break;
//     case 3: // 简答题
//       if (!data.text_answer) {
//         return false;
//       }
//       data.options = [];
//       data.answer = [];
//       data.answer.push(data.text_answer);
//     case 4: // 论述题
//       if (!data.text_answer) {
//         return false;
//       }
//       data.options = [];
//       data.answer = [];
//       data.answer.push(data.text_answer);

//       break;
//     default:
//       return false; // 如果类型未知，返回 false
//   }

//   return true;
// };

// const addQuest = () => {
//   // future：图片的添加按钮
//   const newQuest = formData.value;
//   if (!checkData(newQuest)) {
//     openAlert('请将题目填写完整');
//   } else {
//     addQuestion(newQuest).then((res) => {
//       openAlert(res.data['desc']);
//       if (res.data['code'] === 0) {
//         formData.value = { ...defaultFormData };
//       }
//     });
//   }
// };
</script>

<template>
  <div class="edit-exam">
    <div>
      <div class="survey-info">
        <div class="close" @click="$emit('close', 0)"><span>&times;</span></div>
        <h1 class="title">{{ survey.name }}</h1>
        <p class="desc">试卷描述：{{ survey.description }}</p>
        <p class="time">创建时间：{{ survey.create_time }}</p>
      </div>
      <hr />
      <details>
        <summary>点击添加题目</summary>
        <AddQuestion :sid="sid" @on-add="(payload) => {_getSurvey()}"></AddQuestion>
        <!-- <form class="new-question">
          <div class="title"></div>
          <div class="content">
            <div class="meta">
              <label>题目类型：</label>
              <select class="type" v-model="formData.type">
                <option v-for="i in types" :key="i.value" :value="i.value">
                  {{ i.name }}
                </option>
              </select>
              <div class="score">
                <label for="oname">分值：</label><input id="score" type="number" v-model="formData.score" />
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
                    <label class="num">编号</label><label class="text">选项（前端会自动打乱选项顺序）</label
                    ><label class="correct">正确答案</label>
                    <label class="delete"></label>
                  </li>
                  <li class="option" v-for="(option, index) in formData.options" :key="index">
                    <label class="num">选项{{ index + 1 }}</label>
                    <div class="text">
                      <textarea v-model="option.text" placeholder="不要写例如ABCD这样的编号！"></textarea>
                    </div>
                    <div class="correct">
                      <input
                        v-if="formData.type === 1"
                        type="radio"
                        name="radio-correct"
                        :id="`option-${index}`"
                        :value="index"
                        v-model="formData.single_answer"
                      />
                      <input
                        v-if="formData.type === 2"
                        type="checkbox"
                        name="checkbox-correct"
                        :id="`option-${index}`"
                        :value="index"
                        v-model="formData.multiple_answer"
                        :key="`checkbox-${index}-${Date.now()}`"
                      />
                    </div>
                    <div class="delete">
                      <button type="button" @click="delOption(index)">删除选项</button>
                    </div>
                  </li>
                </ul>
                <button type="button" class="new-option" @click="newOption">新建选项</button>
              </div>
              <div class="fill" v-if="formData.type === 3">
                <label>正确答案：</label>
                <input type="text" placeholder="正确答案" v-model="formData.text_answer" />
              </div>
              <div class="subjective" v-if="formData.type === 4">
                <label>参考答案：</label>
                <textarea placeholder="参考答案（解析）" v-model="formData.text_answer"></textarea>
              </div>
            </div>
          </div>
          <div class="end">
            <button type="button" class="submit-question" @click="addQuest">上传题目</button>
          </div>
        </form> -->
      </details>
      <hr />
    </div>
    <div class="view-survey">
      <p class="sum-score">试卷总分：{{ survey.sumScore }} 分</p>
      <ul class="question-list">
        <li
          class="question"
          v-for="(question, questionIndex) in survey.questions"
          :key="questionIndex"
          :id="'question' + (questionIndex + 1)"
        >
          <QuestionCard :question="question" :index="questionIndex"></QuestionCard>
        </li>
        <li class="question-list-none" v-if="!survey.questions.length">暂未添加题目</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.edit-exam {
  max-width: 1000px;
  width: 90%;
  height: 85%;
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #eee;
  border-radius: 8px;
  summary {
    user-select: none;
  }
}

.edit-exam .survey-info {
  .close {
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
  .close span {
    margin: 2px 0px 0px 2px;
  }
  .close:hover {
    background-color: rgb(139, 139, 139);
  }
}

/* .edit-exam .new-question {
  --normal-font-size: 17px;
  --title-font-size: 25px;
  user-select: none;
  .title {
    padding: 10px 0;
    font-size: var(--title-font-size);
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
        font-size: var(--normal-font-size);
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
            font-size: var(--normal-font-size);
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
} */

.edit-exam .view-survey {
  flex-grow: 1;
  overflow: scroll;
  .sum-score {
    font-size: 20px;
    text-align: center;
    user-select: none;
  }
  .question-list {
    position: relative;
  }
  .question-list-none {
    text-align: center;
    padding-top: 10px;
    font-size: 30px;
  }
}
</style>
