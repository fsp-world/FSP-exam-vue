<script setup>
import { ref, defineProps } from 'vue';
const { question, index, lock } = defineProps({
  question: Object,
  index: Number,
  lock: {
    default: false,
    type: Boolean,
  },
});

const emit = defineEmits(['onChange'])

function selectOption(question, selectedOption) {
  if (lock) {
    return
  }
  if (question.type === 'singleChoice') {
    for (let opt of question.options) {
      opt.select = false;
    }
  }
  selectedOption.select = !selectedOption.select;
  question.answer = '';
  for (let opt of question.options) {
    if (opt.select) {
      question.answer += opt.label;
    }
  }
}
</script>

<template>
  <div class="title">
    <span class="type">
      {{ index + 1 }}.
      <span v-if="question.type === 'singleChoice'"> [单选题] </span>
      <span v-else-if="question.type === 'multipleChoice'"> [多选题] </span>
      <span v-else-if="question.type === 'fillInTheBlanks'"> [填空题] </span>
      <span v-else-if="question.type === 'subjective'"> [主观题] </span>
      <span v-else>[未知类型]</span>
      <!-- <span>{{ question }}</span> -->
    </span>
    <span class="text"> {{ question.title }}</span>
    <span class="score">({{ question.score }}分)</span>
  </div>
  <ul class="option-list" v-if="question.type === 'singleChoice' || question.type === 'multipleChoice'">
    <li
      class="option"
      v-for="(option, optionIndex) in question.options"
      :key="optionIndex"
      @click="selectOption(question, option)"
      :class="{ selected: option.select || option.isCorrect }"
    >
      {{ ['A.', 'B.', 'C.', 'D.'][optionIndex] }}{{ option.text }}
    </li>
  </ul>
  <ul v-if="question.img_url" class="images">
    <li v-for="pic in question.img_url">
      <img :src="pic" />
      <p>{{ pic }}</p>
    </li>
  </ul>
  <input type="txet" required class="input-text" v-model="question.options[0].text" :disabled="lock" v-if="question.type === 'fillInTheBlanks'" />
  <div :class="{ resize: question.type === 'subjective' }">
    <textarea
      required
      class="input-textarea"
      v-model="question.options[0].text"
      placeholder="请在此处作答"
      v-if="question.type === 'subjective'"
      :disabled="lock"
    ></textarea>
  </div>
</template>

<style scoped>
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
  padding: 5px;
  padding-left: 20px;
  font-size: var(--qestion-font-size);
  margin: 5px 0;
  border-radius: 5px;
  user-select: none;
  border: 1px solid #ffffff00;
}

.option-list .option:hover {
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
  /* border: 1px solid #000; */
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  /* border-radius: 6px; */
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
</style>
