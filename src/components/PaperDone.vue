<template>
  <div class="paper-done">
    <div class="box">
      <h1 class="title">提交成功</h1>
      <p class="text">
        您的客观题得分为: <span class="score">{{ props.score }}</span
        >分
      </p>
      <p class="text">主观题请等待人工审核</p>
      <MCRouterLink to="/space" class="confirm-btn">确认</MCRouterLink>
    </div>
  </div>
</template>

<script setup>
import confetti from 'canvas-confetti';
import { onMounted } from 'vue';
import MCRouterLink from './MCRouterLink.vue';

const props = defineProps({
  score: {
    type: Number,
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
    background-size: cover;
    width: 410px;
    height: 260px;
    border-radius: 8px;
    padding: 20px;
    .title {
      font-size: 40px;
      text-align: center;
    }
    .text {
      font-size: 26px;
      text-align: center;
      line-height: 1.5em;
    }
    .confirm-btn {
      font-size: 20px;
      width: 200px;
      height: 50px;
      margin: 20px auto;
    }
  }
}
</style>
