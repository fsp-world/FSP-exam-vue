<script setup>

</script>

<template>
    <form>
        <h1>注册</h1>
        <p>
            <label for="username">用户名：</label>
            <input type="text" name="username" id="username">
        </p>
        <p>
            <label for="password">密码：</label>
            <input type="password" name="password" id="password">
        </p>
        <p>
            <label for="password-r">重复密码：</label>
            <input type="password" name="password-r" id="password-r">
        </p>
        <p class="btns">
            <button class="btn" type="button">注册</button>
        </p>
    </form>
</template>

<style scoped></style>