<script setup></script>

<template>
  <div class="bg">
    <div class="container">
      <div class="nav">
        <ul class="menu">
          <li>
            <RouterLink to="/admin/user" class="router-link">用户管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/whitelist" class="router-link">白名管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/exam" class="router-link">问卷管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/guarantee_mgmt" class="router-link">担保管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/response" class="router-link">答卷审核</RouterLink>
          </li>
          <li>
            <RouterLink to="/admin/slot" class="router-link">问卷发布</RouterLink>
          </li>
          <li>
            <RouterLink to="/" class="router-link">返回首页</RouterLink>
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
  background-image: var(--bg-img);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.493);
}
.container .nav {
  flex: 1;
  max-width: 280px;
  .menu {
    width: 100%;
    height: calc(100% - 20px);
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    flex-wrap: wrap;
  }
  .menu li {
    width: 100%;
  }
  .menu li:last-child {
    margin-top: auto;
  }
  .menu li:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .menu li a {
    color: aqua;
    font-size: 30px;
    max-width: 200px;
    text-align: center;
    padding: 10px;
    margin: 0 auto;
  }
}
.container .main {
  flex: 3;
  background-color: white;
  position: relative;
  padding: 10px;
}

@media (max-width: 1200px) {
  .nav {
    top: 50%;
    left: 0;
    transform: translate(-90%, -50%);
    transition: transform 0.35s ease-in-out;
    background-color: #eee;
    position: fixed;
    width: 170px;
    height: 100%;
    padding: 20px;
    z-index: 90;
  }
  .nav::after {
    display: block;
    content: '>';
    width: 15px;
    height: 55vh;
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .nav:hover {
    transform: translate(0, -50%);
  }
  .main {
    margin-left: 20px;
  }
}
</style>
