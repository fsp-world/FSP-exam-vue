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
          <label for="oname">分值：</label>
          <select v-model="formData.score" id="score">
            <option v-for="i in 10" :value="i">{{ i }}分</option>
          </select>
        </div>
      </div>
      <div class="data">
        <div>
          <label for="oname">问题描述：</label
          ><textarea
            class="question"
            id="oname"
            placeholder="请在此输入问题（不要输入题号和题目类型！）"
            v-model.trim="formData.title"
          ></textarea>
        </div>
        <details class="img-list">
          <summary>图片列表（可选）：</summary>
          <ul>
            <li class="option">
              <div class="num">编号</div>
              <div class="img-input">上传方式1</div>
              <div class="text">上传方式2</div>
              <div class="delete"></div>
            </li>
            <li class="option" v-for="(item, index) in formData.img_list" :key="item.key">
              <span style="display: none">{{ item.alt = `图${index + 1}` }}</span>
              <div class="num">图{{ index + 1 }}</div>
              <div class="img-input">
                <input type="file" accept="image/*" @change="handleFileUpload($event, index)" />
              </div>
              <div class="text">
                <textarea v-model="item.data" placeholder="e.g. https://exam.fsp.ink/assets/images/23-1.png"></textarea>
              </div>
              <div class="delete">
                <button type="button" @click="delQuestionImgURL(item.key)">删除选项</button>
              </div>
            </li>
          </ul>
          <button type="button" class="new-option" @click="newQestionImgURL">新建图片</button>
        </details>
        <div class="choice">
          <p>{{ types[formData.type - 1].optionTitle }}</p>
          <ul>
            <li class="option" v-if="formData.type === 1 || formData.type === 2">
              <label class="num">编号</label><label class="text">选项（前端会自动打乱选项顺序）</label
              ><label class="correct">正确选项</label>
              <label class="delete"></label>
            </li>
            <li class="option" v-for="(item, index) in formData.options" :key="item.key">
              <label class="num" v-show="formData.type === 1 || formData.type === 2">选项{{ index + 1 }}</label>
              <div class="text">
                <textarea v-model="item.option" :placeholder="types[formData.type - 1].placeholder"></textarea>
              </div>
              <div class="correct" v-show="formData.type === 1 || formData.type === 2">
                <input
                  v-if="formData.type === 1"
                  type="radio"
                  name="radio-correct"
                  :id="`option-${item.key}`"
                  @change="onChange(item)"
                />
                <input
                  v-if="formData.type === 2"
                  type="checkbox"
                  name="checkbox-correct"
                  :id="`option-${index}`"
                  :value="index"
                  v-model="item.isAnswer"
                  :key="`checkbox-${item.key}`"
                />
                <input
                  v-if="formData.type === 3 || formData.type === 4"
                  type="radio"
                  name="radio-correct"
                  :id="`option-${item.key}`"
                  :checked="item.isAnswer"
                  disabled
                />
              </div>
              <div class="delete" v-if="formData.type === 1 || formData.type === 2">
                <button type="button" @click="delOption(item.key)">删除选项</button>
              </div>
            </li>
          </ul>
          <button type="button" v-if="formData.type === 1 || formData.type === 2" class="new-option" @click="newOption">
            新建选项
          </button>
        </div>
      </div>
    </div>
    <div class="end">
      <button type="button" class="submit-question" @click="addQuest">上传题目</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { addQuestion } from '@/apis/admin';
import { IQuestion, IOption, IImg } from '@/types';
import { compressionFile } from '@/utils/imageCompression';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const { sid } = defineProps({
  sid: {
    type: Number,
    required: true,
  },
});

const defaultFormData: IQuestion = {
  survey: sid,
  title: '',
  type: 1,
  score: 5,
  options: [],
  img_list: [],
};

const types = ref([
  { value: 1, name: '单选', optionTitle: '单选列表：', placeholder: '不要写例如 A.B.C.D. 这样的编号！' },
  { value: 2, name: '多选', optionTitle: '多选列表：', placeholder: '不要写例如 A.B.C.D. 这样的编号！' },
  { value: 3, name: '填空', optionTitle: '正确答案：', placeholder: '请在此输入正确答案，不要有多余符号' },
  { value: 4, name: '简答', optionTitle: '参考答案：', placeholder: '请在此输入参考答案' },
]);

