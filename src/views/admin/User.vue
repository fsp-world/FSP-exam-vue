<script setup>
import { getUsers } from '@/apis/admin'
import { ref } from 'vue';

const data = ref({})

getUsers().then(res => {
    data.value = res.data
})

</script>

<template>
    <p>用户管理</p>
    <table>
        <thead>
            <tr>
                <td>#</td>
                <td>头像</td>
                <td>用户名</td>
                <td>用户 QQ</td>
                <td>用户角色</td>
                <td>注册时间</td>
                <td>账号状态</td>
                <td>操作</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in data.list" :key="item.id">
                <td>{{ item.id }}</td>
                <td><img :src="item.avatar" alt=""></td>
                <td>{{ item.username }}</td>
                <td>{{ item.userQQ }}</td>
                <td>{{ item.role }}</td>
                <td>{{ item.addtime }}</td>
                <td>{{ item.status }}</td>
                <td>
                    <button>修改</button>
                    <button>封禁</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>