<script setup>

</script>

<template>
    <div class="login-box">
        <form>
            <h1>像素仙缘问卷后台</h1>
            <p>
                <label for="username">用户名：</label>
                <input type="text" name="username" id="username">
            </p>
            <p>
                <label for="password">密码：</label>
                <input type="password" name="password" id="password">
            </p>
            <p class="btns">
                <button class="btn" type="button">登录</button>
            </p>
        </form>
    </div>
</template>

<style scoped>
.login-box {
    width: 300px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8%;
    border-radius: 4px;
    box-shadow: 1px 1px 8px 8px rgba(0, 0, 0, .06);
}

.login-box label {
    display: block;
}

.login-box input {
    width: 100%;
    padding: 6px 8px;
    margin: 10px 0;
    outline: none;
    border-radius: 4px;
    border: 1px #ccc solid;
}

.login-box .btns {
    text-align: right;
}

.login-box .btns .btn {
    border: 0;
    border-radius: 4px;
    padding: 6px 8px;
}
</style>