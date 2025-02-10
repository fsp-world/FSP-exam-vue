<script setup>
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import { RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
    <div class="login-container">
        <div class="tabs">
            <span :class="{ active: route.name === 'Login' }">
                <RouterLink to="/auth/login">登录</RouterLink>
            </span>
            <span :class="{ active: route.name === 'Register' }">
                <RouterLink to="/auth/register">注册</RouterLink>
            </span>
        </div>
        <RouterView />
        <!-- <Transition name="fade" mode="out-in"></Transition> -->
        <RouterLink to="/">返回主页</RouterLink>
    </div>
</template>

<style>
a:visited {
    color: inherit;
}
.login-container {
    width: 400px;
    margin: 8% auto 0;
    padding: 30px 40px;
    border: 1px solid #ccc;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
    box-sizing: border-box;
    transition: height .3s ease-in-out;
}

.tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 400px;
    height: 60px;
    position: absolute;
    top: 0px;
    left: -1px;
    transform: translate(0, -100%);
    z-index: 2;
    background: white;
}

.tabs span {
    background: rgb(240, 240, 240);
    cursor: pointer;
    color: #333;
    font-size: 20px;
    width: 50%;
    line-height: 60px;
    text-align: center;
    border: 1px solid transparent;
    border-bottom: 1px solid #ccc;
    border-radius: 4px 4px 0 0;
}

.tabs span.active {
    background: white;
    border: 1px solid #ccc;
    border-bottom: 1px solid white;
}

/* Transition 动画 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>