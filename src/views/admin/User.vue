<script setup>
import { ref, onMounted } from 'vue';
import { getUsers, updateUser, banUser } from '@/apis/admin';
import MCButton from '@/components/MCButton.vue';
import { computStatus } from '@/utils/statusUtil';

// 用户数据
const data = ref({
  list: [],
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0,
});

// 分页加载用户数据
const loadUsers = async (page = 1, size = 10) => {
  const res = await getUsers({ page, size });
  data.value = res.data;
  data.value.totalPages = Math.ceil(data.value.total / data.value.size);
};

// 修改用户信息
const editUser = (user) => {
  selectedUser.value = { ...user };
  selectedUser.value.password = '';
  showModal.value = true;
};

// 封禁用户
const banUserHandler = async (userId) => {
  // const confirm = confirm('确定要封禁该用户吗？');
  // if (confirm) {
  //   await banUser(userId);
  //   await loadUsers(data.value.page, data.value.size); // 重新加载数据
  // }
};

const delUserHandler = async (userId) => {
  if (confirm('确定要删除该用户吗？')) {
    await delUser({ id: userId });
    await loadUsers(data.value.page, data.value.size); // 重新加载数据
  }
};

// 模态框相关
const showModal = ref(false);
const selectedUser = ref({
  id: null,
  username: '',
  user_qq: '',
  role: '',
  status: 0,
  password: '',
});

// 保存修改
const saveUser = async () => {
  await updateUser(selectedUser.value);
  showModal.value = false;
  await loadUsers(data.value.page, data.value.size); // 重新加载数据
};

// 初始化加载数据
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <h1>用户管理</h1>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th class="id">#</th>
          <th class="avatar">头像</th>
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
          <td><img :src="item.avatar" alt="头像" class="avatar" /></td>
          <td>{{ item.username }}</td>
          <td>{{ item.user_qq }}</td>
          <td>{{ item.role }}</td>
          <td>{{ item.addtime }}</td>
          <td>{{ computStatus(item.status) }}</td>
          <td class="action">
            <MCButton class="button" @click="editUser(item)">修改</MCButton>
            <MCButton class="button" @click="delUserHandler(item.id)"> 删除 </MCButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 分页 -->
  <div class="pagination">
    <button type="button" @click="loadUsers(data.page - 1, data.size)" :disabled="data.page === 1">上一页</button>
    <span>第 {{ data.page }} 页 / 共 {{ data.totalPages }} 页</span>
    <button type="button" @click="loadUsers(data.page + 1, data.size)" :disabled="data.page * data.size >= data.total">
      下一页
    </button>
    <button type="button" @click="loadUsers(data.totalPages, data.size)" :disabled="data.page === data.totalPages">
      最后一页
    </button>
  </div>

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
          <input v-model="selectedUser.user_qq" type="text" required placeholder="修改 QQ" />
        </div>
        <div class="form-group">
          <label>用户密码</label>
          <input v-model="selectedUser.password" type="password" placeholder="修改密码" />
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
    margin: 5px auto;
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
