<template>
    <McButton @click="router.push(to)">
        <slot></slot>
    </McButton>
</template>

<script setup>
import McButton from './McButton.vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const { to } = defineProps({
    to: {
        type: String,
        required: true
    }
})
</script>