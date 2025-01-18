<script setup>
const showExamResult = ref({
    id: 0,
    type: "",
    time: "",
    status: "",
    showScore: 0,
    score: 0,
    state: 0,
    stateDisplay: false,
});
</script>

<template>
    <div class="show-score">
        <div class="score">
            <p>您的分数是{{ showExamResult.showScore }}分</p>

            <div class="score-line">
                <div class="end"></div>
                <div :style="styleVariables" class="front"></div>
                <div v-if="showExamResult.state === 1 && showExamResult.display" class="pass"></div>
                <div v-if="showExamResult.state === 0 && showExamResult.display" class="no-pass"></div>
            </div>
            <div class="text">
                <p v-if="showExamResult.state === 0 && showExamResult.display">
                    非常遗憾，您未通过测试
                </p>
                <div v-if="showExamResult.state === 1 && showExamResult.display">
                    <p>
                        恭喜您通过了测试！系统已自动将您添加至白名单。请下载
                        minecraft java edition 1.21 fabric
                        并安装 xaeroMap Mod 后加入服务器
                    </p>
                    <ul class="server-url-list">
                        <li>服务器地址列表</li>
                        <li>xxx.yyy.zzz</li>
                        <li>speed.yyy.zzz</li>
                        <li>jiasu.yyy.zzz</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>