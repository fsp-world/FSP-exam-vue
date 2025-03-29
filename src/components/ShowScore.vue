<script setup>
import { ref, computed } from 'vue';
import MCButton from './MCButton.vue';

const props = defineProps(['flag', 'data']);
const emit = defineEmits(['update:flag']);

const showExamResult = ref({
  showScore: 0,
  score: props.data.score,
  state: props.data.isReviewed,
});

const styleVariables = computed(() => ({
  '--showScore': `${100 - showExamResult.value.score}%`,
}));

const animateValue = (start, end, duration, callback) => {
  showExamResult.value.showScore = 0;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = start + (end - start) * progress;
    callback(Math.round(value));

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
    if (showExamResult.value.showScore === showExamResult.value.score) {
      showExamResult.value.display = true;
    }
  };

  requestAnimationFrame(animate);
};

animateValue(0, showExamResult.value.score, 2000, (value) => {
  showExamResult.value.showScore = value;
});
</script>

<template>
  <div class="show-score">
    <div class="score">
      <p>您的分数为{{ showExamResult.showScore }}分</p>
      <div class="score-line">
        <div class="score-line-end"></div>
        <div :style="styleVariables" class="score-line-front"></div>
        <div v-if="showExamResult.state === 1 && showExamResult.display" class="pass"></div>
        <div v-if="showExamResult.state === 2 && showExamResult.display" class="no-pass"></div>
      </div>
      <div class="text">
        <div v-if="showExamResult.state === 1 && showExamResult.display">
          <p class="title">恭喜您通过了测试！系统已自动将您添加至白名单</p>
          <div class="info y-scroll">
            <p class="list-title">如何进入服务器：</p>
            <ol>
              <li>建议使用 HMCL 或者 PCL2 启动器</li>
              <li>下载 MinecraftJavaEdition 1.21 Fabric</li>
              <li>下载并安装 Xaeros_Minimap 和 XaerosWorldMap</li>
              <li>启动游戏，在多人游戏中点击“添加服务器”，在服务器地址栏粘贴提供的服务器地址</li>
            </ol>
            <p class="list-title">你可能需要的信息：</p>
            <ul>
              <li>存档种子：-8593431037239816247</li>
              <li>官网：https://www.fsp.ink</li>
              <li>服务器地址列表：mc.fsp.ink 或 www.fsp.ink</li>
            </ul>
          </div>
        </div>
        <p class="title" v-if="showExamResult.state === 2 && showExamResult.display">非常遗憾，您未通过测试</p>
        <MCButton class="button" @click="emit('update:flag', false)">返回考试列表</MCButton>
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
    clip-path: inset(0 var(--showScore) 0 0);
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
