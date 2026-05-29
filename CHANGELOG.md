# Changelog


<!-- ## [0.11.0] (2026-03-11) -->
## [0.11.0] (Developing)
这个版本主要围绕“资源中心”功能展开

### Features

* 添加多个 MC 主题的组件
  * MCSegmentedControl：多选一组件，提供一排按钮，只能同时选中一个
  * StrippedBirchLogBackground：草方块 + 去皮白桦木样式背景
  * MCDialog：由于默认的模态框标签<dialog>会覆盖 OpenAlert 组件，所以开发了此组件，提供多种样式预设，并限制聚焦元素范围，提供近似原生模态框的能力
* 新增 '资源中心' 页面，功能如下：
  * 根据类型获取投影列表
  * 上传投影
* 为网站配置项添加'描述'字段

### Refactor

* MCButton & MCRouterLink：重构以根据不同的按钮长度来动态生成背景图片
* PrepareForExam：使用 MCSegmented 组件重构部分功能

### Chore

* 将编译目标版本从 ES6 升级到 ES2020，以获取更好的性能
* 由于兼容性问题，降级 pinia-plugin-persistedstate 插件到  `pinia-plugin-persistedstate@3` 版本


### Bug Fixes

* 修复若干问题
