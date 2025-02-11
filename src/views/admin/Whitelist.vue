<script setup>
import { onMounted, ref } from "vue";
import { getWhitelist } from '@/apis/admin'

const wlData = ref({})

onMounted(() => {
    getWhitelist().then(res => {
        console.log(res.data)
        wlData.value = res.data
    })
})
</script>

<template>
    <p>白名单管理</p>
    <table>
        <tbody>
            <tr v-for="(item, index) of wlData.list" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.uuid }}</td>
            </tr>
        </tbody>
    </table>
</template>