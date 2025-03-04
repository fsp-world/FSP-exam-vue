<script setup></script>

<template>
  <div class="bg">
    <div class="container">
      <div class="top-nav">
        <ul>
          <li>
            <RouterLink to="/" class="router-link">返回首页</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/user" class="router-link">用户管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/whitelist" class="router-link">白名单管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/exam" class="router-link">问卷管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/guara" class="router-link">担保管理</RouterLink>
          </li>
        </ul>
      </div>
      <div class="main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background-image: url(../assets/images/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100vw;
}
.container {
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.493);
  height: 100vh;
}

@media (max-width: 1200px) {
  .container {
    width: 800px;
  }
}

ul {
  list-style: none;
  padding: 0;
}

.router-link {
  padding: 10px 16px;
  background-color: #00ffff2b;
  border: 1px solid #69ffff57;
  border-radius: 8px;
}

.router-link:hover {
  background-color: #6effff7f;
}

.router-link,
.router-link:visited {
  color: white;
}

.top-nav {
  height: 80px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-nav ul {
  display: flex;
  justify-content: center;
}

.top-nav ul li {
  display: block;
}

.top-nav a {
  margin: 0 14px;
  padding: 10px 14px;
}

.main {
  flex-grow: 1;
  min-height: 500px;
}
</style>
