<script setup lang="ts">
import { ref, computed } from 'vue';
import { getConfig, getConfigs, setConfig } from '@/apis/admin';
import MCButton from '@/components/MCButton.vue';
import { type ConfigItem, ConfigItemType } from '@/types';
import { openAlert } from '@/utils/TsAlert';

const data = ref<ConfigItem[]>([]);
const searchData = ref('');
const searchType = ref('');
const showModal = ref(false);
const isAdd = ref(false);
const selectedConfigItem = ref<ConfigItem>({
  key: '',
  value: '',
  type: ConfigItemType.STR,
});

const getConfig_ = () => {
  getConfigs().then((res: { data: { list: ConfigItem[] } }) => {
    data.value = res.data.list;
  });
};
getConfig_();

const editItem = (key: string) => {
  selectedConfigItem.value = {
    key: '',
    value: '',
    type: ConfigItemType.STR,
  };
  getConfig(key).then((res: { data: { value: ConfigItem } }) => {
    selectedConfigItem.value = res.data.value;
  });
  showModal.value = true;
  isAdd.value = false;
};

const add = () => {
  selectedConfigItem.value = {
    key: '',
    value: '',
    type: ConfigItemType.STR,
  };
  showModal.value = true;
  isAdd.value = true;
};

const save = async () => {
  const res = await setConfig(selectedConfigItem.value);
  if (res.data.code === 0) {
    openAlert('成功!');
  } else {
    openAlert('失败!');
  }
  showModal.value = false;
  getConfig_();
};

const searchComputed = computed(() => {
  return data.value.filter((item: ConfigItem) => {
    return (
      (!searchData.value || item.key.includes(searchData.value) || item.value.includes(searchData.value)) &&
      (!searchType.value || item.type === searchType.value)
    );
  });
});
</script>

<template>
  <h1>配置管理</h1>
  <div class="search">
    <input type="search" v-model="searchData" placeholder="搜索" />
    &nbsp; type:
    <select v-model="searchType">
      <option v-for="i in ConfigItemType" :value="i">{{ i }}</option>
    </select>
    <MCButton
      class="button"
      @click="
        searchType = '';
        searchData = '';
      "
      >&times;</MCButton
    >
    &nbsp;
    <MCButton class="button" @click="add">新增</MCButton>
    &nbsp;
    <MCButton class="button" @click="getConfig_">刷新</MCButton>
  </div>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th class="name">键</th>
          <th class="qq">值</th>
          <th class="role">类型</th>
          <th class="action">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in searchComputed" :key="item.key">
          <td>{{ item.key }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.type }}</td>
          <td class="action">
            <MCButton class="button" @click="editItem(item.key)">修改</MCButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 模态框 -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>修改配置项</h2>
      <p>{{ selectedConfigItem }}</p>
      <form @submit.prevent="save">
        <div class="form-group">
          <label>Key</label>
          <input v-model="selectedConfigItem.key" type="text" required placeholder="key" :disabled="!isAdd" />
        </div>
        <div class="form-group">
          <label>Value</label>
          <input v-model="selectedConfigItem.value" type="text" required placeholder="value" />
        </div>
        <div class="form-group">
          <label>Type</label>
          <select v-model="selectedConfigItem.type" required placeholder="type">
            <option v-for="i in ConfigItemType" :value="i">{{ i }}</option>
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
.search {
  margin: 10px 0px;
  display: flex;
  align-items: center;

  input {
    width: 300px;
    border: 1px solid #ccc;
    padding: 10px 16px;
    outline: none;
    border-radius: 6px;
  }
}

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
