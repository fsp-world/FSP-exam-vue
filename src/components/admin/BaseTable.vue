<script setup lang="ts">
import type { BaseTableProps, IPagination } from '@/types';
import { ref } from 'vue';

interface Props {
  tableProps: BaseTableProps;
  fetchData: (params: IPagination) => Promise<any>;
}

const props = defineProps<Props>();

const tableProps = props.tableProps;

interface TrData {
  id?: number;
}

interface Data extends IPagination {
  list: TrData[];
  total: number;
  totalPages: number;
}

const data = ref<Data>({
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0,
  list: [],
});

// const props = withDefaults(defineProps<Props>(), {
//   mode: 'add',
// });

const loadData = (page = 1, size = 10) => {
  props
    .fetchData({ page: page, size: size })
    .then((response) => {
      if (response.data.code === 0) {
        data.value.list = response.data.list;
        data.value.size = response.data.size;
        data.value.page = response.data.page;
        data.value.total = response.data.total;
        data.value.totalPages = Math.ceil(data.value.total / data.value.size);
        // console.log(data.value);
      }
    })
    .catch((error) => {
      console.error('数据加载失败:', error);
    });
};
loadData();
</script>
<template>
  <div class="table">
    <table>
      <caption>
        {{
          tableProps.caption
        }}
      </caption>
      <thead>
        <th v-for="[key, label] in tableProps.columnMap" :key="key">{{ label }}</th>
      </thead>
      <tbody>
        <tr v-for="item in data.list" :key="item.id">
          <!-- 根据 Map 的顺序生成表格内容 -->
          <td v-for="[key, label] of Array.from(tableProps.columnMap)" :key="key">{{ item[key as keyof TrData] }}</td>
        </tr>
        <tr v-if="data.list.length === 0">
          <td :colspan="tableProps.columnMap.size" style="text-align: center">暂无数据</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div class="pagination">
      <button type="button" @click="loadData(data.page - 1, data.size)" :disabled="data.page === 1">上一页</button>
      <span>第 {{ data.page }} 页 / 共 {{ data.totalPages }} 页</span>
      <button type="button" @click="loadData(data.page + 1, data.size)" :disabled="data.page * data.size >= data.total">
        下一页
      </button>
      <button type="button" @click="loadData(data.totalPages, data.size)" :disabled="data.page === data.totalPages">
        最后一页
      </button>
    </div>
  </div>
</template>
<style scoped>
table {
  width: 90%;
  border: 1px solid #000;
  caption {
    font-size: 26px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  th,
  td {
    border: 1px solid #000;
    padding: 5px;
  }
}
button {
  margin: 5px;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #ccc;
  cursor: pointer;
}
button:hover {
  background-color: #888;
}
button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
