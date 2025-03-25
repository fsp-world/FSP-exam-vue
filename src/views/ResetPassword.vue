<template>
    <div class="reset-password-form">
        <h2 style="text-align: center;">请输入新密码</h2>
        <input class="input" type="password" v-model.trim="password">
        <div style="display: flex; justify-content: right;"><MCButton class="btn">修改</MCButton></div>
    </div>
</template>

<script setup>
import MCButton from '@/components/MCButton.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

console.log(route.query.token);

const password = ref('')
</script>


<style scoped>
.reset-password-form {
    background-color: bisque;
    padding: 20px;
    border-radius: 14px;
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    .input {
        padding: 10px 20px;
        border-radius: 10px;
        outline: none;
    }
    .btn {
        margin-top: 20px;
        padding: 10px 20px;
    }
}
</style>
