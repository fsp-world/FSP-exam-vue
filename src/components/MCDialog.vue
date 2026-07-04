<script setup lang="ts">
// 这个组件的功能：
// 提供类似原生 Dialog 标签的功能
// 自动聚焦（按 Tab 不会切到外面）
// 点击半透明背景关闭模态框 (已移除，可能触发BUG）

// 示例调用：
// <MCDialog v-model:isModalVisible="showModal">
//  <MCButton @click="showModal = false">返回</MCButton>
// </MCDialog>
// showModal 是一个 ref 变量

import { onMounted, onUnmounted, watch, nextTick, computed, useTemplateRef } from 'vue'

interface Props {
  isModalVisible: boolean
  style?: 'book' | 'card'
  resizeX?: number
  resizeY?: number
}

interface Emits {
  (e: 'update:isModalVisible', value: boolean): void
}

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<Props>(), {
  isModalVisible: false,
  style: 'book',
  resizeX: 1,
  resizeY: 1,
})

const emit = defineEmits<Emits>()

const modalRef = useTemplateRef('modalRef')

const closeModel = () => {
  emit('update:isModalVisible', false)
}

const focusableElementsText = 'input, textarea, select, button'

const handleKeyDown = (e: KeyboardEvent) => {
  // 如果模态框没显示，或者按下的不是 Tab 键，则不处理
  if (!props.isModalVisible || e.key !== 'Tab') return

  // 获取模态框内的所有可聚焦元素
  if (modalRef.value) {
    const focusableElements = modalRef.value.querySelectorAll(focusableElementsText)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // 正向 Tab：如果焦点在最后一个元素，阻止默认行为并跳回第一个
    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
    // 反向 Shift + Tab：如果焦点在第一个元素，阻止默认行为并跳回最后一个
    else if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
  }
}

watch(() => props.isModalVisible, (newVal) => {
  if (newVal) {
    // 必须使用 nextTick，确保 DOM 已经渲染出来（v-show 或 v-if 生效）
    nextTick(() => {
      if (modalRef.value) {
        // 获取第一个可聚焦元素
        const focusableElements = modalRef.value.querySelectorAll(focusableElementsText)
        const firstElement = focusableElements[0] as HTMLElement

        // 如果找到了，就主动聚焦它
        if (firstElement) {

          firstElement.focus()
        } else {
          // 兜底方案：如果里面没有任何可交互元素，就把焦点给模态框容器本身
          // 注意：容器需要加 tabindex="-1" 才能被程序化聚焦
          modalRef.value.focus()
        }
      }
    })
  }
})

const modalClassList = computed(() => ({
  'normal': true,
  'card': props.style === 'card',
  'book': props.style === 'book',
}))

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})



</script>
<template>
  <Teleport to="body">
    <div class="bg" v-if="isModalVisible">
      <div v-bind="$attrs" ref="modalRef" tabindex="-1" :class="modalClassList"
        :style="{ '--ratioX': resizeX, '--ratioY': resizeY }">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
a:visited {
  color: inherit;
}

.bg {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.normal {
  position: relative;
  --ratioX: 1;
  --ratioY: 1;
}

.card {
  /* 图片原始尺寸：248 * 166 */
  --k: 3;
  --wid: calc(248px * var(--k) * var(--ratioX));
  --hei: calc(166px * var(--k) * var(--ratioY));

  width: 90%;
  max-width: var(--wid);
  min-height: var(--hei);

  background-image: url('@/assets/images/vanilla_gui/demo_background.png');
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  padding: 30px;
  overflow-x: auto;
}

.book {
  /* 图片原始尺寸：148 * 182 */
  --k: 3;
  --wid: calc(148px * var(--k) * var(--ratioX));
  --hei: calc(182px * var(--k) * var(--ratioY));

  max-width: var(--wid);
  min-height: var(--hei);
  max-height: 100vh;


  /* 核心作用是改变元素宽高的计算方式，让你设置的 width 和 height 直接等于元素的最终视觉大小 */
  box-sizing: border-box;

  font-size: var(--text-font-size-large);

  background-image: url(/src/assets/images/vanilla_gui/book.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  image-rendering: pixelated;
  background-position: center;

  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.6));
}
</style>
