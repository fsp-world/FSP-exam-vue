<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { getUsers, updateUser } from '@/apis/admin';
import { computStatus } from '@/utils/statusUtil';
import { openAlert } from '@/utils/TsAlert';
import { dateFormatYYYYMMDD } from '@/utils/date';
import type { UserUpdate, IPagination } from '@/types';
import { roleMap } from '@/stores/user';
import BaseTable from './BaseTable.vue';
import MCButton from '@/components/MCButton.vue';

// 加载状态
const loading = ref(false);

// 搜索
const queryForm = reactive({
  status: '' as number | string,
  keyword: '',
});

// 列定义
const columnMap = new Map([
  ['id', { title: '#', width: '50px' }],
  ['username', { title: '用户名' }],
  ['userQQ', { title: '用户 QQ', width: '150px' }],
  ['role', { title: '用户角色', width: '100px' }],
  ['registeredAt', { title: '注册时间', width: '170px' }],
  ['status', { title: '状态', width: '90px' }],
]);

// 服务端分页加载
const fetchUsers = async (params: IPagination) => {
  loading.value = true;
  const res = await getUsers(params);
  loading.value = false;
  return res;
};

// 编辑用户
const editUser = (user: UserUpdate) => {
  selectedUser.value = { ...user, password: '', addtime: '' };
  showModal.value = true;
};

// 模态框
const showModal = ref(false);
const tableKey = ref(0);
const selectedUser = ref<UserUpdate>({
  id: 0, username: '', userQQ: '', password: '', passwordAgain: '',
  addtime: '', role: 'user', status: 0,
});

const saveUser = async () => {
  if (selectedUser.value.addtime) {
    selectedUser.value.addtime = new Date(selectedUser.value.addtime).toISOString();
  }
  const res = await updateUser(selectedUser.value);
  openAlert(res.data.desc);
  if (res.data.code === 0) {
    showModal.value = false;
    tableKey.value++;
  }
};

onMounted(() => {
  // fetchData 模式会自动初始化加载
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm">
    <!-- 头部 -->
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-gray-200">
      <h1 class="text-2xl font-bold">用户管理</h1>
      <nav class="flex items-center gap-1.5 text-sm text-gray-500">
        <router-link to="/admin" class="hover:text-[#5268bc] transition-colors">后台首页</router-link>
        <span>/</span>
        <router-link to="/admin/user" class="hover:text-[#5268bc] transition-colors">用户管理</router-link>
        <span>/</span>
        <span class="text-gray-700">用户列表</span>
      </nav>
    </div>

    <!-- 表格 -->
    <div class="p-5">
      <BaseTable :key="tableKey" :table-props="{ columnMap, stripe: true, bordered: true }" :fetch-data="fetchUsers"
        :loading="loading" actions-width="110px">
        <template #registeredAt="{ value }">
          <span class="whitespace-nowrap">{{ dateFormatYYYYMMDD(value) }}</span>
        </template>
        <template #status="{ value }">
          {{ computStatus(value) }}
        </template>
        <template #role="{ value }">
          {{ roleMap[value as string] || value }}
        </template>
        <template #actions="{ row }">
          <MCButton length="short" @click="editUser(row as unknown as UserUpdate)">修改</MCButton>
        </template>
      </BaseTable>
    </div>
  </div>

  <!-- 修改用户模态框 -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
        @click.self="showModal = false">
        <div class="bg-white rounded-xl p-6 w-[420px] max-w-[90vw] shadow-2xl max-h-[90vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4">修改用户信息</h2>
          <form @submit.prevent="saveUser" class="flex flex-col gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium">ID</label>
              <input :value="selectedUser.id" type="text" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-400 outline-none" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">用户名</label>
              <input v-model="selectedUser.username" type="text" required placeholder="修改用户名"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">用户 QQ</label>
              <input v-model="selectedUser.userQQ" type="text" required placeholder="修改 QQ"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">用户密码</label>
              <input v-model="selectedUser.password" type="password" placeholder="修改密码"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">注册时间</label>
              <input v-model="selectedUser.addtime" type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc]" />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">用户角色</label>
              <select v-model="selectedUser.role" required
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc] bg-white">
                <option v-for="(label, value) in roleMap" :key="value" :value="value">{{ label }}</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium">账号状态</label>
              <select v-model="selectedUser.status" required
                class="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-[#5268bc] bg-white">
                <option :value="0">未激活</option>
                <option :value="1">正常</option>
                <option :value="2">临时封禁</option>
                <option :value="3">封禁</option>
                <option :value="4">删除</option>
              </select>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <MCButton length="short" disabled-style @click="showModal = false">取消</MCButton>
              <MCButton length="short" type="submit">保存</MCButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active>div,
.modal-fade-leave-active>div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from>div,
.modal-fade-leave-to>div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
