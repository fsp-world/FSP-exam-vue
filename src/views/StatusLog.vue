<script setup lang="ts">
import { ref, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import request from '@/utils/requers';
import { dateFormatHHmm } from '@/utils/date';

use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  DataZoomComponent,
]);

// 日期范围（初始为空，不传参则后端返回当天数据）
const startTime = ref('');
const endTime = ref('');
const autoExpanded = ref(false);

const now = new Date();
const getLocalISO = (d: Date) => {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

// 数据状态
const total = ref(0);
const loading = ref(false);
const errorMsg = ref('');

// ISO 参数转换
const toISOParam = (local: string) => {
  const d = new Date(local);
  return d.toISOString();
};

// 图表配置
const option = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const p = Array.isArray(params) ? params[0] : params;
      return `${p.axisValue}<br/>${p.marker} 在线：${p.value} 人`;
    },
  },
  toolbox: {
    show: true,
    right: 0,
    feature: {
      saveAsImage: { show: true, title: '保存图片' },
    },
  },
  grid: { left: 50, right: 30, top: 10, bottom: 70 },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: { rotate: 0 },
  },
  yAxis: {
    type: 'value',
    name: '在线人数',
    minInterval: 1,
    axisLabel: {
      formatter: (value: number) => (Number.isInteger(value) ? value.toString() : ''),
    },
  },
  series: [
    {
      name: '在线',
      data: [],
      type: 'line',
      smooth: true,
      showSymbol: false,
    },
  ],
  dataZoom: [
    { type: 'inside', start: 0, end: 100, minSpan: 5 },
    { type: 'slider', start: 0, end: 100, minSpan: 5, height: 24 },
  ],
});

// 请求数据
const fetchData = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    const params: Record<string, string> = {};
    if (startTime.value) params.start_time = toISOParam(startTime.value);
    if (endTime.value) params.end_time = toISOParam(endTime.value);

    const res = await request.get('/statuslog/log', { params });
    if (res.data.code === 0) {
      const d = res.data.data;
      const dates: string[] = d.date ?? [];
      const counts: number[] = d.count ?? [];

      // 首次进入（未传时间参数）且数据不足 50 条，自动扩展范围
      if (!autoExpanded.value && !startTime.value && dates.length < 50) {
        autoExpanded.value = true;
        startTime.value = getLocalISO(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
        endTime.value = getLocalISO(now);
        loading.value = false;
        fetchData();
        return;
      }

      total.value = d.total ?? 0;
      // 使用 dateUtils 格式化时间标签
      const formattedDates = dates.map((date: string) => dateFormatHHmm(date));
      option.value = {
        ...option.value,
        xAxis: { ...option.value.xAxis, data: formattedDates },
        series: [{ ...(option.value as any).series?.[0], data: counts }],
      } as EChartsOption;
    } else {
      errorMsg.value = res.data.desc ?? '请求失败';
    }
  } catch (e: any) {
    errorMsg.value = e?.message ?? '网络错误';
  } finally {
    loading.value = false;
  }
};

// 快捷时间范围
const setQuickRange = (hours: number) => {
  autoExpanded.value = true;
  const end = new Date();
  const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
  startTime.value = getLocalISO(start);
  endTime.value = getLocalISO(end);
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- 头部 -->
      <div class="mb-6">
        <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
          <router-link to="/" class="hover:text-[#5268bc] transition-colors">首页</router-link>
          <span>/</span>
          <span class="text-gray-700">在线统计</span>
        </nav>
        <h1 class="text-2xl font-bold text-gray-800">在线人数统计</h1>
        <p class="text-sm text-gray-500 mt-1">实时监控服务器在线人数变化趋势</p>
      </div>

      <!-- 筛选栏 -->
      <div class="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div class="flex flex-wrap items-end gap-4">
          <!-- 开始时间 -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">开始时间（选填）</label>
            <input v-model="startTime" type="datetime-local" placeholder="默认当天"
              class="h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-sm" />
          </div>

          <!-- 结束时间 -->
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">结束时间（选填）</label>
            <input v-model="endTime" type="datetime-local" placeholder="默认当天"
              class="h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-sm" />
          </div>

          <!-- 查询按钮 -->
          <button
            class="h-10 px-6 bg-[#5268bc] text-white rounded hover:bg-[#4255a0] transition-colors text-sm font-medium disabled:opacity-50"
            :disabled="loading" @click="autoExpanded = true; fetchData()">
            {{ loading ? '查询中...' : '查询' }}
          </button>

          <!-- 快捷范围 -->
          <div class="flex gap-2">
            <button v-for="r in [
              { label: '最近1小时', h: 1 },
              { label: '最近6小时', h: 6 },
              { label: '最近24小时', h: 24 },
              { label: '最近7天', h: 24 * 7 },
            ]" :key="r.h" class="h-10 px-3 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              @click="setQuickRange(r.h)">{{ r.label }}</button>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="bg-white rounded-lg shadow-sm p-5">
        <!-- 加载/错误状态 -->
        <div v-if="loading" class="flex items-center justify-center h-80 text-gray-400">
          加载中...
        </div>
        <div v-else-if="errorMsg" class="flex items-center justify-center h-80 text-red-500">
          {{ errorMsg }}
        </div>

        <!-- 图表 -->
        <template v-else>
          <div class="flex items-center justify-between mb-3">
            <div class="text-sm text-gray-500">
              统计区间内数据条数：<span class="text-[#5268bc] font-bold text-lg">{{ total }}</span>
            </div>
          </div>
          <div v-if="total === 0 && errorMsg === ''" class="flex items-center justify-center h-80 text-gray-400">
            暂无数据，请选择时间范围后点击查询
          </div>
          <v-chart v-else class="w-full" style="height: 360px" :option="option" autoresize />
        </template>
      </div>
    </div>
  </div>
</template>
