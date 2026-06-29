<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
import StrippedBirchLogBackground from '@/components/background/StrippedBirchLogBackground.vue';
import MCButton from '@/components/MCButton.vue';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import request from '@/utils/requers';
import { dateFormatDDHHmm } from '@/utils/date';

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

// 开服日期（最小值限制，首次 fetch 时从后端获取）
const serverLaunchDate = ref('');

// 给 datetime-local input 用的最小值（格式：YYYY-MM-DDTHH:MM）
const minDatetime = computed(() => serverLaunchDate.value ? `${serverLaunchDate.value}T00:00` : '');

// 结束日期最大值（当天）
const maxDatetime = computed(() => getLocalISO(new Date()));

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
      // 从响应中获取开服日期，没拿到则默认一年前
      if (d.serverLaunchDate) {
        serverLaunchDate.value = d.serverLaunchDate;
      } else if (!serverLaunchDate.value) {
        const fallback = new Date();
        fallback.setFullYear(fallback.getFullYear() - 1);
        serverLaunchDate.value = fallback.toISOString().slice(0, 10);
      }
      // 使用 dateUtils 格式化时间标签
      const formattedDates = dates.map((date: string) => dateFormatDDHHmm(date));
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
  <StrippedBirchLogBackground>
    <div class="main">
      <nav class="nav">
        <div class="title">在线统计</div>
        <MCRouterLink :length="'short'" to="/" class="back">
          返回
        </MCRouterLink>
      </nav>
      <div class="content">
        <!-- 筛选栏 -->
        <div class="bg-white/50 rounded-lg shadow-sm p-5 mb-6">
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-500">开始时间</label>
              <input v-model="startTime" type="datetime-local" placeholder="默认当天" :min="minDatetime" :max="maxDatetime"
                class="h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-sm" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm text-gray-500">结束时间</label>
              <input v-model="endTime" type="datetime-local" placeholder="默认当天" :min="minDatetime" :max="maxDatetime"
                class="h-10 px-3 border border-gray-300 rounded outline-none focus:border-[#5268bc] text-sm" />
            </div>
            <MCButton class="!w-[120px]" :length="'short'" :disabled="loading"
              @click="autoExpanded = true; fetchData()"> {{ loading ? '查询中...' :
                '查询' }}</MCButton>
            <div class="flex gap-2 overflow-x-auto">
              <MCButton :length="'short'" class="!w-[120px] shrink-0" v-for="r in [
                { label: '最近1小时', h: 1 },
                { label: '最近24小时', h: 24 },
                { label: '最近7天', h: 24 * 7 },
              ]" :key="r.h" @click="setQuickRange(r.h)">{{ r.label }}</MCButton>
            </div>
          </div>
        </div>

        <!-- 图表区域 -->
        <div class="bg-white/50 rounded-lg shadow-sm p-5">
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
  </StrippedBirchLogBackground>
</template>
<style scoped>
@keyframes titleIn {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes titleOut {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(-100px);
    opacity: 0;
  }
}

.main {
  width: calc(100% - 40px);
  padding: 20px;
  padding-bottom: 0;
  margin: 0 auto;
  max-width: 1000px;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;

  .nav {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .nav .title {
    width: 160px;
    height: 160px;
    background-image: url(/src/assets/images/vanilla_gui/block/oak_sign.png);
    background-size: 160px 160px;
    background-repeat: no-repeat;
    image-rendering: pixelated;
    position: relative;
    top: -20px;
    filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.3));

    font-size: var(--title-font-size-medium);
    user-select: none;
    color: #fff;
    padding-top: 90px;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

    animation: titleIn ease-out 0.5s 0.1s backwards;
  }

  .nav .title:hover {
    animation: titleOut ease-in-out 0.5s 0.1s forwards;
  }

  .nav .back {
    margin-top: 30px;
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}

@media screen and (max-width: 500px) {
  .main {
    padding: 20px 5px;
  }
}
</style>
