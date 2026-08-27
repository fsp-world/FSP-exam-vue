<script setup lang="ts">
import { ref, watch } from 'vue';
import { addSurveyAPI, modSurveyMetaData } from '@/apis/admin';
import AdminButton from './AdminButton.vue';
import { openAlert } from '@/utils/TsAlert';
import type { NewSurvey } from '@/types/survey';

interface Props {
  sid?: number;
  mode: 'add' | 'set';
  initialName?: string;
  initialDescription?: string;
}

const props = withDefaults(defineProps<Props>(), { mode: 'add' });
const emit = defineEmits(['onEdit']);
const toggleForm = defineModel();

const formData = ref<NewSurvey>({
  id: props.mode === 'set' ? props.sid : 0,
  name: '',
  description: '',
});

const cancel = () => {
  toggleForm.value = false;
};

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

watch(
  () => toggleForm.value,
  (opened) => {
    if (opened) {
      formData.value.name = props.initialName ?? '';
      formData.value.description = props.initialDescription ?? '';
    }
  }
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="toggleForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="cancel"
      >
        <div class="w-[400px] max-w-[95vw] rounded-xl bg-white p-6 shadow-2xl">
          <p class="mb-5 text-center text-xl font-bold select-none md:text-2xl">设置问卷信息</p>
          <input
            v-model="formData.name"
            required
            type="text"
            placeholder="问卷名称"
            class="mb-3 w-full rounded border border-gray-300 px-3 py-2 text-base outline-none focus:border-[#5268bc]"
          />
          <input
            v-model="formData.description"
            required
            type="text"
            placeholder="问卷描述"
            class="mb-5 w-full rounded border border-gray-300 px-3 py-2 text-base outline-none focus:border-[#5268bc]"
          />
          <div class="flex gap-3">
            <AdminButton size="small" @click="cancel">取消</AdminButton>
            <AdminButton size="small" variant="primary" @click="submitMetaData">提交</AdminButton>
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

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
