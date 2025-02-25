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
    <Teleport to="body">
        <Dialog></Dialog>
    </Teleport>
    <RouterView />
</template>

<style scoped></style>
