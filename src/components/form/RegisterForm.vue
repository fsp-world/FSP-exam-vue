<script setup>
import { ref, watch } from 'vue'
import InfoDialog from '@/components/InfoDialog.vue'
import { login, register } from '@/apis/auth'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'
import { checkPassword } from '@/utils/passwordUtil'
import '../../assets/form.css'

const registerForm = ref({
    username: '',
    userQQ: '',
    password: '',
    repassword: ''
})

const sendRegister = () => {
    openDialog('提交中')
    let timeout = delayClose(3000)
    if (registerForm.value.password === registerForm.value.repassword) {
        if (!checkPassword(registerForm.value.password)) {
            clearTimeout(timeout)
            openDialog('密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度至少为8个字符');
            timeout = delayClose(3000)
            return
        }
        register({ 'username': registerForm.value.username, 'userQQ': registerForm.value.userQQ, 'password': registerForm.value.password, 'repassword': registerForm.value.repassword })
            .then((res) => {
                if (res.data.code === 0) {
                    clearTimeout(timeout)
                    localStorage.setItem('fsp_token', res.data.token)
                    openDialog('注册成功! 即将跳转到主页')
                    delayClose(3000, () => {
                        router.push({ 'name': 'Main' })
                    })
                } else {
                    clearTimeout(timeout)
                    openDialog(res.data.desc)
                    delayClose(3000)
                }
            })
            .catch((err) => {
                clearTimeout(timeout)
                openDialog('注册错误!')
                delayClose(3000)
            })
    } else {
        clearTimeout(timeout)
        openDialog('密码不一致');
        timeout = delayClose(3000)
    }
}

</script>

<template>
    <div class="form">
        <h2>注册</h2>
        <input type="text" placeholder="用户名" v-model="registerForm.username" />
        <input type="text" placeholder="QQ" v-model="registerForm.userQQ" />
        <input type="password" placeholder="密码" v-model="registerForm.password" />
        <p>
            密码必须包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符，且长度至少为8个字符。
        </p>
        <input type="password" placeholder="确认密码" v-model="registerForm.repassword" />
        <p v-if="registerForm.repassword && registerForm.password !== registerForm.repassword"
            style="color: red; font-size: 12px;">
            两次输入的密码不一致。
        </p>
        <button @click="sendRegister">注册</button>
    </div>
</template>

<style scoped></style>