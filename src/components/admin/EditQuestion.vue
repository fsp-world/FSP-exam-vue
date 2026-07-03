<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import type { ModeType, AdminViewQuestion, EditQuestionData, NewOption, NewImage } from '@/types/survey';
import { QuestionType } from '@/types/survey';
import { compressionFile } from '@/utils/imageCompression';
import MCButton from '@/components/MCButton.vue';
import ModalCloseButton from '@/components/admin/ModalCloseButton.vue';
import { hasAtLeastOneCorrectOption } from '@/utils/survey';
import { openAlert } from '@/utils/TsAlert';

/** 本地类型：给选项和图片加上前端专用 key，不会发给后端 */
interface LocalOption extends NewOption {
  key: string
}

interface LocalImage extends NewImage {
  key: string
}

type LocalQuestionData = Omit<EditQuestionData, 'options' | 'images'> & {
  options: LocalOption[]
  images: LocalImage[]
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emit = defineEmits(['onEdit', 'close']);

interface Props {
  mode: ModeType
  order: number
  initialData?: AdminViewQuestion | null
}

const props = withDefaults(defineProps<Props>(), {
  initialData: null
})

const { mode, order, initialData } = props



const types = ref([
  { value: QuestionType.SingleChoice, name: '单选', optionTitle: '单选列表：', placeholder: '不要写例如 A.B.C.D. 这样的编号！' },
  { value: QuestionType.MultipleChoice, name: '多选', optionTitle: '多选列表：', placeholder: '不要写例如 A.B.C.D. 这样的编号！' },
  { value: QuestionType.FillInTheBlanks, name: '填空', optionTitle: '正确答案：', placeholder: '请在此输入正确答案，不要有多余符号' },
  { value: QuestionType.Subjective, name: '简答', optionTitle: '参考答案：', placeholder: '请在此输入参考答案' },
]);

const upload_button_text = computed(() => mode === 'edit' ? '更新题目' : '上传题目');
const selectedRadioKey = ref<string | null>(null);

const question = ref<LocalQuestionData>({
  id: 0,
  display_order: 0,
  title: '',
  type: QuestionType.SingleChoice,
  score: 5,
  options: [],
  images: [],
});

// 生成唯一 key，仅用于本页面内 v-for 的 :key 绑定
const generateUniqueKey = () => crypto.randomUUID();

const newOption = () => {
  question.value.options.push({ key: generateUniqueKey(), text: '', isCorrect: false });
};

const newImg = () => {
  question.value.images.push({ key: generateUniqueKey(), alt: '', data: '' });
};

const setOnlyOneOption = () => { question.value.options = []; newOption(); };

const deleteOptionByKey = (key: string) => {
  question.value.options = question.value.options.filter(item => item.key !== key);
};

const deleteImgByKey = (key: string) => {
  question.value.images = question.value.images.filter(item => item.key !== key);
};

const handleFileUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('请选择有效的图片文件'); return; }
  if (file.size > MAX_IMAGE_SIZE) { alert('图片大小不能超过5MB'); return; }
  if (question.value.images[index].data.trim()) { alert('已存在图片链接，忽略文件上传！'); return; }

  compressionFile(file, 'image/jpeg', 0.5).then((compressedFile) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      question.value.images[index].data = e.target?.result as string;
    };
    reader.readAsDataURL(compressedFile);
  }).catch(() => alert('图片处理失败，请重试！'));
};

const onChange = (editOption: LocalOption) => {
  for (let option of question.value.options) option.isCorrect = false;
  editOption.isCorrect = true;
};

const isChoiceType = computed(() => question.value.type === QuestionType.SingleChoice || question.value.type === QuestionType.MultipleChoice);


const submit = () => {
  if (!question.value.title.trim()) {
    openAlert('请输入问题描述！');
    return;
  }

  // 选择题（单选/多选）必须至少有一个正确选项
  if (!hasAtLeastOneCorrectOption(question.value)) {
    openAlert('请至少勾选一个正确选项！');
    return;
  }

  // 提交时剥离 key，避免无关字段传给后端
  const data: EditQuestionData = {
    ...question.value,
    options: question.value.options.map(({ key, ...rest }) => rest),
    images: question.value.images.map(({ key, ...rest }) => rest),
  }
  emit('onEdit', mode, data)
}

const init = () => {
  if (mode === 'add') {
    if (order !== 0) question.value.display_order = order;
    newOption();
  }
  if (mode === 'edit' && initialData) {
    // 给后端数据加上前端专用的 key，用于 v-for 的 :key 绑定
    const addKey = (oldList: any) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      for (let item of newList) item.key = generateUniqueKey();
      return newList;
    };
    question.value = {
      display_order: initialData.display_order,
      id: initialData.id,
      title: initialData.title,
      type: initialData.type,
      score: initialData.score,
      options: addKey(initialData.options),
      images: addKey(initialData.images),
    };
    if (question.value.type === QuestionType.SingleChoice) {
      const correctItem = question.value.options.find(item => item.isCorrect);
      if (correctItem) selectedRadioKey.value = correctItem.key;
    }
  }
};

init();

