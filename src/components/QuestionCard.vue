<script setup>
import { defineProps } from 'vue';
const { index, lock } = defineProps({
  index: Number,
  lock: {
    default: false,
    type: Boolean,
  },
});

const model = defineModel()

const selectOption = (selectedOption) => {
  if (lock) {
    return;
  }
  if (model.value.type === 'singleChoice') {
    for (let opt of model.value.options) {
      opt.select = false;
    }
  }
  selectedOption.select = !selectedOption.select;
  model.value.answer = [];
  for (let opt of model.value.options) {
    if (opt.select) {
      model.value.answer.push(opt.id);
    }
  }
}
</script>

<template>
  <div class="question">
    <div class="title">
      <span class="type">
        {{ index + 1 }}.
        <span v-if="model.type === 'singleChoice'"> [单选题] </span>
        <span v-else-if="model.type === 'multipleChoice'"> [多选题] </span>
        <span v-else-if="model.type === 'fillInTheBlanks'"> [填空题] </span>
        <span v-else-if="model.type === 'subjective'"> [主观题] </span>
        <span v-else>[未知类型]</span>
      </span>
      <span class="text"> {{ model.title }}</span>
      <span class="score">({{ model.score }}分)</span>
    </div>
    <ul class="option-list" v-if="model.type === 'singleChoice' || model.type === 'multipleChoice'">
      <li
        v-for="(option, optionIndex) in model.options"
        :key="optionIndex"
        @click="selectOption(option)"
        :class="[{ selected: option.select || option.isCorrect }, { 'option-hover': !lock }]"
      >
        {{ ['A.', 'B.', 'C.', 'D.'][optionIndex] }}{{ option.text }}
      </li>
    </ul>
    <ul v-if="model.img_url" class="images">
      <li v-for="pic in model.img_url">
        <img :src="pic" />
        <p>{{ pic }}</p>
      </li>
    </ul>
    <input
      type="txet"
      required
      class="input-text"
      v-model="model.options[0].text"
      :disabled="lock"
      v-if="model.type === 'fillInTheBlanks'"
    />
    <div :class="{ resize: model.type === 'subjective' }">
      <textarea
        required
        class="input-textarea"
        v-model="model.options[0].text"
        placeholder="请在此处作答"
        v-if="model.type === 'subjective'"
        :disabled="lock"
      ></textarea>
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
  padding: 5px;
  padding-left: 20px;
  font-size: var(--qestion-font-size);
  margin: 5px 0;
  border-radius: 5px;
  user-select: none;
  border: 1px solid #ffffff00;
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