const defaultOption: IOption = {
  key: '',
  option: '',
  isAnswer: false,
};

const defaultImg: IImg = {
  key: '',
  alt: '',
  data: '',
};

// 生成唯一键值
const generateUniqueKey = (): string => {
  return crypto.randomUUID();
};

const formData: IQuestion = reactive<IQuestion>({ ...defaultFormData });

const newOption = () => {
  const obj = { ...defaultOption };
  obj.key = generateUniqueKey();
  formData.options.push(obj);
  if (formData.type === 3 || formData.type === 4) {
    formData.options[0].isAnswer = true;
  }
};

const newQestionImgURL = () => {
  const obj = { ...defaultImg };
  obj.key = generateUniqueKey();
  formData.img_list.push(obj);
};

newOption();
newQestionImgURL();

// 通用删除函数
const deleteByKey = <T extends { key: string }>(array: T[], key: string): void => {
  const index = array.findIndex((item) => item.key === key);
  if (index !== -1) {
    array.splice(index, 1);
  }
};

// 删除选项
const delOption = (key: string) => {
  deleteByKey(formData.options, key);
};

// 删除图片 URL
const delQuestionImgURL = (key: string) => {
  deleteByKey(formData.img_list, key);
};

const onChange = (item: IOption) => {
  for (let i of formData.options) {
    i.isAnswer = false;
  }
  item.isAnswer = true;
};

// 处理文件上传
const handleFileUpload = (event: Event, index: number): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  // 检查文件类型是否为图片
  if (!file.type.startsWith('image/')) {
    alert('请选择有效的图片文件');
    return;
  }

  // 检查文件大小是否超过5MB
  if (file.size > MAX_IMAGE_SIZE) {
    alert('图片大小不能超过5MB');
    return;
  }

  // 检查是否已经有文本链接
  if (formData.img_list[index].data.trim()) {
    alert('已存在图片链接，忽略文件上传！');
    return;
  }

  // 调用图片压缩方法
  compressionFile(file, 'image/jpeg', 0.5)
    .then((compressedFile) => {
      // 将压缩后的文件转换为 Base64
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const base64String = e.target?.result as string;
        formData.img_list[index].data = base64String; // 更新数据
        console.log('图片压缩并更新成功:', formData.img_list[index]);
      };
      reader.readAsDataURL(compressedFile);
    })
    .catch((error) => {
      console.error('图片压缩或处理失败:', error);
      alert('图片处理失败，请重试！');
    });
};

const emit = defineEmits(['onAdd']);

const addQuest = () => {
  addQuestion(formData).then(() => {
    formData.title = '';
    formData.options = [];
    formData.img_list = [];
    newOption();
    newQestionImgURL();
    emit('onAdd', formData);
  });
};

watch(
  () => formData.type,
  (newVal, _) => {
    if (newVal === 3 || newVal === 4) {
      formData.options = [];
      newOption();
      formData.options[0].isAnswer = true;
    }
  },
);
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
          border: 1px solid #888;
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
      .img-list {
        margin-bottom: 10px;
        summary {
          margin-bottom: 10px;
        }
      }
      .question {
        width: calc(100% - 10px);
        resize: vertical;
        margin: 10px 0;
        border: 1px solid #888;
        border-radius: 5px;
        padding: 5px;
        height: 20px;
        font-size: var(--normal-font-size);
      }
      .option:first-child .num {
        padding-top: 0;
      }
      .option {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-bottom: 10px;
        gap: 10px;
        .num {
          width: 100px;
          padding-top: 10px;
          text-align: center;
        }
        .img-input {
          width: 200px;
        }
        .text {
          width: 100%;
          textarea {
            padding: 5px;
            width: calc(100% - 10px);
            resize: vertical;
            min-height: 30px;
            border: 1px solid #888;
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
