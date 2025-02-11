<script setup>

</script>

<template>
    <div class="container">
        <div class="top-nav">
            <ul>
                <li>
                    <RouterLink to="/">返回首页</RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/user">用户管理</RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/whitelist">白名单管理</RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/exam">问卷管理</RouterLink>
                </li>
                <li>
                    <RouterLink to="/admin/guara">担保管理</RouterLink>
                </li>
            </ul>
        </div>
        <div class="main">
            <RouterView />
        </div>
    </div>
</template>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}

a, a:visited {
    color: inherit
}

.top-nav {
    height: 120px;
}

.top-nav ul {
    display: flex;
    justify-content: center;
}

.top-nav ul li {
    margin: 0 14px;
}

.top-nav a {
    padding: 10px 14px;
}

.main {
    flex-grow: 1;
    min-height: 500px;
}
</style>