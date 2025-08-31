<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { getUsers, updateUser } from '@/apis/admin';
import MCButton from '@/components/MCButton.vue';
import { computStatus } from '@/utils/statusUtil';
import { dateFormatYYYYMMDDHH } from '@/utils/date';
import { IUser } from '@/types';

// 用户数据
const data = ref({
  list: [],
  page: 1,
  size: 10,
  total: 0,
});

// 查询 - 加载状态
const loading = ref(false);

// 搜索
const queryForm = reactive({
  status: '',
  keyword: ''
})

// 分页加载用户数据
const loadUsers = async () => {
  loading.value = true
  const res = await getUsers({ page: data.value.page, size: data.value.size });
  data.value = res.data;
  loading.value = false
};

// 搜索
const searchData = computed(() => {
  const { status, keyword } = queryForm;
  
  return data.value.list.filter((item: IUser) => {
    return (filterStatus(status, item.status as number)) &&
      (item.username.includes(keyword) || item.userQQ.includes(keyword));
  })
})

const filterStatus = (a: number | string, b: number) => {
  if (a === '' || a === undefined) return true
  if (a == b) return true
  return false
}

// 修改用户信息
const editUser = (user: IUser) => {
  selectedUser.value = { ...user };
  selectedUser.value.password = '';
  selectedUser.value.addtime = '';
  showModal.value = true;
};

// 模态框相关
const showModal = ref(false);
const selectedUser = ref<IUser>({
  id: undefined,
  username: '',
  userQQ: '',
  password: '',
  addtime: '',
  role: undefined,
  status: 0,
});

// 保存修改
const saveUser = async () => {
  if (selectedUser.value.addtime) {
    selectedUser.value.addtime = new Date(selectedUser.value.addtime).toString();
  }
  await updateUser(selectedUser.value);
  showModal.value = false;
  await loadUsers(); // 重新加载数据
};

// 初始化加载数据
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <el-card shadow="never" class="common-card">
    <!-- 导航模块 -->
    <template #header>
      <el-row justify="space-between" align="middle">
        <h1>用户管理</h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/admin">管理首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/admin/user">会员管理</el-breadcrumb-item>
          <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-row>
    </template>

    <!-- 搜索模块 -->
    <div class="common-search">
      <el-form :inline="true">
        <el-form-item label="是否审核">
          <el-select style="width:120px;" v-model.number="queryForm.status" placeholder="选择审核" clearable>
            <el-option label="未激活" :value="0" />
            <el-option label="正常" :value="1" />
            <el-option label="临时封禁" :value="2" />
            <el-option label="永久封禁" :value="3" />
            <el-option label="删除" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="输入关键字">
          <el-input style="width:230px;" v-model.trim="queryForm.keyword" placeholder="请输入用户名/用户 QQ" clearable />
        </el-form-item>
        <el-form-item>
          <MCButton class="button" @click="loadUsers">刷新</MCButton>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格模块 -->
    <el-table ref="tableRef" v-loading="loading" :data="searchData" style="min-width: 100%; font-size: 1em;" stripe border>
       <!-- @selection-change="onSelectionChange" -->
      <!-- <el-table-column type="selection" label="#" width="30" fixed="left" /> -->
      <el-table-column label="#" prop="id" width="30" />
      <el-table-column label="用户名" prop="username" />
      <!-- <el-table-column label="头像" width="100" #default="scope">
        <el-avatar :size="36" :src="" />
      </el-table-column> -->
      <el-table-column label="用户 QQ" prop="userQQ" width="150" />
      <el-table-column label="用户角色" prop="role" width="100" />
      <el-table-column label="注册时间" prop="addtime" #default="scope">
        <span>{{ dateFormatYYYYMMDDHH(scope.row.addtime) }}</span>
      </el-table-column>
      <el-table-column label="状态" prop="status" width="90" #default="scope">
        <span>{{ computStatus(scope.row.status) }}</span>
      </el-table-column>
      <el-table-column label="操作" #default="scope" fixed="right" width="90">
        <MCButton class="button" @click="editUser(scope.row)">修改</MCButton>
      </el-table-column>
    </el-table>


    <!-- 分页模块 -->
    <template #footer>
      <el-pagination :pager-count="5" background v-model:current-page="data.page" v-model:page-size="data.size"
        :page-sizes="[10, 20, 30, 40, 50]" layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @change="loadUsers" />
    </template>

  </el-card>
  <!-- <div class="table">
    <table>
      <thead>
        <tr>
          <th class="id">#</th>
          <th class="name">用户名</th>
          <th class="qq">用户 QQ</th>
          <th class="role">用户角色</th>
          <th class="time">注册时间</th>
          <th class="status">账号状态</th>
          <th class="action">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.list" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.username }}</td>
          <td>{{ item.userQQ }}</td>
          <td>{{ item.role }}</td>
          <td>{{ dateFormatYYYYMMDDHH(item.addtime) }}</td>
          <td>{{ computStatus(item.status) }}</td>
          <td class="action">
            <MCButton class="button" @click="editUser(item)">修改</MCButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div> -->

  <!-- 分页 -->
  <!-- <div class="pagination">
    <button type="button" @click="loadUsers(data.page - 1, data.size)" :disabled="data.page === 1">上一页</button>
    <span>第 {{ data.page }} 页 / 共 {{ data.totalPages }} 页</span>
    <button type="button" @click="loadUsers(data.page + 1, data.size)" :disabled="data.page * data.size >= data.total">
      下一页
    </button>
    <button type="button" @click="loadUsers(data.totalPages, data.size)" :disabled="data.page === data.totalPages">
      最后一页
    </button>
  </div> -->

  <!-- 修改用户模态框 -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>修改用户信息</h2>
      <form @submit.prevent="saveUser">
        <div class="form-group">
          <label>ID</label>
          <input :value="selectedUser.id" type="text" disabled />
        </div>
        <div class="form-group">
          <label>用户名</label>
          <input v-model="selectedUser.username" type="text" required placeholder="修改用户名" />
        </div>
        <div class="form-group">
          <label>用户 QQ</label>
          <input v-model="selectedUser.userQQ" type="text" required placeholder="修改 QQ" />
        </div>
        <div class="form-group">
          <label>用户密码</label>
          <input v-model="selectedUser.password" type="password" placeholder="修改密码" />
        </div>
        <div class="form-group">
          <label>注册时间</label>
          <input v-model="selectedUser.addtime" type="datetime-local" />
        </div>
        <div class="form-group">
          <label>用户角色</label>
          <select v-model="selectedUser.role" required>
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
          </select>
        </div>
        <div class="form-group">
          <label>账号状态</label>
          <select v-model="selectedUser.status" required>
            <option :value="0">未激活</option>
            <option :value="1">正常</option>
            <option :value="2">临时封禁</option>
            <option :value="3">封禁</option>
            <option :value="4">删除</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" @click="showModal = false">取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
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
.action {
  .button {
    width: 100%;
    height: 40px;
    margin: 0px auto;
  }
}
@media (max-width: 1200px) {
  .table {
    max-width: 90vw;
    overflow-x: auto;
    .avatar,
    .name,
    .qq,
    .role,
    .time,
    .status,
    .action {
      min-width: 80px;
    }
  }
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  border: 1px solid #ccc;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  justify-content: end;
  gap: 10px;
}
</style>
