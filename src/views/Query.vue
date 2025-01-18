<script setup>
import { RouterLink } from 'vue-router'
import GuaranteeResult from "../components/GuaranteeResult.vue"
import ExamList from "../components/ExamList.vue"
import ShowScore from "../components/ShowScore.vue"
const warnCard = ref({
    type: "",
    display: false,
    text: "",
    opacity: 1,
    imgUrl: "",
});
const props = defineProps({
    page: String
})

const resultPage = ref(props.page);
</script>

<template>
    <div class="view-result">
        <div class="bg"></div>
        <div class="content">
            <div class="title">
                <p>查询结果</p>
            </div>
            <div class="main">
                <div class="get-info">
                    <input class="minecraft-input" type="text" placeholder="您的游戏昵称"
                        :class="{ 'input-red-color': warnCard.display }" />
                    <div>
                        <button type="button" class="minecraft-button button" @click="resultPage = 'guaranteeResult'">
                            担保查询
                        </button>
                        <button type="button" class="minecraft-button button" @click="resultPage = 'examList'">
                            考试查询
                        </button>
                    </div>
                </div>
                <GuaranteeResult v-if="resultPage === 'guaranteeResult'"></GuaranteeResult>
                <ExamList v-if="resultPage === 'examList'">
                    <button type="button" class="minecraft-button button" @click="resultPage = 'showScore'">
                        成绩查询
                    </button>
                </ExamList>
                <ShowScore v-if="resultPage === 'showScore'"></ShowScore>
            </div>
            <div class="end">
                <button type="button" class="minecraft-button button">
                    <RouterLink to="/">返回</RouterLink>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>