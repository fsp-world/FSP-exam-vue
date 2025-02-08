<script setup lang="ts">
import { PropType } from 'vue';
import { IdialogData } from '@/utils/dialogType'

const { card } = defineProps({
    card: {
      type: Object as PropType<IdialogData>,
      required: true,
    },
})
</script>

<template>
    <div class="card" :class="card.type">
        {{ card.title }}
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
    transition: all .3 ease-in;
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