<script setup lang="ts">
import { type ConfigItem, type IPagination, ConfigItemType } from '@/types';
import { ref, onMounted } from 'vue';
import { getConfigs, setConfig } from '@/apis/admin';
import { openAlert } from '@/utils/TsAlert';
import { validateConfigValue } from '@/utils/config';
import AdminButton from './AdminButton.vue';

// 允许配置的键 -> 中文翻译（在此处新增可配置项）
interface SystemConfigDef {
  key: string;
  label: string;
  type: ConfigItemType;
  /** int 类型的取值范围（可选，不配置则不限制） */
  min?: number;
  max?: number;
}

const SYSTEM_CONFIG_DEFS: SystemConfigDef[] = [
  { key: 'MAIL_ENABLED', label: '启用邮件功能', type: ConfigItemType.BOOL },
  {
    key: 'MC_PLAYER_COLLECT_INTERVAL_MINUTES',
    label: '在线人数采集间隔（单位：分钟）',
    type: ConfigItemType.INT,
    min: 3,
    max: 1440, // 一天一次
  },
];

interface ConfigRow {
  def: SystemConfigDef;
  item: ConfigItem;
}

const rows = ref<ConfigRow[]>([]);
const loading = ref(false);

// 悬浮提示：渲染到 body，避免被表格 overflow 裁剪
interface TooltipData {
  x: number;
  y: number;
  key: string;
  desc: string;
}

const tooltip = ref<TooltipData | null>(null);

const showTooltip = (e: MouseEvent, row: ConfigRow) => {
  tooltip.value = {
    x: Math.min(e.clientX + 14, window.innerWidth - 280),
    y: e.clientY + 14,
    key: row.def.key,
    desc: row.item.desc,
  };
};

const hideTooltip = () => {
  tooltip.value = null;
};

// 拉取全部页的配置，并按白名单过滤
const fetchData = async () => {
  loading.value = true;
  try {
    // 后端配置项是分页的，循环拉取所有页
    const all: ConfigItem[] = [];
    let page = 1;
    const size = 1000;
    for (;;) {
      const res = await getConfigs({ page, size } as IPagination);
      if (res.data.code !== 0) break;
      const d = res.data.data;
      all.push(...(d.items ?? []));
      const pages = d.pages ?? Math.ceil((d.total ?? 0) / (d.per_page ?? d.perPage ?? size));
      if (page >= pages || pages === 0) break;
      page++;
    }

    const byKey = new Map(all.map((i) => [i.key, i]));
    // 只保留后端实际存在的白名单配置项；后端不存在则不显示
    rows.value = SYSTEM_CONFIG_DEFS.flatMap((def) => {
      const existing = byKey.get(def.key);
      return existing ? [{ def, item: existing }] : [];
    });
  } finally {
    loading.value = false;
  }
};

// int 输入过滤：只保留数字字符（自动剔除字母、小数点、负号等）
const onIntInput = (e: Event, row: ConfigRow) => {
  const el = e.target as HTMLInputElement;
  const digits = el.value.replace(/\D/g, '');
  el.value = digits;
  row.item.value = digits;
};

const save = async (row: ConfigRow) => {
  // 值不能为空
  if (!validateConfigValue(row.item.value)) return;
  if (row.item.type === ConfigItemType.INT) {
    if (!/^\d+$/.test(row.item.value)) {
      openAlert('请输入正整数');
      return;
    }
    const n = Number(row.item.value);
    const { min, max } = row.def;
    if ((min !== undefined && n < min) || (max !== undefined && n > max)) {
      openAlert(`数值需在 ${min ?? 0} ~ ${max ?? '不限'} 之间`);
      return;
    }
  }
  if (row.item.type === ConfigItemType.BOOL) {
    const v = String(row.item.value).toLowerCase();
    row.item.value = v === 'true' || v === '1' ? 'True' : 'False';
  }
  const res = await setConfig(row.item);
  if (res.data.code === 0) {
    openAlert('成功!');
  } else {
    openAlert('失败!');
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="rounded-lg bg-white shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-4">
      <h1 class="text-2xl font-bold">系统设置</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="transition-colors hover:text-[#5268bc]">管理首页</router-link>
        <span>/</span>
        <span class="text-gray-700">系统设置</span>
      </nav>
    </div>

    <div class="p-5">
      <div class="mb-5 flex items-center gap-3">
        <AdminButton @click="fetchData">刷新</AdminButton>
      </div>

      <div v-if="loading" class="p-8 text-center text-sm text-gray-400">加载中…</div>

      <!-- 只展示白名单内的配置项，支持编辑值 -->
      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="bg-gray-100 text-left">
              <th class="border border-gray-200 p-3 font-medium whitespace-nowrap">设置项</th>
              <th class="border border-gray-200 p-3 font-medium whitespace-nowrap">值</th>
              <th class="border border-gray-200 p-3 font-medium whitespace-nowrap" style="width: 100px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.def.key" class="hover:bg-gray-50">
              <td class="border border-gray-200 p-3 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span>{{ row.def.label }}</span>
                  <span
                    class="inline-flex cursor-help text-gray-400 hover:text-[#5268bc]"
                    @mouseenter="showTooltip($event, row)"
                    @mouseleave="hideTooltip"
                  >
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </span>
                </div>
              </td>
              <td class="border border-gray-200 p-2">
                <select
                  v-if="row.def.type === ConfigItemType.BOOL"
                  v-model="row.item.value"
                  class="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-[#5268bc]"
                >
                  <option value="True">启用</option>
                  <option value="False">关闭</option>
                </select>
                <input
                  v-else-if="row.def.type === ConfigItemType.INT"
                  :value="row.item.value"
                  type="text"
                  inputmode="numeric"
                  @input="onIntInput($event, row)"
                  class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#5268bc]"
                />
                <input
                  v-else
                  v-model="row.item.value"
                  type="text"
                  class="w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-[#5268bc]"
                />
              </td>
              <td class="border border-gray-200 p-2">
                <AdminButton size="small" @click="save(row)">保存</AdminButton>
              </td>
            </tr>
            <tr v-if="rows.length === 0">
              <td colspan="3" class="p-8 text-center text-gray-400">暂无配置项</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 悬浮提示：渲染到 body，避免被表格 overflow 裁剪 -->
  <Teleport to="body">
    <div
      v-if="tooltip"
      class="fixed z-[9999] max-h-[70vh] w-64 overflow-y-auto rounded-md border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-600 shadow-lg"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="mb-1">
        <span class="font-medium text-gray-500">键：</span><span class="font-mono">{{ tooltip.key }}</span>
      </div>
      <div><span class="font-medium text-gray-500">说明：</span>{{ tooltip.desc }}</div>
    </div>
  </Teleport>
</template>
