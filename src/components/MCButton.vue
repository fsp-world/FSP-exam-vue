<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import img1 from '@/assets/images/rainbow_pixel_gui/button.png'
import img2 from '@/assets/images/rainbow_pixel_gui/button_highlighted.png'
import img3 from '@/assets/images/rainbow_pixel_gui/button_disabled.png'

// 根据不同的length，会使用canvas生成不同长度的按钮图片，避免使用CSS拉伸导致的模糊问题

type Length = 'short' | 'medium' | 'long'
type ButtonType = 'normal' | 'delete'
interface Props {
  disabled?: boolean
  disabledStyle?: boolean // 是否使用禁用状态的样式（即使按钮没有真正被禁用），用于在分段控制中表示未选中状态
  length?: Length
  buttonType?: ButtonType
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  disabledStyle: false,
  length: 'long',
  buttonType: 'normal'
})

async function generateButtonImages(length: Length) {
  // 加载三张原始图片
  const [normalImg, highlightedImg, disabledImg] = await Promise.all([
    loadImage(img1),
    loadImage(img2),
    loadImage(img3)
  ])

  // 根据长度类型确定目标尺寸
  const targetWidths = {
    short: 50,   // 裁掉150px，保留左右各25px -> 25+25=50px
    medium: 100, // 裁掉100px，保留左右各50px -> 50+50=100px
    long: 200    // 完整尺寸
  }

  const targetWidth = targetWidths[length]

  // 创建三个 Canvas 来处理不同的状态
  const normalCanvas = createCanvas(targetWidth, 20)
  const highlightedCanvas = createCanvas(targetWidth, 20)
  const disabledCanvas = createCanvas(targetWidth, 20)

  // 处理 Normal 状态图片
  processImage(normalCanvas, normalImg, length)

  // 处理 Highlighted 状态图片
  processImage(highlightedCanvas, highlightedImg, length)

  // 处理 Disabled 状态图片
  processImage(disabledCanvas, disabledImg, length)

  // 返回三个数据 URL
  return {
    width: targetWidth,
    normal: normalCanvas.toDataURL(),
    highlighted: highlightedCanvas.toDataURL(),
    disabled: disabledCanvas.toDataURL()
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

function processImage(canvas: HTMLCanvasElement, img: HTMLImageElement, length: 'short' | 'medium' | 'long') {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (length === 'long') {
    // 完整绘制
    ctx.drawImage(img, 0, 0)
  } else {
    // 需要裁切合并
    const [leftStart, leftWidth, rightStart, rightWidth] = getCutParams(length)

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制左边部分
    ctx.drawImage(
      img,
      leftStart, 0, leftWidth, 20,  // 源：从图片的左边部分
      0, 0, leftWidth, 20          // 目标：画到画布的左边
    )

    // 绘制右边部分
    ctx.drawImage(
      img,
      rightStart, 0, rightWidth, 20,  // 源：从图片的右边部分
      leftWidth, 0, rightWidth, 20    // 目标：紧接在左边部分后面
    )
  }
}

function getCutParams(length: 'short' | 'medium' | 'long'): [number, number, number, number] {
  if (length === 'medium') {
    // 裁掉中间100px，保留左右各50px
    // 左边：0-50px，右边：150-200px
    return [0, 50, 150, 50]
  } else if (length === 'short') {
    // 裁掉中间150px，保留左右各25px
    // 左边：0-25px，右边：175-200px
    return [0, 25, 175, 25]
  }
  // long 情况不应该走到这里
  return [0, 100, 100, 100]
}


const buttonImages = ref({
  normal: '',
  highlighted: '',
  disabled: ''
})
const isHovered = ref(false)

onMounted(async () => {
  buttonImages.value = await generateButtonImages(props.length)
})

// 计算当前状态下应该使用的背景图像
const currentBackgroundImage = computed(() => {
  if (props.disabled) {
    return buttonImages.value.disabled
  } else if (isHovered.value) {
    return buttonImages.value.highlighted
  } else if (props.disabledStyle) {
    return buttonImages.value.disabled
  } else {
    return buttonImages.value.normal
  }
})

const buttonStyle = computed(() => {
  const image = currentBackgroundImage.value
  return image ? { backgroundImage: `url("${image}")` } : {}
})

const buttonClassList = computed(() => ({
  'mc-button': true,
  'short-button-size': props.length === 'short',
  'medium-button-size': props.length === 'medium',
  'long-button-size': props.length === 'long',
  'mc-button--delete': props.buttonType === 'delete',
}))

</script>

<template>
  <button :disabled="disabled" type="button" :class="buttonClassList" :style="buttonStyle"
    @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <slot></slot>
  </button>
</template>

<style scoped>
.short-button-size {
  width: 100px;
  height: var(--button-height);
  font-size: var(--button-font-size-medium);
}

.medium-button-size {
  width: 200px;
  height: var(--button-height);
  font-size: var(--button-font-size-medium);
}

.long-button-size {
  width: 400px;
  height: var(--button-height);
  font-size: var(--button-font-size-medium);
}

.mc-button {
  display: block;
  --button-height: 40px;
  user-select: none;
  font-family: 'mc-font';
  color: #fff;
  border-radius: 5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  image-rendering: pixelated;
  position: relative;
  padding: 0 10px;
}

.mc-button--delete {
  color: #ef4444;
}

.mc-button a {
  color: inherit;
}

.mc-button a:active {
  color: inherit;
}

.mc-button a:target {
  color: inherit;
}
</style>
