<script setup lang="ts">
import { type ConfigItem, ConfigItemType } from '@/types';
import { ref, computed } from 'vue';
import { getConfig, getConfigs, setConfig, deleteConfig } from '@/apis/admin';
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

const checkConfigKey = (key: string): boolean => {
  const ALLOWED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_';
  for (const char of key) {
    if (!ALLOWED_CHARS.includes(char)) {
      return false;
    }
  }
  return true;
};

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

const deleteItem = (key: string) => {
  const check = confirm(`确认删除 ${key} 吗`);
  if (check) {
    deleteConfig(key).then((res) => {
      openAlert(res.data.desc);
      if (res.data.code === 0) {
        getConfig_();
      }
    });
  }
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
  if (!checkConfigKey(selectedConfigItem.value.key)) {
    openAlert('键名只允许包含大写的26个字母或者下划线');
    showModal.value = false;
    return;
  }
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
  <div class="filter">
    <el-input type="search" size="large" style="width: 240px" v-model="searchData" placeholder="搜索" />
    <el-select size="large" style="width: 240px" v-model="searchType" placeholder="筛选类型">
      <el-option v-for="i in ConfigItemType" :value="i">{{ i }}</el-option>
    </el-select>
    <el-button
      size="large"
      @click="
        searchType = '';
        searchData = '';
      "
    >
      <el-icon><Close /></el-icon>
    </el-button>

    <el-button-group size="large">
      <el-button @click="add">新增</el-button>
      <el-button @click="getConfig_">刷新</el-button>
    </el-button-group>
  </div>
  <div class="table">
    <el-table :data="searchComputed" style="width: 90%; font-size: 16px">
      <el-table-column fixed prop="key" label="键" width="250" />
      <el-table-column prop="value" label="值" width="400" />
      <el-table-column prop="type" label="类型" width="60" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button size="large" link type="primary" @click="editItem(scope.row.key)">修改</el-button>
          <el-button size="large" link type="danger" @click="deleteItem(scope.row.key)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 模态框 -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>修改配置项</h2>
      <p>data:</p>
      <p style="padding-bottom: 10px">
        {<br />
        &nbsp;&nbsp;key: {{ selectedConfigItem.key }}<br />
        &nbsp;&nbsp;value: {{ selectedConfigItem.value }}<br />
        &nbsp;&nbsp;type: {{ selectedConfigItem.type }}<br />
        }
      </p>
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
h1 {
  font-size: 30px;
}
.filter {
  padding: 20px 0;
  display: flex;
  gap: 10px;
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
  z-index: 10000;
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
