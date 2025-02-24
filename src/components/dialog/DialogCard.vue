<script setup lang="ts">
import { onMounted, onUnmounted, PropType, ref } from 'vue'
import { IdialogData } from '@/utils/dialogType'
import { useDialogStore } from '@/stores/dialog'

const dialogStore = useDialogStore()
const { card } = defineProps({
    card: {
        type: Object as PropType<IdialogData>,
        required: true,
    }
})

let timeout: NodeJS.Timeout

onMounted(() => {
    setTimeout(() => {
    }, 300)
    timeout = setTimeout(() => {
        close()
    }, card.age)
})

onUnmounted(() => {
    clearTimeout(timeout)
})

const close = () => {
    setTimeout(() => {
        card.flag = false
        dialogStore.closeDialog()
    }, 300)
}

</script>

<template>
    <div class="card" :class="[card.type]">
        {{ card.message }}
    </div>
</template>

<style scoped>
.card {
    width: 400px;
    height: 80px;
    margin: 16px;
    image-rendering: pixelated;
    font-size: 23px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 5px;
    padding: 12px 16px;
}

.warn-card {
    color: #cbcbcb;
    background-image: url(../../assets/images/rainbow_pixel_gui/system_info.png);
}

.info-card {
    color: #313131;
    background-image: url(../../assets/images/vanilla_gui/demo_background.png);
}
</style>