<script setup>
// import { useRoute } from "vue-router";
import { RouterView } from 'vue-router';
import { RouterLink } from 'vue-router';

// const route = useRoute();
</script>

<template>
  <div class="box">
    <div class="login-container">
      <RouterView class="form" />
      <RouterLink to="/" class="back">返回主页</RouterLink>
    </div>
  </div>
</template>

<style scoped>
a:visited {
  color: inherit;
}

.box {
  background-image: url(../assets/images/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  --wid: 400px;
  max-width: var(--wid);
  height: calc(var(--wid) * 1.22);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 10px;
  padding: 3px 50px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
  transition: height 0.3s ease-in-out;
  background-image: url(/src/assets/images/vanilla_gui/book.png);
  background-repeat: no-repeat;
  background-size: 100%;
  image-rendering: pixelated;
}

.back {
  text-align: center;
  padding-bottom: 30px;
}

/* Transition 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
