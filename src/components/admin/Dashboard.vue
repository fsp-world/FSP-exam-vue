<script setup lang="ts">

</script>

<template>
  <el-row :justify="'center'">
    <el-col :lg="16">
      <el-row :gutter="12">
        <el-col>
          <el-row :gutter="20" class="ts-row">
            <el-col :span="12" :xs="24">
              <div class="box" style="height:200px;">
                <span class="box-title">已注册用户数：</span>
                <span class="box-data">{{ 0 }}</span>
              </div>
            </el-col>
            <el-col :span="12" :xs="24">
              <div class="box" style="height:200px;">
                <span class="box-title">玩家账户数：</span>
                <span class="box-data">{{ 0 }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <div class="l-box">封禁数：0</div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <div class="l-box">未审核答卷：0</div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <div class="l-box">待通过担保：0</div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <div class="l-box">题目总数：0</div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <div class="l-box">试卷总数：0</div>
            </el-col>
            <el-col :xl="4" :lg="6" :md="8" :sm="12" :xs="24">
              <div class="l-box">我是占位</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style>
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18px;
  color: #fff;
  border-radius: 4px;
  background-color: var(--love-color);

  .box-title {
    font-size: 1.6em;
    display: block;
    margin-bottom: 10px;
  }

  .box-data {
    font-size: 8em;
    display: block;
    text-align: center;
  }
}

.l-box {
  background-color: var(--love-color);
  padding: 12px;
  border-radius: 4px;
}

.ep-bg-purple {
  background: #d3dce6;
}

@media screen and (max-width: 768px) {
  .ts-row {
    margin-bottom: 20px;
  }
}

.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}

.el-col:last-child {
  margin-bottom: 0;
}

.el-col:only-child {
  margin-bottom: 0;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
