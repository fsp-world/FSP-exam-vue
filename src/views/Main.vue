<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router'
import { checkLogin } from '@/apis/auth';

const userData = ref({
    login: false,
    username: '未登录',
    avatar: '',
    loadStatus: 0
})

onMounted(() => {
    checkLogin().then((res) => {
        switch (res.data.code) {
            case 0:
                userData.value.login = true
                userData.value.avatar = res.data['avatar']
                userData.value.username = res.data['username']
                userData.value.loadStatus = 1
                break
            default:
                userData.value.avatar = res.data['avatar']
                userData.value.loadStatus = 0
                console.log(userData.value);
                break
        }
    }).catch((err) => {
        console.log(err.data)
    })
})
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
                    <RouterLink :disabled="userData.login" to="/auth"><img class="avatar-img" :src="userData.avatar" alt="" width="100%"><span class="avatat-hover">{{ userData.username }}</span></RouterLink>
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

.avatar:hover > a > .avatat-hover {
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
</style>