<script lang="ts" setup>
import { Fold, Expand, Search, Lock, User, Setting, Bell, SwitchButton } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 路由
const router = useRouter();

// 头部搜索框
const keyword = ref('');

// 头像下拉菜单点击事件
const onCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      const res = await ElMessageBox.confirm('您确定要退出当前登陆吗？', '提示', { type: 'warning' });
      if (res) {
        localStorage.removeItem('gx-token');
        router.replace('/login');
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    router.push(command);
  }
}

// 系统通知默认显示消息选项
const noticeType = ref('msg');

// 系统通知
const noticeData = ref([
  {
    id: 1,
    readed: true,
    hidden: false,
    type: 'msg',
    name: '郑曦月',
    content: '审批请求已发送，请查收',
    avatar: 'https://img2.baidu.com/it/u=1316245042,2395535024&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    createTime: '今天 12:30:01'
  },
  {
    id: 2,
    readed: false,
    hidden: false,
    type: 'msg',
    name: '郑曦月',
    content: '审批请求已发送，请查收',
    avatar: 'https://img2.baidu.com/it/u=1316245042,2395535024&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    createTime: '今天 12:30:01'
  },
  {
    id: 3,
    readed: false,
    hidden: false,
    type: 'msg',
    name: '郑曦月',
    content: '审批请求已发送，请查收',
    avatar: 'https://img2.baidu.com/it/u=1316245042,2395535024&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    createTime: '今天 12:30:01'
  },
  {
    id: 4,
    readed: false,
    hidden: false,
    type: 'notice',
    name: '龚贤',
    content: '明天放假不用上课',
    avatar: 'https://img2.baidu.com/it/u=1316245042,2395535024&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500',
    createTime: '今天 11:30:01'
  }
])

// 通知类型数据
const filterNotice = (type: string) => {
  return noticeData.value.filter(subItem => subItem.type === type && !subItem.hidden);
}

// 清空消息
const clearNotice = (type: string) => {
  noticeData.value.map(item => {
    if (item.type === type) {
      item.hidden = true;
    }
    return item;
  })
}

// 设置全部已读
const setAllReaded = (type: string) => {
  noticeData.value.map(item => {
    if (item.type === type) {
      item.readed = true;
    }
    return item;
  })
}

// 统计所有的未读总数
const countUnreaded = computed(() => {
  let sum = 0;
  for (const item of noticeData.value) {
    if (!item.hidden && !item.readed) sum += 1;
  }
  return sum;

  // return noticeData.value.reduce((sum, item) => {
  //   return sum + (item.readed ? 0 : 1);
  // }, 0)
})

// 菜单收缩
const isCollapse = ref(false);
</script>

