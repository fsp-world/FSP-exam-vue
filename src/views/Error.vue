<script setup lang="ts">
import { useRoute } from 'vue-router';
import StrippedBirchLogBackground from '@/components/background/StrippedBirchLogBackground.vue';

import MCRouterLink from '@/components/MCRouterLink.vue';
const route = useRoute();
</script>

<template>
  <StrippedBirchLogBackground>
    <div class="box">
      <div class="content">
        <div class="http-code">{{ route.query.code || '错误' }}</div>
        <p class="msg">{{ route.query.message }}</p>
        <MCRouterLink class="button" to="/">返回主页</MCRouterLink>
      </div>
    </div>
  </StrippedBirchLogBackground>
</template>

<style scoped>
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  width: 100%;

  .http-code {
    font-size: var(--title-font-size-large);
    text-align: center;
  }

  .msg {
    font-size: var(--text-font-size-large);
    text-align: center;
  }

  .button {
    margin: 50px auto;
    max-width: 95%;
  }

}
</style>
