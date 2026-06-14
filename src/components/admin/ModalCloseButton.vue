<script setup>
defineEmits(['click']);
</script>

<template>
  <button class="absolute right-3 top-3 w-9 h-9 flex items-center justify-center text-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10 select-none" @click="$emit('click')">&times;</button>
</template>
