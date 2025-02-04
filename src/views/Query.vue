<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { guaranteeQuery } from '@/apis/guarantee'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

guaranteeQuery().then((res) => {
    console.log(res.data);
})

</script>

<template>
    <div class="view-result">
        <div class="bg"></div>
        <div class="content">
            <div class="title">
                <p>查询结果</p>
            </div>
            <div class="main">
                <router-view />
                <div class="get-info">
                    <!-- <input class="minecraft-input" type="text" placeholder="您的游戏昵称"
                        :class="{ 'input-red-color': warnCard.display }" /> -->
                    <div style="width: 800px;">
                        <button type="button" class="minecraft-button button"
                            @click="router.push({ 'name': 'QueryGuarantee' })">
                            担保查询
                        </button>
                        <button type="button" class="minecraft-button button"
                            @click="router.push({ 'name': 'QueryExamination' })">
                            考试查询
                        </button>
                    </div>
                </div>
                <!-- <GuaranteeResult v-if="resultPage === 'guaranteeResult'"></GuaranteeResult>
                <ExamList v-if="resultPage === 'examList'">
                    <button type="button" class="minecraft-button button" @click="resultPage = 'showScore'">
                        成绩查询
                    </button>
                </ExamList>
                <ShowScore v-if="resultPage === 'showScore'"></ShowScore> -->
            </div>
            <div class="end">
                <button type="button" class="minecraft-button button">
                    <RouterLink to="/">返回</RouterLink>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.view-result .main {
    background-color: rgba(0, 0, 0, 0.6);
    border-top: 3px solid #000;
    border-bottom: 3px solid #000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    min-height: 760px;
}
.view-result .get-info {
    flex-basis: .2;
}
</style>