<script setup>
import { defineProps, ref, computed } from 'vue';
const { index, lock, displayModel } = defineProps({
  index: Number,
  displayModel: {
    type: String,
    default: 'view', // 默认值为 "view"
  },
  lock: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['scoreChange']);
const model = defineModel();

const disModel = computed(() => ({
  view: displayModel === 'view',
  edit: displayModel === 'edit',
  review: displayModel === 'review',
}));

const QuestionCategory = {
  SINGLE_CHOICE: 1,
  MULTIPLE_CHOICE: 2,
  FILL_IN_THE_BLANKS: 3,
  SUBJECTIVE: 4,

  // 根据数值获取枚举名称的方法
  toName(value) {
    return Object.keys(this).find((key) => this[key] === value);
  },
};

const getQuestionTypeText = (questionType) => {
  switch (questionType) {
    case 1:
      return '单选题';
    case 2:
      return '多选题';
    case 3:
      return '填空题';
    case 4:
      return '主观题';
    default:
      return '未知题';
  }
};

const selectOption = (selectedOption) => {
  if (lock) {
    return;
  }
  if (model.value.type === QuestionCategory.SINGLE_CHOICE) {
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
};
</script>

<template>
  <div class="question">
    <div class="title">
      <span class="type"> {{ index + 1 }}.[{{ getQuestionTypeText(model.type) }}] </span>
      <span class="text"> {{ model.title }}</span>
      <span class="score">({{ model.score }}分)</span>
      <span v-if="model.answer && lock">
        <select
          :value="model.countScore"
          @change="(e) => emit('scoreChange', { questionId: model.id, score: e.target.value })"
        >
          <option v-for="i in 10" :value="i">{{ i }}分</option>
        </select>
      </span>
      <span v-if="disModel.edit" class="admin-button">
        <button type="button" class="edit">编辑</button>
        <button type="button" class="delete">删除</button>
      </span>
    </div>
    <ul class="images">
      <li v-for="pic in model.img_list">
        <img :src="pic.data" :alt="pic.alt" />
        <p>{{ pic.alt }}</p>
      </li>
    </ul>
    <ul class="option-list" v-if="model.type === 1 || model.type === 2">
      <li
        v-for="(option, optionIndex) in model.options"
        :key="optionIndex"
        @click="selectOption(option)"
        :class="[{ selected: option.select || option.isCorrect }, { 'option-hover': !lock }]"
      >
        <span
          v-if="model.answer && model.answer.map((item) => Number(item.text)).indexOf(option.id) != -1"
          style="
            display: inline-block;
            width: 16px;
            height: 16px;
            background-color: grey;
            border-radius: 50%;
            transform: translateY(2px);
          "
        ></span>
        {{ ['A.', 'B.', 'C.', 'D.'][optionIndex] }}{{ option.text }}
      </li>
    </ul>
    <input
      type="txet"
      required
      class="input-text"
      :placeholder="model.options[0].text"
      @input="
        (e) => {
          model.answer = [e.target.value];
        }
      "
      :disabled="lock"
      v-if="model.type === 3"
    />
    <div :class="{ resize: model.type === 4 }">
      <textarea
        required
        class="input-textarea"
        :placeholder="model.options[0].text"
        @input="
          (e) => {
            model.answer = [e.target.value];
          }
        "
        placeholder="请在此处作答"
        v-if="model.type === 4"
        :disabled="lock"
      ></textarea>
    </div>
    <p v-if="model.answer && lock && (model.type === 3 || model.type === 4)">用户答案：{{ model.answer[0]?.text }}</p>
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
.title .admin-button {
  display: flex;
  float: right;
  button {
    margin-left: 5px;
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
