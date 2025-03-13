<script setup>
const { questions } = defineProps({
  questions: Array,
});
</script>

<template>
  <div class="map">
    <ul class="y-scroll">
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
  transition: transform 0.35s ease-in-out;
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
  ul {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 5px;
    margin-right: 10px;
  }
  li {
    --wid: 34px;
    --hei: 36px;
    width: var(--wid);
    height: var(--hei);
    a {
      font-size: 25px;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: var(--hei);
      color: #000;
      -webkit-user-drag: none;
      user-select: none;
    }

    a:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}

@media screen and (max-width: 1400px) {
  .map {
    transform: translate(-90%, -50%);
  }
}
/*滚动条样式*/
.y-scroll::-webkit-scrollbar {
  width: 5px;
}

.y-scroll::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.y-scroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.1);
}

.y-scroll::-webkit-scrollbar-corner {
  border-radius: 5px;
}
</style>
