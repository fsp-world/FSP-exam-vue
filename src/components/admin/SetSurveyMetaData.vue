<script setup lang="ts">
import { ref, watch } from 'vue';
import { addSurveyAPI, modSurveyMetaData } from '@/apis/admin';
import MCButton from '@/components/MCButton.vue';
import { openAlert } from '@/utils/TsAlert';
import type { NewSurvey } from '@/types/survey';

interface Props {
  sid?: number;
  mode: 'add' | 'set';
}

const props = withDefaults(defineProps<Props>(), { mode: 'add' });
const emit = defineEmits(['onEdit']);
const toggleForm = defineModel();

const formData = ref<NewSurvey>({
  id: props.mode === 'set' ? props.sid : 0,
  name: '',
  description: '',
});

const cancel = () => { toggleForm.value = false; };

const handleResponse = (res: any) => {
  if (res.data.code === 0) {
    toggleForm.value = !toggleForm.value;
    openAlert(res.data.desc);
    emit('onEdit');
  } else {
    openAlert(res.data.desc);
  }
};

const submitMetaData = () => {
  if (formData.value.id) {
    modSurveyMetaData(formData.value).then(handleResponse);
  } else {
    addSurveyAPI(formData.value).then(handleResponse);
  }
};

watch(() => toggleForm.value, () => {
  formData.value.name = '';
  formData.value.description = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="toggleForm" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        @click.self="cancel">
        <div class="bg-white rounded-xl shadow-2xl p-6 w-[400px] max-w-[95vw]">
          <p class="text-center text-xl md:text-2xl font-bold mb-5 select-none">设置问卷信息</p>
          <input v-model="formData.name" required type="text" placeholder="问卷名称"
            class="w-full px-3 py-2 mb-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-base" />
          <input v-model="formData.description" required type="text" placeholder="问卷描述"
            class="w-full px-3 py-2 mb-5 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-base" />
          <div class="flex gap-3">
            <MCButton length="short" disabled-style @click="cancel">取消</MCButton>
            <MCButton length="short" @click="submitMetaData">提交</MCButton>
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