watch(() => question.value.type, (newVal) => {
  if (newVal === QuestionType.FillInTheBlanks || newVal === QuestionType.Subjective) setOnlyOneOption();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2 md:p-0"
        @click.self="emit('close', 0)">
        <div
          class="bg-white rounded-xl shadow-2xl w-full md:w-[700px] max-h-[95vh] flex flex-col overflow-hidden relative">

          <!-- 关闭按钮 -->
          <ModalCloseButton @click="emit('close', 0)" />

          <!-- 内容区 -->
          <div class="overflow-y-auto px-4 md:px-6 py-4 md:py-6">

            <!-- 题目类型 & 分值 -->
            <div class="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
              <label class="text-sm md:text-lg font-medium">题目类型：</label>
              <select v-model="question.type"
                class="px-3 py-1.5 border border-gray-300 rounded bg-white outline-none text-sm md:text-base">
                <option v-for="i in types" :key="i.value" :value="i.value">{{ i.name }}</option>
              </select>
              <label class="text-sm md:text-lg font-medium ml-2">分值：</label>
              <select v-model="question.score"
                class="px-3 py-1.5 border border-gray-300 rounded bg-white outline-none text-sm md:text-base">
                <option v-for="i in 10" :key="i" :value="i">{{ i }}分</option>
              </select>
            </div>

            <!-- 问题描述 -->
            <div class="mb-4">
              <label class="block text-sm md:text-lg font-medium mb-1">问题描述：</label>
              <textarea v-model.trim="question.title" placeholder="请在此输入问题，不要输入题号和题目类型！"
                class="w-full px-3 py-2 border border-gray-300 rounded resize-y min-h-[60px] outline-none text-sm md:text-base" />
            </div>

            <!-- 图片列表 -->
            <details class="mb-4">
              <summary class="text-sm md:text-lg font-medium cursor-pointer mb-2">图片列表（可选）：</summary>
              <div class="space-y-2">
                <div class="hidden md:flex gap-2 text-sm text-gray-500 px-2">
                  <span class="w-16 text-center">编号</span><span class="flex-1">上传方式1</span><span
                    class="flex-1">上传方式2</span><span class="w-20"></span>
                </div>
                <div v-for="(item, index) in question.images" :key="item.key"
                  class="flex flex-col md:flex-row gap-2 items-start p-2 bg-gray-50 rounded">
                  <span class="text-sm font-medium w-16 text-center shrink-0">图{{ index + 1 }}</span>
                  <input type="file" accept="image/*"
                    class="text-xs md:text-sm file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-gray-200 file:text-sm file:hover:bg-gray-300"
                    @change="handleFileUpload($event, index)" />
                  <textarea v-model="item.data" placeholder="e.g. https://exam.fsp.ink/assets/images/23-1.png"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded resize-y min-h-[36px] outline-none text-xs md:text-sm w-full" />
                  <MCButton length="short" disabled-style @click="deleteImgByKey(item.key)">删除</MCButton>
                </div>
              </div>
              <MCButton length="short" @click="newImg">新建图片</MCButton>
            </details>

            <!-- 选项区域 -->
            <div class="mb-4">
              <p class="text-sm md:text-lg font-medium mb-2">{{ types[question.type - 1]?.optionTitle }}</p>

              <!-- 选择题表头 -->
              <div v-if="isChoiceType" class="hidden md:flex gap-2 text-sm text-gray-500 px-2 mb-1">
                <span class="w-20 text-center">编号</span><span class="flex-1">选项</span><span
                  class="w-24 text-center">正确选项</span><span class="w-20"></span>
              </div>

              <div class="space-y-2">
                <div v-for="(item, index) in question.options" :key="item.key"
                  class="flex flex-col md:flex-row gap-2 items-start p-2 bg-gray-50 rounded">
                  <span v-if="isChoiceType" class="text-sm font-medium w-20 text-center shrink-0 pt-1">选项{{ index + 1
                  }}</span>
                  <textarea v-model="item.text" :placeholder="types[question.type - 1]?.placeholder"
                    class="flex-1 px-2 py-1 border border-gray-300 rounded resize-y min-h-[36px] outline-none text-xs md:text-sm w-full" />
                  <div v-if="isChoiceType" class="flex items-center gap-2 shrink-0">
                    <input v-if="question.type === QuestionType.SingleChoice" type="radio" name="radio-correct"
                      :value="item.key" v-model="selectedRadioKey" class="w-5 h-5" @change="onChange(item)" />
                    <input v-if="question.type === QuestionType.MultipleChoice" type="checkbox" v-model="item.isCorrect"
                      class="w-5 h-5" />
                  </div>
                  <div
                    v-if="question.type === QuestionType.FillInTheBlanks || question.type === QuestionType.Subjective"
                    class="flex items-center shrink-0">
                    <input type="radio" :checked="item.isCorrect" disabled class="w-5 h-5" />
                  </div>
                  <MCButton v-if="isChoiceType" length="short" disabled-style @click="deleteOptionByKey(item.key)">删除
                  </MCButton>
                </div>
              </div>

              <MCButton v-if="isChoiceType" length="short" @click="newOption">新建选项</MCButton>
            </div>

            <!-- 提交按钮 -->
            <MCButton length="medium" @click="submit()">{{ upload_button_text }}</MCButton>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active>div,
.modal-fade-leave-active>div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from>div,
.modal-fade-leave-to>div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
