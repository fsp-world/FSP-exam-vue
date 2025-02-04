<script setup>
import { ref } from 'vue'
import { guaranteeQuery } from '@/apis/guarantee'

const guaranteeResult = ref({
    state: true,
    text: "您的担保请求已被同意，系统已自动将您添加至白名单",
});

const applicantData = ref({})
const guaranteeData = ref({})

guaranteeQuery().then((res) => {
    applicantData.value = res.data.data.applicant
    guaranteeData.value = res.data.data.guarantee
})

</script>

<template>
    <div class="guarantee-result">
        <table>
            <caption>申请</caption>
            <thead>
                <tr>
                    <th>#</th>
                    <th>头像</th>
                    <th>名称</th>
                    <th>创建时间</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item of applicantData" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td class="avatar"><img :src="item.avatar" alt=""></td>
                    <td>{{ item.playerName }}</td>
                    <td>{{ item.createTime }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </table>
        <br>
        <hr>
        <br>
        <table>
            <caption>确认</caption>
            <thead>
                <tr>
                    <th>#</th>
                    <th>头像</th>
                    <th>名称</th>
                    <th>创建时间</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="guaranteeData.length === 0"><td colspan="999">暂无数据</td></tr>
                <tr v-for="item of guaranteeData" :key="item.id">
                    <td><i>{{ item.id }}</i></td>
                    <td class="avatar"><img :src="item.avatar" alt=""></td>
                    <td>{{ item.playerName }}</td>
                    <td>{{ item.createTime }}</td>
                    <td>{{ item.status }}</td>
                </tr>
            </tbody>
        </table>
        <!-- <p class="text">{{ guaranteeResult.text }}</p>
        <div class="tips" v-if="guaranteeResult.state">
            <p>请下载 minecraft java edition 1.21 fabric</p>
            <p>并安装 xaeroMap Mod 后加入服务器</p>
            <ul class="server-url-list">
                <li>服务器地址列表</li>
                <li>xxx.yyy.zzz</li>
                <li>speed.yyy.zzz</li>
                <li>jiasu.yyy.zzz</li>
            </ul>
        </div> -->
    </div>
</template>

<style scoped>
.guarantee-result {
    margin-top: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.guarantee-result table {
    border-collapse: collapse;
}

.guarantee-result caption {
    font-size: 30px;
}

.guarantee-result .avatar img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
}

.guarantee-result th,
.guarantee-result td {
    padding: 10px 18px;
}

.guarantee-result tr {
    border-bottom: 1px solid #ccc;
}
</style>