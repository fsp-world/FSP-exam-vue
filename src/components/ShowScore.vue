<script setup lang="ts">
import { toRef, computed, ref } from 'vue';
import MCButton from './MCButton.vue';
import MCRouterLink from '@/components/MCRouterLink.vue';

const props = defineProps(['flag', 'data']);
const emit = defineEmits(['update:flag']);

const examInfo = toRef(props, 'data');
const showData = ref({
  show_score: 0,
  display_text: false,
});
const showScorePercent = (examInfo.value.get_score / examInfo.value.full_score) * 100;
const styleVariables = computed(() => ({
  '--show-score-percent': `${100 - showScorePercent}%`,
}));

const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
  const startTime = performance.now();
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = start + (end - start) * progress;
    callback(Math.round(value));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
    if (showData.value.show_score === examInfo.value.get_score) {
      showData.value.display_text = true;
    }
  };

  requestAnimationFrame(animate);
};

animateValue(0, examInfo.value.get_score, 2000, (value: number) => {
  showData.value.show_score = value;
});
</script>

<template>
  <div class="show-score">
    <div class="score">
      <p>您的分数为 {{ showData.show_score }}/{{ examInfo.full_score }} 分</p>
      <div class="score-line">
        <div class="score-line-end"></div>
        <div :style="styleVariables" class="score-line-front"></div>
        <div v-if="examInfo.state === 1 && showData.display_text" class="pass"></div>
        <div v-if="examInfo.state === 2 && showData.display_text" class="no-pass"></div>
      </div>
      <div class="text">
        <div v-if="examInfo.state === 1 && showData.display_text">
          <p class="title">恭喜您通过了测试！系统已自动将您添加至白名单</p>
          <p class="title">点击“游玩指南”获取游玩方式</p>
          <p class="title">您也可以稍后在个人中心找到这个按钮</p>
          <MCRouterLink class="button" to="https://www.fsp.ink/docs/join/"> 游玩指南 </MCRouterLink>
        </div>
        <div v-if="examInfo.state === 2 && showData.display_text">
          <p class="title">非常遗憾，您未通过测试</p>
        </div>

        <MCButton class="button" @click="emit('update:flag', false)"> 考试列表 </MCButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-score {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  .score {
    margin: 0 auto;
    margin-top: 200px;
    width: 90%;
    max-width: 1000px;
    position: relative;
    .button {
      width: 100%;
      max-width: 800px;
      height: 80px;
      font-size: 30px;
      margin: 0 auto;
      margin-top: 30px;
    }

    > p {
      text-align: center;
      font-size: 40px;
      color: yellow;
      text-shadow:
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000,
        0 0 3px #000000;
      position: relative;
      bottom: 10px;
      z-index: 2;
    }
    --icon-size: 150px;
    .pass,
    .no-pass {
      width: var(--icon-size);
      height: var(--icon-size);
      image-rendering: pixelated;
      position: absolute;
      right: 50px;
      bottom: -40px;
      animation: fadeIn 1s ease-in-out forwards;
    }
    .pass {
      background: url(../assets/images/vanilla_gui/accept.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
    }
    .no-pass {
      background: url(../assets/images/vanilla_gui/reject.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
    }
    .score-line {
      margin: 0 auto;
      border-radius: 5px;
      background-color: #000;
      width: 100%;
      height: 15px;
      position: relative;
      .score-line-front,
      .score-line-end {
        position: absolute;
        left: 0;
        top: 0px;
        width: 100%;
        height: 100%;
      }
      .score-line-end {
        background: url(../assets/images/vanilla_gui/experience_bar_background.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        image-rendering: pixelated;
      }
      .score-line-front {
        background: url(../assets/images/vanilla_gui/experience_bar_progress.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        image-rendering: pixelated;
        clip-path: inset(0 100% 0 0);
        animation: reveal 2s ease-in-out forwards;
      }
    }
    .text {
      animation: fadeIn 1s ease-in-out forwards;
      animation-delay: 2.5s;
      width: 90%;
      font-size: 25px;
      position: absolute;
      top: 100px;
      left: 50%;
      opacity: 0;
      transform: translate(-50%, 0);
      .title {
        text-align: center;
      }
      .info {
        margin: 0 auto;
        max-width: 800px;
      }
      .list-title {
        text-align: left;
        margin-top: 50px;
      }
      ul,
      ol {
        margin: 0;
        padding-top: 20px;
        padding-left: 40px;
        li {
          display: list-item;
        }
      }
      ol li {
        list-style-type: decimal;
      }
      ul li {
        list-style-type: disc;
      }
    }
  }
}

@media (max-width: 800px) or (max-height: 1100px) {
  .show-score {
    .score {
      --icon-size: 100px;
      margin-top: 30px;
      > p {
        font-size: 32px;
      }
      .pass,
      .no-pass {
        right: 10px;
      }
      .text {
        width: 100%;
        font-size: 22px;
        .info {
          height: 230px;
          overflow-y: auto;
          .list-title {
            margin-top: 10px;
          }
        }
      }
      .button {
        font-size: 20px;
        height: 50px;
        width: 60%;
        margin-top: 10px;
      }
    }
  }
}
@keyframes reveal {
  from {
    clip-path: inset(0 100% 0 0);
    /* 从左侧开始裁切，背景图片完全隐藏 */
  }

  to {
    clip-path: inset(0 var(--show-score-percent) 0 0);
    /* 完全显示背景图片 */
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
