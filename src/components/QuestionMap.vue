<script setup>
const { questions } = defineProps({
    questions: Array
})
</script>

<template>
    <div class="map">
        <ul>
            <li v-for="(question, questionIndex) in questions" :key="questionIndex">
                <a :href="'#' + 'question' + (questionIndex + 1)">{{ questionIndex + 1 }}</a>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.map:hover {
    transform: translate(0, -50%);
}

.map {
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    transition: transform .35s ease-in-out;
    position: fixed;
    --size: 200px;
    width: var(--size);
    height: var(--size);
    background-image: url(../assets/images/rainbow_pixel_gui/map.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    image-rendering: pixelated;
    padding: 20px;
    z-index: 99;

}

ul {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;


}

li {
    width: 36px;
    height: 36px;


}

a {
    font-size: 25px;
    width: 36px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    color: #000;
    -webkit-user-drag: none;
    user-select: none;
}

a:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

@media screen and (max-width: 1350px) {
    .map {
        transform: translate(-90%, -50%);
    }
}
</style>