<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;
    position: relative;
    min-height: 760px;
}
.view-result .get-info {
    flex-basis: .2;
}
</style>