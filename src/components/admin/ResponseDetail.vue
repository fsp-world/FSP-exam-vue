<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="fixed inset-0 bg-black/50 flex justify-center items-start md:items-center z-50 pt-5 md:pt-0"
        @click.self="emit('update:visibility', false)">
        <div
          class="bg-white shadow-2xl w-full md:w-[70vw] max-h-[95vh] md:max-h-[90vh] flex flex-col mx-4 md:mx-0 relative">

          <!-- 关闭按钮 -->
          <ModalCloseButton @click="emit('update:visibility', false)" />

          <!-- 内容区 -->
          <div class="overflow-y-auto px-4 md:px-8 py-5 relative">

            <h1 class="text-2xl md:text-3xl font-bold mb-3">阅卷说明</h1>
            <ul class="list-disc pl-5 mb-6 space-y-1 text-sm md:text-base text-gray-600">
              <li>阅卷过程中请保持客观公正</li>
              <li>带有黑框的选项是用户选择的选项，带有绿色圆点的是正确选项</li>
              <li>客观题已自动批分（填空题如果自动批改有误请手动纠正），请为主观题批分，所有题目的得分都可以通过下拉框修改</li>
              <li>改完分数后在管理页面选择是否通过</li>
              <li>如果题目被逻辑删除，但用户已作答，显示</li>
              <li>如果题目被逻辑删除，并且用户未作答，则不显示</li>
            </ul>

            <h1 class="text-2xl md:text-3xl font-bold mb-4">答题卡 {{ archived ? '(已锁定)' : '' }}</h1>
            <div class="space-y-5">
              <div v-for="(question, questionIndex) in props.data.questions" :key="question.id"
                :id="'question' + (Number(questionIndex) + 1)">
                <QuestionCard :index="Number(questionIndex)" :mode="'review'"
                  v-model="props.data.questions[questionIndex]" :archived="archived" @scoreChange="handleScoreChange" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuestionCard, { type ScoreChangePayload } from '@/components/QuestionCard.vue';
import ModalCloseButton from '@/components/admin/ModalCloseButton.vue';
import { detailScore } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';
import type { AdminReviewSurvey } from '@/types/survey';



const props = defineProps<{
  data: AdminReviewSurvey;
  visibility: boolean;
}>();

const emit = defineEmits(['update:visibility']);

const archived = ref(props.data.isReviewed)

const handleScoreChange = (payload: ScoreChangePayload) => {
  detailScore({
    ...payload,
    responseId: props.data.id,
  })
    .then((res) => {
      openAlert(res.data.desc);
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

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
