<script setup lang="ts">
import type { BaseTableProps, IPagination } from '@/types';
import { ref, computed, watch } from 'vue';

interface Props {
  tableProps: BaseTableProps;
  /** 服务端分页数据获取函数 */
  fetchData?: (params: IPagination) => Promise<any>;
  /** 客户端静态数据（与 fetchData 二选一） */
  data?: Record<string, any>[];
  /** 加载状态 */
  loading?: boolean;
  /** 错误信息（有值则显示错误状态） */
  error?: string;
  /** 操作列宽度 */
  actionsWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  'page-change': [params: IPagination];
}>();

// 分页内部状态
interface PagedData extends IPagination {
  list: Record<string, any>[];
  total: number;
  totalPages: number;
}

const pagedData = ref<PagedData>({
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0,
  list: [],
});

// 支持的每页条数
const pageSizeOptions = [10, 20, 30, 40, 50];

// 数据源选择
const sourceData = computed(() => props.data || []);

// 统一分页数据（同时支持 fetchData 和 data 两种模式）
const pagedList = computed(() => {
  if (props.fetchData) return pagedData.value.list;
  // 客户端分页：切片
  const start = (pagedData.value.page - 1) * pagedData.value.size;
  return sourceData.value.slice(start, start + pagedData.value.size);
});

const pageTotal = computed(() => {
  if (props.fetchData) return pagedData.value.total;
  return sourceData.value.length;
});

const pageTotalPages = computed(() => {
  if (props.fetchData) return pagedData.value.totalPages;
  return Math.ceil(sourceData.value.length / pagedData.value.size) || 1;
});

const hasPagination = computed(() => !!props.fetchData || sourceData.value.length > 0);

// 服务端模式加载
const loadData = (page = pagedData.value.page, size = pagedData.value.size) => {
  if (!props.fetchData) return;
  pagedData.value.page = page;
  pagedData.value.size = size;

  props
    .fetchData({ page, size })
    .then((response) => {
      if (response.data.code === 0) {
        const d = response.data.data;
        pagedData.value.list = d.items;
        pagedData.value.size = d.per_page ?? d.perPage;
        pagedData.value.page = d.page;
        pagedData.value.total = d.total;
        pagedData.value.totalPages = d.pages ?? Math.ceil((d.total ?? 0) / (d.per_page ?? d.perPage ?? 10));
      }
    })
    .catch((error) => {
      console.error('数据加载失败:', error);
    });
};

const onPageSizeChange = (size: number) => {
  pagedData.value.page = 1;
  pagedData.value.size = size;
  if (props.fetchData) {
    loadData(1, size);
  }
  emit('page-change', { page: 1, size });
};

const onPageChange = (page: number) => {
  pagedData.value.page = page;
  if (props.fetchData) {
    loadData(page, pagedData.value.size);
  }
  emit('page-change', { page, size: pagedData.value.size });
};

// 初始化
if (props.fetchData) {
  loadData();
}

// 监听 fetchData 变化重新加载
watch(() => props.fetchData, () => {
  if (props.fetchData) loadData();
});

// 列名列表
const columnKeys = computed(() => Array.from(props.tableProps.columnMap.keys()));

defineExpose({ loadData, pagedData });
</script>

