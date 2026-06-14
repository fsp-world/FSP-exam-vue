<script setup lang="ts">
function randomInt() {
  return Math.floor(Math.random() * 21)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- 顶部大卡片行 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex items-center gap-5 p-6 rounded-xl shadow-sm bg-gradient-to-br from-blue-400 to-blue-500 text-white">
        <div class="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 shrink-0">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p class="text-sm font-medium text-blue-100">已注册用户数</p>
          <p class="text-4xl font-bold mt-1">{{ randomInt() }}</p>
        </div>
      </div>
      <div class="flex items-center gap-5 p-6 rounded-xl shadow-sm bg-gradient-to-br from-emerald-400 to-emerald-500 text-white">
        <div class="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 shrink-0">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <p class="text-sm font-medium text-emerald-100">玩家账户数</p>
          <p class="text-4xl font-bold mt-1">{{ randomInt() }}</p>
        </div>
      </div>
    </div>

    <!-- 底部小卡片行 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div class="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p class="text-2xl font-bold text-red-500">{{ randomInt() }}</p>
        <p class="text-sm text-gray-500 mt-1">封禁数</p>
      </div>
      <div class="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p class="text-2xl font-bold text-amber-500">{{ randomInt() }}</p>
        <p class="text-sm text-gray-500 mt-1">未审核答卷</p>
      </div>
      <div class="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p class="text-2xl font-bold text-blue-500">{{ randomInt() }}</p>
        <p class="text-sm text-gray-500 mt-1">待通过担保</p>
      </div>
      <div class="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p class="text-2xl font-bold text-purple-500">{{ randomInt() }}</p>
        <p class="text-sm text-gray-500 mt-1">题目总数</p>
      </div>
      <div class="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p class="text-2xl font-bold text-cyan-500">{{ randomInt() }}</p>
        <p class="text-sm text-gray-500 mt-1">试卷总数</p>
      </div>
      <div class="p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <p class="text-2xl font-bold text-gray-400">-</p>
        <p class="text-sm text-gray-500 mt-1">占位</p>
      </div>
    </div>
  </div>
</template>
