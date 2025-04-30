<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { guaranteeQueryALLAPI, guaranteeActionAPI } from '@/apis/guarantee';
import { openAlert } from '@/utils/TsAlert';
import MCButton from '@/components/MCButton.vue';
import { dateFormatMMDDHHMM } from '@/utils/date';

interface ListItem {
  id: number;
  playerName: string;
  createTime: string;
  expirationTime: string;
  status: number;
}

const applicantData = ref<ListItem[]>([]);
const guaranteeData = ref<ListItem[]>([]);
const toggleDisplayDoneGuarantee = ref(true);

const showStatus = (status: number, expirationTime: string) => {
  const statusMap: { [key: number]: string } = {
    0: '待同意',
    1: '已同意',
    2: '已拒绝',
  };
  if ([1, 2].includes(status)) {
    return statusMap[status];
  }
  if (isExpired(expirationTime)) {
    return '已过期';
  }

  return statusMap[status] || '未知状态';
};

function isExpired(expirationTime: string): boolean {
  const expireDate = new Date(expirationTime).getTime();
  const nowDate = new Date().getTime();
  return nowDate - expireDate > 0 ? true : false;
}
const queryAllGuarantee = () => {
  guaranteeQueryALLAPI().then((res) => {
    applicantData.value = res.data.data.applicant as Array<ListItem>;
    guaranteeData.value = res.data.data.guarantee as Array<ListItem>;
  });
};

const guaranteeAction = (id: number, action: string) => {
  const data = {
    id: id,
    action: action,
  };
  guaranteeActionAPI(data).then((res) => {
    if (res.data.code === 0) {
      openAlert(res.data.desc);
      queryAllGuarantee();
    } else {
      openAlert(res.data.desc, 'warn-card');
    }
  });
};

onMounted(() => {
  queryAllGuarantee();
});
</script>

<template>
  <div class="guarantee-result y-scroll">
    <div><button type="button" class="toggle">显示已同意/已拒绝的记录</button></div>
    <!-- 申请列表 -->
    <table class="table">
      <caption>
        申请列表
      </caption>
      <thead>
        <tr>
          <th>申请担保的 MC 账户</th>
          <th>创建时间</th>
          <th>过期时间</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="applicantData.length === 0">
          <td colspan="4" style="text-align: center">暂无数据</td>
        </tr>

        <tr v-for="item of applicantData" :key="item.id">
          <td>{{ item.playerName }}</td>
          <td>{{ dateFormatMMDDHHMM(item.createTime) }}</td>
          <td>{{ dateFormatMMDDHHMM(item.expirationTime) }}</td>
          <td>{{ showStatus(item.status, item.expirationTime) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="guarantee-list">
      <div class="title">申请列表</div>
      <ul class="y-scroll">
        <li v-for="item of applicantData" :key="item.id">
          <p>担保账户：{{ item.playerName }}</p>
          <p>当前状态：{{ showStatus(item.status, item.expirationTime) }}</p>
          <p>创建时间：{{ dateFormatMMDDHHMM(item.createTime) }}</p>
          <p>过期时间：{{ dateFormatMMDDHHMM(item.expirationTime) }}</p>
        </li>
      </ul>
    </div>

    <!-- 待确认列表 -->
    <div class="guarantee-list">
      <div class="title">待确认列表</div>
      <ul class="y-scroll">
        <li v-for="item of guaranteeData" :key="item.id">
          <p>担保账户：{{ item.playerName }}</p>
          <p>当前状态：{{ showStatus(item.status, item.expirationTime) }}</p>
          <p>创建时间：{{ dateFormatMMDDHHMM(item.createTime) }}</p>
          <p>过期时间：{{ dateFormatMMDDHHMM(item.expirationTime) }}</p>
          <p class="actions">
            <MCButton
              v-if="item.status === 0 && !isExpired(item.expirationTime)"
              class="button rejecr"
              @click="guaranteeAction(item.id, 'reject')"
              >拒绝</MCButton
            >
            <MCButton
              v-if="item.status === 0 && !isExpired(item.expirationTime)"
              class="button accept"
              @click="guaranteeAction(item.id, 'accept')"
              >同意</MCButton
            >
          </p>
        </li>
      </ul>
    </div>

    <table class="table">
      <caption>
        待确认列表
      </caption>
      <thead>
        <tr>
          <th>请求担保的 MC 账户</th>
          <th>创建时间</th>
          <th>过期时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="guaranteeData.length === 0">
          <td colspan="5" style="text-align: center">暂无数据</td>
        </tr>
        <tr v-for="item of guaranteeData" :key="item.id">
          <td>{{ item.playerName }}</td>
          <td>{{ dateFormatMMDDHHMM(item.createTime) }}</td>
          <td>{{ dateFormatMMDDHHMM(item.expirationTime) }}</td>

          <td>{{ showStatus(item.status, item.expirationTime) }}</td>
          <td class="actions">
            <MCButton
              v-if="item.status === 0 && !isExpired(item.expirationTime)"
              class="button rejecr"
              @click="guaranteeAction(item.id, 'reject')"
              >拒绝</MCButton
            >
            <MCButton
              v-if="item.status === 0 && !isExpired(item.expirationTime)"
              class="button accept"
              @click="guaranteeAction(item.id, 'accept')"
              >同意</MCButton
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.guarantee-list {
  display: none;
  .toggle {
    font-size: 20px;
  }
  .title {
    font-size: 30px;
    padding: 20px;
  }
  ul {
    display: flex;
    justify-content: center;
    flex-direction: column-reverse;
    gap: 10px;
    overflow-y: auto;
    max-height: 300px;
    margin: 0 auto;
    li {
      border: 1px solid #000;
      padding: 10px 20px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.3);
    }
    p {
      text-align: left;
      font-size: 20px;
      line-height: 1.5em;
    }
  }
}
.guarantee-result {
  text-align: center;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
  --font-size: 18px;
}

.guarantee-result .table {
  border-collapse: collapse;
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  margin-top: 50px;
}

.guarantee-result caption {
  font-size: 30px;
}

.guarantee-result .avatar img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.table th,
.table td {
  padding: 10px 18px;
  font-size: var(--font-size);
  min-height: 30px;
}

.table tr {
  border-bottom: 1px solid #ccc;
}
.actions {
  display: flex;
  gap: 10px;
  .button {
    padding: 8px 16px;
    font-size: var(--font-size);
    border-radius: 5px;
  }
}
@media (max-width: 800px) {
  .actions {
    padding-top: 5px;
  }
  .guarantee-list {
    display: block;
  }
  .table {
    display: none;
  }
}
</style>
