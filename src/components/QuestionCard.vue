<script setup lang="ts">
import { defineProps, onMounted, watchEffect } from 'vue';
import { getStringQuestionType, IOption, IQuestion } from '@/types';
import { QuestionType } from '@/utils/enum';

const { index, mode, archived } = defineProps({
  index: {
    type: Number,
    required: true,
  },
  mode: {
    type: String as () => 'view' | 'admin-view' | 'review',
    default: 'view',
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['scoreChange']);

const question = defineModel<IQuestion>({ required: true });

function init() {
  question.value.typeText = getStringQuestionType(question.value.type);
  if (mode === 'review' && question.value.options[0].inputText == '') {
    question.value.options[0].inputText = '用户未作答';
  }
}

const selectOption = (selectedOption: IOption) => {
  if (mode === 'view') {
    if (question.value.type === QuestionType.SingleChoice) {
      for (let opt of question.value.options) {
        opt.isSelected = false;
      }
    }
    selectedOption.isSelected = !selectedOption.isSelected;
    question.value.answer = [];
    for (let opt of question.value.options) {
      if (opt.isSelected && opt.id !== undefined) {
        question.value.answer.push(opt.id);
      }
    }
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
      <span class="type"> {{ index + 1 }}.[{{ question.typeText }}] </span>
      <span class="text"> {{ question.title }}</span>
      <span class="score">({{ question.score }}分)</span>
      <span v-if="mode === 'review'">
        <select
          :value="question.userGetScore"
          :disabled="archived"
          @change="
            (e: Event) => emit('scoreChange', { questionId: question.id, score: (e.target as HTMLSelectElement).value })
          "
        >
          <option v-for="i in 10" :value="i">{{ i }}分</option>
        </select>
      </span>
    </div>
    <ul class="images">
      <li v-for="pic in question.img_list">
        <img :src="pic.data" :alt="pic.alt" />
        <p>{{ pic.alt }}</p>
      </li>
    </ul>
    <!-- 选择题 -->
    <ul
      class="option-list"
      v-if="question.type === QuestionType.SingleChoice || question.type === QuestionType.MultipleChoice"
    >
      <li
        v-for="(option, optionIndex) in question.options"
        :key="optionIndex"
        :class="{ selected: option.isSelected }"
        @click="selectOption(option)"
      >
        <div v-if="option.isCorrect" class="correct-option"></div>
        {{ ['A.', 'B.', 'C.', 'D.'][optionIndex] }}{{ option.text }}
      </li>
    </ul>
    <!-- 填空题 -->
    <div v-if="question.type === QuestionType.FillInTheBlanks">
      <input
        v-if="mode === 'view'"
        type="txet"
        required
        class="input-text"
        placeholder="请在此作答，前后不要有多余符号"
        @input="
          (e: Event) => {
            question.answer = [(e.target as HTMLSelectElement).value];
          }
        "
      />
      <div v-if="mode === 'admin-view' || mode === 'review'">
        <p>标准答案：</p>
        <input type="txet" class="input-text" :placeholder="question.options[0].text" disabled />
      </div>
      <div v-if="mode === 'review'">
        <p>用户答案：</p>
        <input type="txet" class="input-text" :placeholder="question.options[0].inputText" disabled />
      </div>
    </div>
    <!-- 主观题 -->
    <div
      v-if="question.type === QuestionType.Subjective"
      :class="{ resize: question.type === QuestionType.Subjective }"
    >
      <textarea
        v-if="mode === 'view'"
        required
        class="input-textarea"
        placeholder="请在此处作答"
        @input="
          (e: Event) => {
            question.answer = [(e.target as HTMLSelectElement).value];
          }
        "
      ></textarea>
      <div v-if="mode === 'admin-view' || mode === 'review'">
        <p>参考答案：</p>
        <textarea class="input-textarea" disabled>
          {{ question.options[0].text }}
        </textarea>
      </div>
      <div v-if="mode === 'review'">
        <p>用户答案：</p>
        <textarea class="input-textarea" disabled>
          {{ question.options[0].inputText }}
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
