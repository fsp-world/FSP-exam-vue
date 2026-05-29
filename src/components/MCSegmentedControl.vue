<script setup lang="ts">
// 该组件会提供一排按钮，只能同时有一个按钮被选中，类似于select标签的功能
// 组件支持两种方式设置默认选中项：
// 通过 v-model 传入初始值
// 在数据中设置 default: true 来指定默认按钮
// 如果两者同时存在，v-model 优先级更高。

import { onMounted, ref, watch } from 'vue'
import MCButton from './MCButton.vue';

interface ButtonData {
  label: string
  data: any
  default?: boolean
}

interface Props {
  buttonLength?: 'short' | 'medium' | 'long'
  data: ButtonData[]
  modelValue?: any  // 支持 v-model
}

interface Emits {
  (e: 'update:modelValue', value: any): void  // v-model 更新事件
  (e: 'change', value: any): void  // 选择改变事件
}

const props = withDefaults(defineProps<Props>(), {
  buttonLength: 'short',
  modelValue: undefined
})

const emit = defineEmits<Emits>()

// 当前选中的按钮索引
const selectedIndex = ref<number>(-1)


// 根据 modelValue 初始化选中的索引
onMounted(() => {
  initializeSelection()
})

// 监听 data 变化，重新初始化选择
watch(() => props.data, () => {
  // 如果当前没有选中项，尝试根据 default 属性或 modelValue 初始化
  if (selectedIndex.value === -1) {
    initializeSelection()
  }
}, { deep: true })

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined) {
    const index = props.data.findIndex(item => item.data === newVal)
    if (index !== -1 && selectedIndex.value !== index) {
      selectedIndex.value = index
    }
  }
})

// 初始化选择逻辑
const initializeSelection = () => {
  // 优先使用 props.modelValue
  if (props.modelValue !== undefined) {
    const index = props.data.findIndex(item => item.data === props.modelValue)
    if (index !== -1) {
      selectedIndex.value = index
      return
    }
  }

  // 如果 modelValue 没有匹配，查找具有 default 属性的按钮
  if (selectedIndex.value === -1) {
    const defaultIndex = props.data.findIndex(item => item.default === true)
    if (defaultIndex !== -1) {
      selectedIndex.value = defaultIndex
      // 同时更新 modelValue
      emit('update:modelValue', props.data[defaultIndex].data)
      emit('change', props.data[defaultIndex].data)
    }
  }
}

// 处理按钮点击事件
const handleButtonClick = (index: number) => {
  if (selectedIndex.value !== index) {
    selectedIndex.value = index
    const selectedValue = props.data[index].data
    emit('update:modelValue', selectedValue)  // 更新 v-model
    emit('change', selectedValue)  // 触发 change 事件
  }
}

// 计算每个按钮的 disabledStyle 状态
const getButtonDisabledStyle = (index: number) => {
  return selectedIndex.value !== index
}
</script>

<template>
  <div>
    <MCButton :length="props.buttonLength" :disabledStyle="getButtonDisabledStyle(index)"
      v-for="(button, index) in props.data" :key="index" @click="handleButtonClick(index)">
      {{ button.label }}
    </MCButton>
  </div>
</template>

<style scoped></style>
