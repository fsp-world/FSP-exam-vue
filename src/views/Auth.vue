<script setup>
// import { useRoute } from "vue-router";
import { RouterView } from 'vue-router';
import { RouterLink } from 'vue-router';

// const route = useRoute();
</script>

<template>
  <div class="login-container">
    <!-- <div class="tabs"> -->
    <!--   <span :class="{ active: route.name === 'Login' }"> -->
    <!--     <RouterLink to="/auth/login">登录</RouterLink> -->
    <!--   </span> -->
    <!--   <span :class="{ active: route.name === 'Register' }"> -->
    <!--     <RouterLink to="/auth/register">注册</RouterLink> -->
    <!--   </span> -->
    <!-- </div> -->
    <RouterView class="form" />
    <!-- <Transition name="fade" mode="out-in"></Transition> -->
    <RouterLink to="/" class="back">返回主页</RouterLink>
  </div>
</template>

<style scoped>
a:visited {
  color: inherit;
}

.login-container {
  --wid: 400px;
  width: var(--wid);
  height: calc(var(--wid) * 1.22);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 8% auto 0;
  padding: 3px 50px;
  /* border: 1px solid #ccc; */
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

/* .tabs { */
/*   display: flex; */
/*   justify-content: center; */
/*   align-items: center; */
/*   width: 400px; */
/*   height: 60px; */
/*   position: absolute; */
/*   top: 0px; */
/*   left: -1px; */
/*   transform: translate(0, -100%); */
/*   z-index: 2; */
/*   background: white; */
/* } */
/**/
/* .tabs span { */
/*   background: rgb(240, 240, 240); */
/*   cursor: pointer; */
/*   color: #333; */
/*   font-size: 20px; */
/*   width: 50%; */
/*   line-height: 60px; */
/*   text-align: center; */
/*   border: 1px solid transparent; */
/*   border-bottom: 1px solid #ccc; */
/*   border-radius: 4px 4px 0 0; */
/* } */
/**/
/* .tabs span.active { */
/*   background: white; */
/*   border: 1px solid #ccc; */
/*   border-bottom: 1px solid white; */
/* } */

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
