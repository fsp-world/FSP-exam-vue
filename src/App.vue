<script setup>
import { RouterView } from 'vue-router'
import Dialog from "@/components/dialog/Dialog.vue"
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

onMounted(() => {
    const store = useUserStore()
    store.checkLogin()
})

</script>

<template>
    <Dialog></Dialog>
    <!-- <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    -->
    <RouterView />
</template>

<style scoped></style>
