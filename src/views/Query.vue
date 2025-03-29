<script setup>
import MCRouterLink from '@/components/MCRouterLink.vue';
</script>

<template>
  <div class="view-result">
    <div class="translucent-bg"></div>
    <div class="translucent-content">
      <div class="title">
        <p>查询结果</p>
      </div>
      <div class="main">
        <router-view />
      </div>
      <div class="end">
        <MCRouterLink to="/space" class="button">返回</MCRouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  display: block;
}
</style>
