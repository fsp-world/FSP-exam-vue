# Changelog

## [0.11.6] (Developing)

### Features

- 添加浏览器版本检测功能，不符合要求的浏览器会提示切换浏览器

### Bug Fixes

- 在线统计页面日期显示问题 (#10)
- 修复错误页面样式问题

## [0.11.5] (2026-07-06)

### Features

- 为首页添加动画
- 添加最多只能创建10个插槽的限制
- 添加题目校验：
  - 单选题必须有一个正确选项
  - 多选题至少两个正确选项
- 添加错误页面（4xx，5xx 响应自动跳转）

### Refactor

- 为管理页面新建插槽添加模态框，代替原生的 prompt 功能
- 使用 `useTemplateRef` (Vue 3.5+) 重构原来的模板引用
- 重构问卷相关代码

### Bug Fixes

- 限制在线统计的查询范围为开服日期到当天，如果未配置开服日期，则限制为一年前
- 修复每次打开服务器配置项都会清空配置的 `desc` 的问题
- 修复移动端在线列表页面的显示问题
- 修复管理页面用户注册时间显示异常的问题
- 修复管理页面不能查看问卷详情的问题
- 修复题目图片不能正确显示的问题

### Chore

- 移除依赖：`@element-plus/icons-vue`

## [0.11.4] (2026-06-29)

### Features

- 新增管理后台仪表盘页面，提供系统运行数据概览
  - 顶部概览卡片：已注册用户数、玩家白名单数量
  - 统计指标卡片：白名单拦截次数、封禁数、白名单封禁数、未审核答卷、待通过担保、试卷总数、题目总数、投影总数
  - 在线玩家列表：实时展示在线玩家名称与所在服务器，含空状态提示
- 新增 `/dashboard/usersInfo` 与 `/dashboard/sysInfo` API 接口封装
- 新增在线人数统计页面
- 新增用户设置页面
  - 修改用户名功能
  - 切换背景图的功能，提供多种预设和自定义背景图功能
- 答卷新增超时状态

### Refactor

- 将管理后台页面全面迁移至 TailwindCSS
  - 重构 Admin 主页面、Dashboard、Exam、User、Whitelist、Response、ResponseDetail、EditExam、EditQuestion、Slot、GuaranteeMgmt、SetSurveyMetaData、Config、BaseTable 等组件
  - 移除旧的 NewAdmin.vue 页面

### Chore

- 将 CSS 框架从 Element-plus 迁移为 TailwindCSS (#6)
- 移除 `main.js` 中对 Element-plus 的全局引入

### Bug Fixes

- 修复了开始考试之后, 更改 URL 地址可以访问其他问卷的问题 (#5)

## [0.11.3] (2026-06-10)

### Bug Fixes

- 修复了不能考试的问题
- 优化了一些样式

## [0.11.2] (2026-06-09)

### Features

- 添加 GitHub action 的 deploy.yml，以实现自动部署 master 分支的代码
- 为个人中心页面添加动画效果
- 添加移动端退出登录按钮

### Bug Fixes

- 修复玩家入服期数的计算问题
- 修复管理员修改用户注册时间时，未格式化时间就发送给后端的问题
- 优化样式

## [0.11.1] (2026-06-06)

### Bug Fixes

- 修复若干问题
- 优化样式

## [0.11.0] (2026-06-05)

这个版本主要围绕“资源中心”功能展开

- 此版本需要搭配 fsp-exam-flask v0.2.0 及以上版本使用

### Features

- 添加多个 MC 主题的组件
  - MCSegmentedControl：多选一组件，提供一排按钮，只能同时选中一个
  - StrippedBirchLogBackground：草方块 + 去皮白桦木样式背景
  - MCDialog：由于原生 `<dialog>` 标签在层级管理上存在限制，容易覆盖 OpenAlert 等全局弹窗组件，因此我们开发了 MCDialog。该组件在提供近似原生模态框交互体验的同时，解决了层级冲突问题。它内置了多种预设主题样式，并实现了严格的焦点捕获（Focus Trap）机制，确保用户在模态框激活时无法通过 Tab 键切换至外部元素，从而提升了无障碍访问体验。
  - MCNameTag：命名牌样式的标签
- 新增 '资源中心' 页面，功能如下：
  - 上传、编辑、删除投影
  - 搜索、筛选、下载投影
  - 最大支持上传 500KB 的投影文件
- 为网站配置项添加'描述'字段
- 个人中心添加查看白名单玩家信任链的功能

### Refactor

- MCButton & MCRouterLink：重构以根据不同的按钮长度来动态生成背景图片
- PrepareForExam：使用 MCSegmented 组件重构部分功能
- Auth：使用 MCDialog 组件重构部分功能

### Chore

- 将编译目标版本从 ES6 升级到 ES2020，以获取更好的性能
- 由于兼容性问题，降级 pinia-plugin-persistedstate 插件到 `pinia-plugin-persistedstate@3` 版本

### Bug Fixes

- 修复若干问题
