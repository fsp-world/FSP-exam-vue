<template>
  <div class="paper-done">
    <div class="box">
      <p>提交成功！</p>
      <p>您的选择题得分为: <span class="score">{{ props.score }}</span>!</p>
      <p>主观题请等待审核！</p>
      <p>
        <MCRouterLink to="/space" class="confirm-btn">确认</MCRouterLink>
      </p>
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
    text-align: center;
    font-size: 26px;
    background-color: #eeeeee;
    border-radius: 20px;
    padding: 40px;
    p {
      margin-bottom: 15px;
    }
    .score {
      font-size: 36px;
      font-weight: 600;
    }
    .confirm-btn {
      width: 200px;
      height: 50px;
      font-size: inherit;
      display: inline-block;
    }
  }
}
</style>

