<script setup>
import { ref } from 'vue'
const guaranteeResult = ref({
    state: true,
    text: "您的担保请求已被同意，系统已自动将您添加至白名单",
});
</script>

<template>
    <div class="guarantee-result">
        <p class="text">{{ guaranteeResult.text }}</p>
        <div class="tips" v-if="guaranteeResult.state">
            <p>请下载 minecraft java edition 1.21 fabric</p>
            <p>并安装 xaeroMap Mod 后加入服务器</p>
            <ul class="server-url-list">
                <li>服务器地址列表</li>
                <li>xxx.yyy.zzz</li>
                <li>speed.yyy.zzz</li>
                <li>jiasu.yyy.zzz</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.guarantee-result {
    margin-top: 166px;
}
</style>