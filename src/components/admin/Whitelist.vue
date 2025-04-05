<script setup>
import { ref, onMounted } from 'vue';
import { getWhitelist } from '@/apis/admin';

// 白名单数据
const wlData = ref({
  list: [],
  page: 1,
  size: 10,
  total: 0,
});

// 加载状态
const isLoading = ref(false);
const isError = ref(false);

// 加载白名单数据
const getWL = async (page = 1, size = 10) => {
  isLoading.value = true;
  isError.value = false;

  try {
    const res = await getWhitelist({ page, size });
    wlData.value = res.data;
  } catch (error) {
    isError.value = true;
    console.error('加载白名单数据失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 初始化加载数据
onMounted(() => {
  getWL();
});
</script>

<template>
  <h1>白名单管理</h1>

  <!-- 加载状态 -->
  <div v-if="isLoading" class="loading">加载中...</div>

  <!-- 错误提示 -->
  <div v-if="isError" class="error">加载失败，请稍后重试。</div>

  <!-- 数据表格 -->
  <table v-if="!isLoading && !isError">
    <thead>
      <tr>
        <th>#</th>
        <th>用户ID</th>
        <th>MC NAME</th>
        <th>UUID</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of wlData.list" :key="index">
        <td>{{ item.id }}</td>
        <td>{{ item.uid }}</td>
        <td>{{ item.name }}</td>
        <td class="uuid">{{ item.uuid }}</td>
      </tr>
    </tbody>
  </table>

  <!-- 分页 -->
  <div v-if="!isLoading && !isError" class="pagination">
    <button
      type="button"
      @click="getWL(wlData.page - 1, wlData.size)"
      :disabled="wlData.page === 1"
    >
      上一页
    </button>
    <span>第 {{ wlData.page }} 页 / 共 {{ Math.ceil(wlData.total / wlData.size) }} 页</span>
    <button
      type="button"
      @click="getWL(wlData.page + 1, wlData.size)"
      :disabled="wlData.page * wlData.size >= wlData.total"
    >
      下一页
    </button>
  </div>
</template>

<style scoped>
table,
table td,
table th {
  border: 1px solid #000000;
  border-collapse: collapse;
}
table {
  width: 100%;
  margin-bottom: 20px;
}
td,
th {
  padding: 10px;
  text-align: center;
}
.uuid {
  font-family: monospace; /* 使 UUID 显示更整齐 */
}
.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}
.error {
  color: red;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
button {
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
</style>
