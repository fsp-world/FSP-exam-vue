<script setup lang="ts">
import { usersInfo, sysInfo } from '@/apis/dashboard';
import { ref } from 'vue';

const userCount = ref(0);
const userWhiteListCount = ref(0);
const onlinePlayers = ref<{ playerName: string; playerUuid: string; currentServer: string }[]>([]);

const banWlCount = ref(0);
const banCount = ref(0);
const whitelistBlockCount = ref(0);
const responseNotReviewedCount = ref(0);
const guaranteeNotPassedCount = ref(0);
const questionCount = ref(0);
const surveyCount = ref(0);
const schematiCount = ref(0);

usersInfo().then((res) => {
  let data = res.data.data;
  userCount.value = data.user_count;
  userWhiteListCount.value = data.user_w_list_count;
  onlinePlayers.value = data.online_players ?? [];
});

sysInfo().then((res) => {
  let data = res.data.data;
  banWlCount.value = data.ban_wl_count;
  banCount.value = data.ban_count;
  whitelistBlockCount.value = data.whitelist_block_count;
  responseNotReviewedCount.value = data.response_not_reviewed_count;
  guaranteeNotPassedCount.value = data.guarantee_not_passed_count;
  questionCount.value = data.question_count;
  surveyCount.value = data.survey_count;
  schematiCount.value = data.schematic_count;
});
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <!-- 顶部大卡片行 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div
        class="flex items-center gap-5 rounded-xl bg-linear-to-br from-blue-400 to-blue-500 p-6 text-white shadow-sm"
      >
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
          <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-blue-100">已注册用户数</p>
          <p class="mt-1 text-4xl font-bold">{{ userCount }}</p>
        </div>
      </div>
      <div
        class="flex items-center gap-5 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-500 p-6 text-white shadow-sm"
      >
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20">
          <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-emerald-100">玩家白名单数量</p>
          <p class="mt-1 text-4xl font-bold">{{ userWhiteListCount }}</p>
        </div>
      </div>
    </div>

    <!-- 中部小卡片行 -->
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-gray-400">{{ whitelistBlockCount }}</p>
        <p class="mt-1 text-sm text-gray-500">白名单拦截次数</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-red-500">{{ banCount }}</p>
        <p class="mt-1 text-sm text-gray-500">封禁数</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-gray-400">{{ banWlCount }}</p>
        <p class="mt-1 text-sm text-gray-500">白名单封禁数</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-amber-500">{{ responseNotReviewedCount }}</p>
        <p class="mt-1 text-sm text-gray-500">未审核答卷</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-blue-500">{{ guaranteeNotPassedCount }}</p>
        <p class="mt-1 text-sm text-gray-500">待通过担保</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-cyan-500">{{ surveyCount }}</p>
        <p class="mt-1 text-sm text-gray-500">试卷总数</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-purple-500">{{ questionCount }}</p>
        <p class="mt-1 text-sm text-gray-500">题目总数</p>
      </div>
      <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-2xl font-bold text-purple-500">{{ schematiCount }}</p>
        <p class="mt-1 text-sm text-gray-500">投影总数</p>
      </div>
    </div>

    <!-- 在线玩家区域 -->
    <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <span class="relative flex h-3 w-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
        </span>
        <h3 class="text-base font-semibold text-gray-700">在线玩家</h3>
        <span class="ml-auto text-sm text-gray-400">{{ onlinePlayers.length }} 人在线</span>
      </div>
      <ul class="divide-y divide-gray-50">
        <li v-if="onlinePlayers.length === 0" class="px-6 py-8 text-center text-sm text-gray-400">暂无在线玩家</li>
        <li
          v-for="(p, index) in onlinePlayers"
          :key="p.playerName"
          class="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-gray-50/50"
        >
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            :class="[
              'bg-linear-to-br',
              index % 4 === 0
                ? 'from-cyan-400 to-blue-500'
                : index % 4 === 1
                  ? 'from-amber-400 to-orange-500'
                  : index % 4 === 2
                    ? 'from-purple-400 to-pink-500'
                    : 'from-emerald-400 to-teal-500',
            ]"
            :title="p.playerUuid"
          >
            {{ p.playerName.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-gray-700">{{ p.playerName }}</p>
            <p class="text-xs text-gray-400">{{ p.currentServer }}</p>
          </div>
          <div class="ml-auto flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span class="text-xs font-medium text-emerald-500">活跃</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
