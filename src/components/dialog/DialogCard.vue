<script setup lang="ts">
import { onMounted, onUnmounted, PropType, ref } from 'vue'
import { IdialogData } from '@/utils/dialogType'
import { useDialogStore } from '@/stores/dialog'

const dialogStore = useDialogStore()
const { card } = defineProps({
    card: {
        type: Object as PropType<IdialogData>,
        required: true,
    },
})

const myclass = ref('')

let timeout: NodeJS.Timeout

onMounted(() => {
    setTimeout(() => {
        myclass.value = 'done'
    }, 300)
    timeout = setTimeout(() => {
        myclass.value = 'trans'
        close()
    }, card.age)
})

onUnmounted(() => {
    clearTimeout(timeout)
})

const close = () => {
    setTimeout(() => {
        dialogStore.closeDialog(card.title)
    }, 300)
}

</script>

<template>
    <div class="card" :class="[card.type, myclass]">
        {{ card.message }}
    </div>
</template>

<style scoped>
.card {
    width: 100%;
    height: 80px;
    margin: 16px;
    image-rendering: pixelated;
    font-size: 23px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 5px;
    transition: all .3s ease-in-out;
    position: relative;
    opacity: 0;
    left: 400px;
}

.card.done {
    left: 0;
    opacity: 1;
}

.card.trans {
    left: 400px;
    opacity: 0;
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