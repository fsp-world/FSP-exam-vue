<script setup lang="ts">
defineEmits(['click']);
</script>

<template>
  <button
    class="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition-colors select-none hover:bg-gray-100 hover:text-gray-600"
    @click="$emit('click')"
  >
    &times;
  </button>
</template>
