<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const store = useUserStore()

const { isLogin, username, isAdmin, avatar } = storeToRefs(store)


onMounted(() => {
    store.checkLogin()
})

const logout = () => {
    store.logout()
}
</script>

<template>
    <div class="choice-method-page">
        <img class="logo" src="../assets/images/logo.png" />
        <div class="menu">
            <button class="minecraft-button choice-button" @click="page = 'guarantee'">
                <RouterLink to="/guarantee">熟人担保</RouterLink>
            </button>
            <button class="minecraft-button choice-button" @click="page = 'prepareForTheExam'">
                <RouterLink to="/prepareForTheExam">参加考试</RouterLink>
            </button>
            <div class="sub-menu">
                <button class="minecraft-button choice-button">
                    <a href="http://www.fsp.ink">返回主页</a>
                </button>
                <button @click="page = 'viewResult'" class="minecraft-button choice-button">
                    查询结果
                </button>
                <button class="minecraft-button choice-button avatar">
                    <RouterLink v-show="!isLogin" to="/auth">
                        <img class="avatar-img" :src="avatar" alt="" width="100%">
                        <span class="avatat-hover">未登录!</span>
                    </RouterLink>
                    <div v-show="isLogin">
                        <img class="avatar-img" :src="avatar" alt="" width="100%">
                        <span class="avatat-hover">{{ username }}</span>
                        <button class="avatat-hover out" @click="logout">退出登录</button>
                    </div>
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

.avatar:hover .avatat-hover {
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
.avatat-hover.right {
    top: 100%;
    transform: translateY(100%);
}
</style>