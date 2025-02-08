<script setup>
import { ref, watch } from 'vue'
import InfoDialog from '@/components/InfoDialog.vue'
import { login, register } from '@/apis/auth'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'
import { checkPassword } from '@/utils/passwordUtil'
import '../../assets/form.css'

const loginForm = ref({
    username: '',
    password: ''
});
const sendLogin = () => {
    openDialog('登陆中')
    let timeout = delayClose(3000)
    if (!checkPassword(loginForm.value.password)) {
        clearTimeout(timeout)
        openDialog('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度至少为8个字符');
        timeout = delayClose(3000)
        return
    }

    store.login({ 'username': loginForm.value.username, 'password': loginForm.value.password })
        .then((res) => {
            if (res.data.code === 0) {
                clearTimeout(timeout)
                openDialog('登录成功! 即将跳转...')
                delayClose(3000, () => {
                    // 获取目标页面路径
                    const redirect = route.query.redirect;
                    // 如果存在目标页面路径，则跳转到该页面；否则跳转到首页
                    if (redirect) {
                        router.push(redirect);
                    } else {
                        router.push({ 'name': 'Main' })
                    }
                })
            } else if (res.data.code === 1) {
                clearTimeout(timeout)
                openDialog(res.data.desc)
                delayClose(3000)
            }
        })
        .catch((err) => {
            clearTimeout(timeout)
            openDialog('登录错误!')
            delayClose(3000)
        })
}
</script>

<template>
    <div class="form">
        <h2>登录</h2>
        <input type="text" placeholder="用户名" v-model="loginForm.username" />
        <input type="password" placeholder="密码" v-model="loginForm.password" />
        <p>
            密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度至少为8个字符。
        </p>
        <button @click="sendLogin">登录</button>
    </div>
</template>

<style scoped></style>