<template>
   <el-container style="height:100vh;">
    <el-aside width="auto">

      <router-link to="/" class="logo">
        <el-icon :size="30" color="rgba(255,255,255,.7)">
          <ShoppingBag />
        </el-icon>
        <span v-show="!isCollapse">FSP-EXAM v1.0.1</span>
      </router-link>

      <el-scrollbar style="height: calc(100vh - 60px);">
        <el-menu :default-active="$route.path" router :collapse="isCollapse" unique-opened class="my-menu">

          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Monitor />
              </el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="#">管理1</el-menu-item>
            <el-menu-item index="#">管理2</el-menu-item>
            <el-menu-item index="#">管理3</el-menu-item>
            <el-menu-item index="#">管理4</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/user">用户列表</el-menu-item>
            <el-menu-item index="/admin/whitelist">用户白名</el-menu-item>
            <el-menu-item index="/admin/guarantee_mgmt">用户担保</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <Box />
              </el-icon>
              <span>试卷管理</span>
            </template>
            <el-menu-item index="/admin/exam">试卷列表</el-menu-item>
            <el-menu-item index="/admin/slot">试卷发布</el-menu-item>
            <el-menu-item index="/admin/response">答卷管理</el-menu-item>
          </el-sub-menu>

        </el-menu>

      </el-scrollbar>


    </el-aside>
    <el-container>

      <el-header>

        <el-form inline size="default">
          <el-form-item>
            <el-button :icon="Fold" @click="isCollapse = !isCollapse" />
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="keyword" placeholder="请搜索" :suffix-icon="Search" />
          </el-form-item>
        </el-form>

        <div class="right-menu">

          <el-menu router mode="horizontal" default-active="/admin" :ellipsis="false">
            <el-menu-item index="/admin">
              管理首页
            </el-menu-item>
            <!-- <el-menu-item index="/admin/help">
              帮助文档
            </el-menu-item> -->

            <!-- <el-dropdown trigger="click">
              <el-menu-item style="height:100%;">
                <el-badge :show-zero="false" :value="countUnreaded" :offset="[4, 15]">
                  <span>系统通知</span>
                </el-badge>
              </el-menu-item>

              <template #dropdown>
                <el-tabs v-model="noticeType" class="my-tabs" stretch>
                  <el-tab-pane :label="`消息(${filterNotice('msg').length})`" name="msg">

                    <p v-if="filterNotice('msg').length === 0" class="nodata">暂无消息数据</p>

                    <template v-else>

                      <el-scrollbar height="200px">
                        <div class="notice-list">
                          <div :class="['notice-list-item', { readed: item.readed }]"
                            v-for="item in filterNotice('msg')" :key="item.id">
                            <el-avatar :size="36" :src="item.avatar" />
                            <p>
                              <b>{{ item.name }}</b>的私信 <br>
                              {{ item.content }} <br>
                              <small>{{ item.createTime }}</small>
                            </p>
                          </div>
                        </div>
                      </el-scrollbar>

                      <el-row justify="space-around" align="middle" style="margin-top: 20px;">
                        <el-button type="primary" link @click="setAllReaded('msg')">全部已读</el-button>
                        <el-divider direction="vertical" />
                        <el-link type="primary" href="/admin">查看更多</el-link>
                        <el-divider direction="vertical" />
                        <el-button type="primary" @click="clearNotice('msg')" link>清空</el-button>
                      </el-row>

                    </template>

                  </el-tab-pane>
                  <el-tab-pane :label="`通知(${filterNotice('notice').length})`" name="notice">
                    <p v-if="filterNotice('notice').length === 0" class="nodata">暂无通知数据</p>

                    <template v-else>
                      <el-scrollbar height="200px">
                        <div class="notice-list">
                          <div :class="['notice-list-item', { readed: item.readed }]"
                            v-for="item in filterNotice('notice')" :key="item.id">
                            <el-avatar :size="36" :src="item.avatar" />
                            <p>
                              <b>{{ item.name }}</b>的通知<br>
                              {{ item.content }} <br>
                              <small>{{ item.createTime }}</small>
                            </p>
                          </div>
                        </div>
                      </el-scrollbar>

                      <el-row justify="space-around" align="middle" style="margin-top: 20px;">
                        <el-button type="primary" link @click="setAllReaded('notice')">全部已读</el-button>
                        <el-divider direction="vertical" />
                        <el-link type="primary" href="/admin">查看更多</el-link>
                        <el-divider direction="vertical" />
                        <el-button type="primary" link @click="clearNotice('notice')">清空</el-button>
                      </el-row>

                    </template>

                  </el-tab-pane>
                  <el-tab-pane :label="`代办(${filterNotice('todo').length})`" name="todo">
                    <p v-if="filterNotice('todo').length === 0" class="nodata">暂无通知数据</p>

                    <template v-else>
                      <el-scrollbar height="200px">
                        <div class="notice-list">
                          <div :class="['notice-list-item', { readed: item.readed }]"
                            v-for="item in filterNotice('todo')" :key="item.id">
                            <el-avatar :size="36" :src="item.avatar" />
                            <p>
                              <b>{{ item.name }}</b>的代办<br>
                              {{ item.content }} <br>
                              <small>{{ item.createTime }}</small>
                            </p>
                          </div>
                        </div>
                      </el-scrollbar>

                      <el-row justify="space-around" align="middle" style="margin-top: 20px;">
                        <el-button type="primary" link @click="setAllReaded('todo')">全部已读</el-button>
                        <el-divider direction="vertical" />
                        <el-link type="primary" href="#/admin/notice">查看更多</el-link>
                        <el-divider direction="vertical" />
                        <el-button type="primary" link @click="clearNotice('todo')">清空</el-button>
                      </el-row>

                    </template>

                  </el-tab-pane>
                </el-tabs>

              </template>
            </el-dropdown> -->

          </el-menu>

          <el-dropdown trigger="click" @command="onCommand">
            <p class="el-dropdown-link">
              <el-avatar shape="square" :size="36" :src="userStore.avatar || ''" style="image-rendering: pixelated;" />
              <span>{{ userStore.username }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </p>
            <template #dropdown>
              <el-dropdown-menu style="width: 120px;">
                <el-dropdown-item command="/space" :icon="User">个人信息</el-dropdown-item>
                <el-dropdown-item command="/admin" :icon="Setting">系统设置</el-dropdown-item>
                <el-dropdown-item command="/admin" :icon="Bell">系统通知</el-dropdown-item>
                <el-dropdown-item command="/admin" :icon="Lock">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton" divided>安全退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

        </div>

      </el-header>

      <el-scrollbar style="height: calc(100vh - 60px);">
        <el-main><router-view /></el-main>
      </el-scrollbar>

    </el-container>

  </el-container>
</template>

<style>
.el-main {
  overflow: visible;
}

/* 1. 菜单展开和伸缩时（迷你菜单）的样式 */
.my-menu {
  border-right: none;
  background-color: transparent;

  .el-sub-menu__title {
    color: rgba(255, 255, 255, .8);

    &:hover {
      color: #5268BC;
      background-color: #172853;
    }
  }
}

/* 2. 菜单展开时的样式 */
/* 104行代码的意思 没有收起来时的状态的 */
.my-menu:not(.el-menu--collapse) {
  width: 220px;

  .el-menu-item {
    color: rgba(255, 255, 255, .8);
  }

  .el-menu {
    background-color: transparent;
  }

  .el-sub-menu__title,
  .el-menu-item {

    &:hover,
    &.is-active {
      color: #5268BC;
      background-color: #172853;
    }
  }
}
</style>

<style scoped>
.my-tabs {
  padding: 20px;
  width: 300px;
}

.el-aside {
  background-color: #28365c;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    background-color: #5768b7;

    span {
      color: rgba(255, 255, 255, .9);
      font-size: 16px;
      margin-left: 8px;
    }
  }


}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .08);
  z-index: 999;

  .el-form--inline .el-form-item {
    margin-right: 15px;
    margin-bottom: 0;
  }

  .el-menu--horizontal.el-menu {
    border-bottom: none;
  }

  .right-menu {
    display: flex;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      cursor: pointer;
      outline: none;
      margin-left: 10px;

      span {
        margin-left: 8px;
      }
    }

  }
}

/* 系统通知样式部分 */
.nodata {
  line-height: 100px;
  text-align: center;
}

.notice-list {

  .notice-list-item {

    /* 已读状态 */
    /* & 表示notice-list-item和readed是同级关系，没有&就是父和后代的关系 */
    &.readed {
      opacity: .4;
      user-select: none;
    }

    display: flex;
    padding-bottom: 5px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;

    p {
      margin-left: 12px;
    }
  }
}
</style>