<template>
  <div class="text-base">
    <!-- 加载骨架 -->
    <div v-if="loading" class="space-y-3 animate-pulse">
      <div v-for="i in 5" :key="i" class="flex gap-4">
        <div v-for="j in columnKeys.length + ($slots.actions ? 1 : 0)" :key="j" class="h-10 bg-gray-200 rounded flex-1" />
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="p-8 text-center text-red-500 bg-red-50 rounded-lg">
      <p class="text-lg font-medium mb-1">加载失败</p>
      <p class="text-sm">{{ error }}</p>
    </div>

    <!-- 表格（仅表格区域可横向滚动） -->
    <div v-else class="overflow-x-auto">
      <table
        class="w-full border-collapse"
        :class="{ 'border border-gray-200': tableProps.bordered }"
      >
      <caption v-if="tableProps.caption" class="text-2xl font-bold pb-2.5 text-left">
        {{ tableProps.caption }}
      </caption>
      <thead>
        <tr class="bg-gray-100 text-left">
          <th
            v-for="[key, column] in Array.from(tableProps.columnMap)"
            :key="key"
            class="p-3 font-medium whitespace-nowrap"
            :class="[
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : '',
              tableProps.bordered ? 'border border-gray-200' : 'border-b-2 border-gray-200',
            ]"
            :style="column.width ? { width: column.width, minWidth: column.width } : {}"
          >
            {{ column.title }}
          </th>
          <th
            v-if="$slots.actions"
            class="p-3 font-medium sticky right-0 bg-gray-100 z-10 whitespace-nowrap"
            :class="{ 'border border-gray-200': tableProps.bordered, 'border-b-2 border-gray-200': !tableProps.bordered }"
            :style="actionsWidth ? { width: actionsWidth, minWidth: actionsWidth } : {}"
          >操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, rowIndex) in pagedList"
          :key="item.id ?? item.key ?? rowIndex"
          class="transition-colors"
          :class="[
            tableProps.stripe && rowIndex % 2 === 0 ? 'bg-blue-50' : '',
            !tableProps.stripe ? 'border-b border-gray-200 hover:bg-gray-50' : 'hover:bg-blue-100',
          ]"
        >
          <td
            v-for="[key, column] of Array.from(tableProps.columnMap)"
            :key="key"
            class="p-3"
            :class="[
              column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : '',
              tableProps.bordered ? 'border border-gray-200' : '',
            ]"
          >
            <!-- 具名插槽：slot name = 列 key -->
            <slot
              v-if="$slots[key]"
              :name="key"
              :row="item"
              :value="item[key]"
            />
            <template v-else>
              {{ column.callback ? column.callback(item[key], item) : item[key] }}
            </template>
          </td>
          <td
            v-if="$slots.actions"
            class="p-3 sticky right-0"
            :class="[
              tableProps.stripe && rowIndex % 2 === 0 ? 'bg-blue-50' : 'bg-white',
              tableProps.bordered ? 'border border-gray-200' : '',
            ]"            :style="actionsWidth ? { width: actionsWidth, minWidth: actionsWidth } : {}"          >
            <div class="flex gap-3">
              <slot name="actions" :row="item" />
            </div>
          </td>
        </tr>
        <tr v-if="pagedList.length === 0 && !loading">
          <td
            :colspan="columnKeys.length + ($slots.actions ? 1 : 0)"
            class="p-8 text-center text-gray-400"
          >
            <slot name="empty">暂无数据</slot>
          </td>
        </tr>
      </tbody>
    </table>
    </div>

    <!-- 分页（固定不随表格滚动） -->
    <div v-if="hasPagination && !loading && !error" class="flex flex-wrap items-center justify-between gap-4 mt-5">
      <!-- 每页条数 -->
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <span>每页</span>
        <select
          :value="pagedData.size"
          class="px-2 py-1 border border-gray-300 rounded bg-white outline-none"
          @change="onPageSizeChange(Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
        <span>条，共 {{ pageTotal }} 条</span>
      </div>

      <!-- 翻页 -->
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="pagedData.page === 1"
          @click="onPageChange(pagedData.page - 1)"
        >上一页</button>

        <template v-for="p in pageTotalPages" :key="p">
          <button
            v-if="Math.abs(p - pagedData.page) <= 2 || p === 1 || p === pageTotalPages"
            class="w-9 h-9 text-sm rounded transition-colors"
            :class="p === pagedData.page
              ? 'bg-[#5268bc] text-white'
              : 'border border-gray-300 hover:bg-gray-100'"
            @click="onPageChange(p)"
          >{{ p }}</button>
          <span v-else-if="Math.abs(p - pagedData.page) === 3" class="px-1 text-gray-400">…</span>
        </template>

        <button
          class="px-3 py-1.5 text-sm rounded border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="pagedData.page >= pageTotalPages"
          @click="onPageChange(pagedData.page + 1)"
        >下一页</button>
      </div>
    </div>
  </div>
</template>
