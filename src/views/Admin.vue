<script setup></script>

<template>
  <div class="bg">
    <div class="container">
      <div class="nav">
        <ul class="menu">
          <li>
            <RouterLink to="/admin/user" class="router-link"
              >用户管理</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/admin/whitelist" class="router-link"
              >白名单管理</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/admin/exam" class="router-link"
              >问卷管理</RouterLink
            >
          </li>
          <li>
            <RouterLink to="/admin/guara" class="router-link"
              >担保管理</RouterLink
            >
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
  background-image: url(../assets/images/bg.png);
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
  .menu li a {
    color: aqua;
    font-size: 30px;
    max-width: 200px;
    text-align-last: justify;
    text-align: justify;
    padding: 10px;
    margin: 0 auto;
  }
  .menu li a:hover {
    background-color: white;
  }
}
.container .main {
  flex: 3;
  background-color: white;
}

@media (max-width: 1200px) {
  .container {
    flex-direction: column;
  }
  .container .nav {
    flex: none;
    width: 100%;
    max-width: none;
    height: 100px;
  }
  .container .nav .menu {
    width: 100%;
    padding-top: 0;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .container .nav .menu li {
    width: auto;
    height: 50%;
  }
  .container .nav .menu li:last-child {
    margin-top: 0;
  }
  .container .nav .menu li a {
    font-size: 20px;
    width: 120px;
    line-height: 50px;
    margin: 0;
  }
}

.main {
  padding: 10px;
}
</style>
