<script setup>
const showExamResult = ref({
  id: 0,
  type: '',
  time: '',
  status: '',
  showScore: 0,
  score: 0,
  state: 0,
  stateDisplay: false,
});
</script>

<template>
  <div class="show-score">
    <div class="score">
      <p>您的分数是{{ showExamResult.showScore }}分</p>

      <div class="score-line">
        <div class="end"></div>
        <div :style="styleVariables" class="front"></div>
        <div v-if="showExamResult.state === 1 && showExamResult.display" class="pass"></div>
        <div v-if="showExamResult.state === 0 && showExamResult.display" class="no-pass"></div>
      </div>
      <div class="text">
        <p v-if="showExamResult.state === 0 && showExamResult.display">非常遗憾，您未通过测试</p>
        <div v-if="showExamResult.state === 1 && showExamResult.display">
          <p>
            恭喜您通过了测试！系统已自动将您添加至白名单。请下载 minecraft java edition 1.21 fabric 并安装 xaeroMap Mod
            后加入服务器
          </p>
          <ul class="server-url-list">
            <li>服务器地址列表</li>
            <li>xxx.yyy.zzz</li>
            <li>speed.yyy.zzz</li>
            <li>jiasu.yyy.zzz</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-score {
  width: 80%;
  .score {
    position: relative;
    top: -100px;
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
    .pass {
      width: 150px;
      height: 150px;
      background: url(../assets/images/vanilla_gui/accept.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      image-rendering: pixelated;
      position: absolute;
      right: 50px;
      bottom: -40px;
      animation: fadeIn 1s ease-in-out forwards;
    }
    .no-pass {
      width: 150px;
      height: 150px;
      background: url(../assets/images/vanilla_gui/reject.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      image-rendering: pixelated;
      position: absolute;
      right: 50px;
      bottom: -40px;
      animation: fadeIn 1s ease-in-out forwards;
    }
    .score-line {
      margin: 0 auto;
      border-radius: 5px;
      background-color: #000;
      width: 100%;
      height: 15px;
      position: relative;
      .end,
      .front {
        position: absolute;
        left: 0;
        top: 0px;
        width: 100%;
        height: 100%;
      }
      .end {
        background: url(../assets/images/vanilla_gui/experience_bar_background.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: center;
        image-rendering: pixelated;
      }
      .front {
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
      text-align: center;
      width: 60%;
      min-width: 450px;
      font-size: 25px;
      position: absolute;
      top: 100px;
      left: 50%;
      opacity: 0;
      transform: translate(-50%, 0);
      .server-url-list {
        padding: 10px;
        li {
          font-size: 25px;
          user-select: all;
        }
        li:first-child {
          font-size: 30px;
          user-select: none;
        }
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
