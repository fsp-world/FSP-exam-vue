<template>
  <form class="new-question">
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
            <li class="option" v-for="(item, index) in formData.options" :key="index">
              <label class="num">选项{{ index + 1 }}</label>
              <div class="text">
                <textarea v-model="item.option" placeholder="不要写例如ABCD这样的编号！"></textarea>
              </div>
              <div class="correct">
                <input
                  v-if="formData.type === 1"
                  type="radio"
                  name="radio-correct"
                  :id="`option-${index}`"
                  value="1"
                  v-model="item.isAnswer"
                />
                <input
                  v-if="formData.type === 2"
                  type="checkbox"
                  name="checkbox-correct"
                  :id="`option-${index}`"
                  :value="index"
                  v-model="item.isAnswer"
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
      </div>
    </div>
    <div class="end">
      <button type="button" class="submit-question" @click="addQuest">上传题目</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const { sid } = defineProps({
  sid: {
    type: Number,
    required: true,
  },
});

interface IFormData {
  survey: number;
  title: string;
  type: number;
  score: number;
  options: Array<IOption>;
  img_url: Array<string>;
}

interface IOption {
  option: string;
  isAnswer: boolean;
}

const defaultFormData: IFormData = {
  survey: sid,
  title: '',
  type: 1,
  score: 5,
  options: [{ option: '', isAnswer: false }],
  img_url: [],
};

const formData: IFormData = reactive<IFormData>({ ...defaultFormData });

const types = ref([
  { value: 1, name: '单选' },
  { value: 2, name: '多选' },
  { value: 3, name: '填空' },
  { value: 4, name: '简答' },
]);

const delOption = (i: number) => {

}

const newOption = () => {
  formData.options.push({ ...defaultFormData.options[0] });
};

const addQuest = () => {
  console.log(formData);
}
</script>

<style scoped>
.new-question {
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
}
</style>
