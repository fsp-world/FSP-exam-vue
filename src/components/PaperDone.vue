<script setup lang="ts">
import confetti from 'canvas-confetti';
import { onMounted } from 'vue';
import MCRouterLink from './MCRouterLink.vue';

const props = defineProps({
  score: {
    type: Number,
    required: true,
  },
});

const pong = () => {
  var end = Date.now() + 15 * 1000;

  // go Buckeyes!
  var colors = ['#bb0000', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

onMounted(() => {
  if (props.score >= 80) {
    pong();
  }
});
</script>
<template>
  <div class="paper-done">
    <div class="box">
      <h1 class="title">提交成功</h1>
      <p class="text">
        您的客观题得分为: <span class="score">{{ props.score }}</span>分
      </p>
      <p class="text">主观题请等待人工审核</p>
      <p class="text">结果请在个人中心查看</p>
      <MCRouterLink :length="'medium'" to="/space" class="confirm-btn">确认</MCRouterLink>
    </div>
  </div>
</template>
<style scoped>
.paper-done {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #d4d2d29e;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  .box {
    background-color: #eeeeee;
    background-image: url(/src/assets/images/vanilla_gui/demo_background.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    max-width: 410px;
    height: 280px;
    border-radius: 8px;
    padding: 20px;

    .title {
      font-size: var(--title-font-size-large);
      text-align: center;
      margin: 10px 0;
    }

    .text {
      font-size: var(--text-font-size-large);
      text-align: center;
      line-height: 1.5em;
      width: 305px;
      margin: 0 auto;
    }

    .confirm-btn {
      font-size: var(--button-font-size-medium);
      width: 200px;
      margin: 10px auto;
      display: block;
    }
  }
}
</style>
