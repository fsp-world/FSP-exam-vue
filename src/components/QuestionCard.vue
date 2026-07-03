<script setup lang="ts">
import { computed, onMounted, watchEffect } from 'vue';
import { QuestionType, AnswerQuestion, AdminViewQuestion, AdminReviewQuestion, AnswerOption, AdminReviewOption, AdminViewOption } from '@/types/survey';
import { getStringQuestionType } from '@/utils/survey';

// 局部扩展类型 —— 不修改原始接口定义
type AnswerOptionExt = AnswerOption & { isSelected: boolean };
type AnswerQuestionExt = AnswerQuestion & { answer: string[] } //选择题内容是选择的选项的id，填空题和主观题数组第一个元素的值是用户输入

interface Props {
  index: number;
  mode: 'answer' | 'admin-view' | 'review';
  archived?: boolean;
}

type QuestionByMode = {
  'answer': AnswerQuestion
  'admin-view': AdminViewQuestion
  'review': AdminReviewQuestion
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'answer',
  archived: false
})

const { index, mode, archived } = props

const emit = defineEmits(['scoreChange']);

const question = defineModel<QuestionByMode[Props['mode']]>({ required: true });

const typeText = computed(() => getStringQuestionType(question.value.type));

function init() {
  // answer 模式下为所有选项初始化 isSelected，保证类型一致性
  if (mode === 'answer') {
    for (const opt of (question.value as AnswerQuestion).options) {
      (opt as AnswerOptionExt).isSelected = false;
    }
  }
  if (mode === 'review') {
    const q = question.value as AdminReviewQuestion;
    if (q.options[0].userAnsweredText == '') {
      q.options[0].userAnsweredText = '用户未作答';
    }
  }
}

// 单选题选择逻辑
const selectOption = (option: AnswerOptionExt) => {
  if (mode === 'answer' && question.value.type === QuestionType.SingleChoice) {
    for (const opt of (question.value as AnswerQuestion).options) {
      (opt as AnswerOptionExt).isSelected = false;
    }
    option.isSelected = !option.isSelected;
  }
};

// 设置得分
const handleScoreChange = (e: Event) => {
  if (mode === 'review' && e.target) {
    emit('scoreChange', {
      questionId: question.value.id,
      score: (e.target as HTMLSelectElement).value,
    });
  }
};

watchEffect(() => {
  init();
});

onMounted(() => {
  init();
});
</script>

<template>
  <div class="question">
    <div class="title">
      <span class="type"> {{ index + 1 }}.[{{ typeText }}] </span>
      <span class="text"> {{ question.title }}</span>
      <span class="score">({{ question.score }}分)</span>
      <span v-if="mode === 'review'">
        <select :value="(question as AdminReviewQuestion).userGetScore" :disabled="archived"
          @change="handleScoreChange($event)">
          <option v-for="i in 10" :value="i">{{ i }}分</option>
        </select>
      </span>
    </div>
    <ul class="images">
      <li v-for="pic in question.images">
        <img :src="pic.data" :alt="pic.alt" />
        <p>{{ pic.alt }}</p>
      </li>
    </ul>
    <!-- 选择题 -->
    <ul class="option-list" v-if="[QuestionType.SingleChoice, QuestionType.MultipleChoice].includes(question.type)">
      <li v-for="(option, optionIndex) in question.options" :key="optionIndex"
        :class="{ selected: (option as AnswerOptionExt).isSelected }" @click="selectOption(option as AnswerOptionExt)">
        <div v-if="mode === 'review' && (option as AdminReviewOption).isCorrect" class="correct-option"></div>
        {{ ['A.', 'B.', 'C.', 'D.'][optionIndex] }}{{ option.text }}
      </li>
    </ul>
    <!-- 填空题 -->
    <div v-if="question.type === QuestionType.FillInTheBlanks">
      <input v-if="mode === 'answer'" type="txet" required class="input-text" placeholder="请在此作答，前后不要有多余符号" @input="
        (e: Event) => {
          (question as AnswerQuestionExt).answer = [(e.target as HTMLSelectElement).value];
        }
      " />
      <div v-if="['admin-view', 'review'].includes(mode)">
        <p>标准答案：</p>
        <input type="txet" class="input-text" :placeholder="(question.options[0] as AdminViewOption).referenceAnswer"
          disabled />
      </div>
      <div v-if="mode === 'review'">
        <p>用户答案：</p>
        <input type="txet" class="input-text" :placeholder="(question.options[0] as AdminReviewOption).userAnsweredText"
          disabled />
      </div>
    </div>
    <!-- 主观题 -->
    <div v-if="question.type === QuestionType.Subjective"
      :class="{ resize: question.type === QuestionType.Subjective }">
      <textarea v-if="mode === 'answer'" required class="input-textarea" placeholder="请在此处作答" @input="
        (e: Event) => {
          (question as AnswerQuestionExt).answer = [(e.target as HTMLSelectElement).value];
        }
      "></textarea>
      <div v-if="mode === 'admin-view' || mode === 'review'">
        <p>参考答案：</p>
        <textarea class="input-textarea" disabled>
          {{ (question.options[0] as AdminReviewOption).referenceAnswer }}
        </textarea>
      </div>
      <div v-if="mode === 'review'">
        <p>用户答案：</p>
        <textarea class="input-textarea" disabled>
          {{ (question.options[0] as AdminReviewOption).userAnsweredText }}
        </textarea>
      </div>
    </div>
  </div>
</template>
<style scoped>
.question {
  position: relative;
}

.title {
  margin-bottom: 10px;
}

.title * {
  font-size: var(--qestion-font-size);
  user-select: none;
  line-height: 1.6em;
}

.title .type {
  width: 80px;
}

.title .text {
  color: #000;
}

.title .score {
  margin-left: 5px;
  color: #444;
}

.title select {
  border: 1px solid #000;
}

.option-list li {
  position: relative;
  padding: 5px;
  padding-left: 20px;
  font-size: var(--qestion-font-size);
  margin: 5px 0;
  border-radius: 5px;
  user-select: none;
  border: 1px solid #ffffff00;

  .correct-option {
    position: absolute;
    top: 6px;
    left: 2px;
    width: 16px;
    height: 16px;
    background-color: #54ff9f;
    border-radius: 50%;
  }
}

.option-list .option-hover:hover {
  background-color: #cccccc80;
}

.option-list .selected {
  border: 1px solid #000;
}

.images {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.images img {
  max-width: 400px;
  max-height: 300px;
}

.images p {
  text-align: center;
  font-size: 20px;
  padding: 5px;
}

.input-text {
  font-size: var(--qestion-font-size);
  width: 50%;
  background: none;
  border-bottom: 1px solid #000;
  padding: 5px;
  outline: none;
}

.input-textarea {
  font-size: var(--qestion-font-size);
  background: none;
  width: 100%;
  min-height: 100px;
  resize: vertical;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 5px;
  outline: none;
  position: relative;
}

.input-textarea::-webkit-input-placeholder {
  color: #444;
}

.input-textarea::-ms-input-placeholder {
  color: #444;
}

.input-textarea::placeholder {
  color: #444;
}

.resize::before {
  content: '';
  background: url(../assets/images/rainbow_pixel_gui/up-down-icon-1.png);
  position: absolute;
  background-size: contain;
  right: -30px;
  bottom: 0.5px;
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}

.resize:hover::before {
  background: url(../assets/images/rainbow_pixel_gui/up-down-icon-2.png);
  position: absolute;
  background-size: contain;
  right: -30px;
  bottom: 0.5px;
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
}
</style>
