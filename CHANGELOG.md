# Changelog


<!-- ## [0.11.0] (2026-03-11) -->
## [0.11.0] (Developing)
这个版本主要围绕“资源中心”功能展开

* 此版本需要搭配 fsp-exam-flask v0.2.0 及以上版本使用

### Features

* 添加多个 MC 主题的组件
  * MCSegmentedControl：多选一组件，提供一排按钮，只能同时选中一个
  * StrippedBirchLogBackground：草方块 + 去皮白桦木样式背景
  * MCDialog：由于原生 `<dialog>` 标签在层级管理上存在限制，容易覆盖 OpenAlert 等全局弹窗组件，因此我们开发了 MCDialog。该组件在提供近似原生模态框交互体验的同时，解决了层级冲突问题。它内置了多种预设主题样式，并实现了严格的焦点捕获（Focus Trap）机制，确保用户在模态框激活时无法通过 Tab 键切换至外部元素，从而提升了无障碍访问体验。
  * MCNameTag：命名牌样式的标签
* 新增 '资源中心' 页面，功能如下：
  * 上传、编辑，下载投影
  * 搜索、筛选投影
* 为网站配置项添加'描述'字段

### Refactor

* MCButton & MCRouterLink：重构以根据不同的按钮长度来动态生成背景图片
* PrepareForExam：使用 MCSegmented 组件重构部分功能
* Auth：使用 MCDialog 组件重构部分功能

### Chore

* 将编译目标版本从 ES6 升级到 ES2020，以获取更好的性能
* 由于兼容性问题，降级 pinia-plugin-persistedstate 插件到  `pinia-plugin-persistedstate@3` 版本


### Bug Fixes

* 修复若干问题
