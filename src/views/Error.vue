<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <h1>错误页面</h1>
  <p>{{ route.query.message }}</p>
  <p><RouterLink to="/">返回主页</RouterLink></p>
</template>

<style scoped>
h1,
p {
  text-align: center;
}
p {
  margin: 10px 0;
}
</style>
