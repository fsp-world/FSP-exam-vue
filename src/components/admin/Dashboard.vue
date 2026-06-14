<script setup lang="ts">

</script>

<template>
  <div class="flex justify-center">
    <div class="w-full max-w-5xl">
      <!-- 顶部大卡片行 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div class="flex flex-col justify-center p-5 text-white rounded" style="background-color: var(--love-color); min-height: 200px;">
          <span class="text-2xl mb-2.5">已注册用户数：</span>
          <span class="text-8xl text-center">{{ 0 }}</span>
        </div>
        <div class="flex flex-col justify-center p-5 text-white rounded" style="background-color: var(--love-color); min-height: 200px;">
          <span class="text-2xl mb-2.5">玩家账户数：</span>
          <span class="text-8xl text-center">{{ 0 }}</span>
        </div>
      </div>

      <!-- 底部小卡片行 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        <div class="p-3 text-white rounded text-center" style="background-color: var(--love-color);">封禁数：0</div>
        <div class="p-3 text-white rounded text-center" style="background-color: var(--love-color);">未审核答卷：0</div>
        <div class="p-3 text-white rounded text-center" style="background-color: var(--love-color);">待通过担保：0</div>
        <div class="p-3 text-white rounded text-center" style="background-color: var(--love-color);">题目总数：0</div>
        <div class="p-3 text-white rounded text-center" style="background-color: var(--love-color);">试卷总数：0</div>
        <div class="p-3 text-white rounded text-center" style="background-color: var(--love-color);">我是占位</div>
      </div>
    </div>
  </div>
</template>
