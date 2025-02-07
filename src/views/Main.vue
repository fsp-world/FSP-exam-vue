<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const store = useUserStore()

const logout = () => {
    store.logout()
}
</script>

<template>
    <div class="choice-method-page">
        <img class="logo" src="../assets/images/logo.png" />
        <div class="menu">
            <button class="minecraft-button choice-button">
                <RouterLink to="/guarantee">熟人担保</RouterLink>
            </button>
            <button class="minecraft-button choice-button">
                <RouterLink to="/prepareForTheExam">参加考试</RouterLink>
            </button>
            <div class="sub-menu">
                <button class="minecraft-button choice-button">
                    <a href="http://www.fsp.ink">返回主页</a>
                </button>
                <button class="minecraft-button choice-button">
                    <RouterLink to="/query">
                        查询结果
                    </RouterLink>
                </button>
                <button class="minecraft-button choice-button avatar">
                    <RouterLink v-show="!isLogin" to="/auth">
                        <img class="avatar-img" :src="avatar" alt="" width="100%">
                        <span class="avatat-hover">未登录!</span>
                    </RouterLink>
                    <RouterLink v-show="isLogin" to="/space">
                        <img class="avatar-img" :src="avatar" alt="" width="100%">
                        <span class="avatat-hover">{{ username }}</span>
                    </RouterLink>
                    <a v-show="isLogin" class="logout" @click="logout">退出登录</a>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sub-menu {
    position: relative;
}

.avatar {
    top: 0;
    right: 0;
    margin-right: -10px;
    position: absolute;
    display: block;
    width: 70px !important;
    height: 70px;
    box-sizing: border-box;
    transform: translate(100%, 0);
}

.avatar-img {}

.avatar:hover .avatat-hover,
.avatar:hover .logout {
    display: inline-block;
}

.avatat-hover {
    display: none;
    word-break: normal;
    white-space: nowrap;
    top: -4px;
    left: 50%;
    background: #cccccc8a;
    position: absolute;
    transform: translate(-50%, -100%);
}

.logout {
    display: none;
    word-break: normal;
    white-space: nowrap;
    position: absolute;
    padding: 10px 14px;
    bottom: 0;
    transform: translate(-50%, 100%);
    background: #cccccc8a;
    font-size: 20px;
}

.logout:hover {
    color: aqua;
}
</style>