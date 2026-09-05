# Changelog

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

> **用法**
>
> - 日常开发：把改动记录在顶部 `[Unreleased]` 区块，按下列变更类型归类。
> - 发布新版本：新建 `## [版本号] - YYYY-MM-DD` 区块（版本号遵循语义化版本，日期用 ISO 8601），把 `[Unreleased]` 中的内容整体移入。
> - 版本按时间倒序排列（新版本在前、旧版本在后）。
>
> **变更类型**
>
> - `Added`：新添加的功能
> - `Changed`：对现有功能的变更（含重构、样式及构建/工程配置调整）
> - `Deprecated`：即将移除、不建议继续使用的功能
> - `Removed`：已移除的功能或依赖
> - `Fixed`：Bug 修复
> - `Security`：安全性改进

## [Unreleased]

### Added

- 当客户端环境不满足 ES2020 时，显示全屏「浏览器版本过低」提示
- 在 `package.json` 中新增 `ci` 脚本，可在本地依次执行 lint、格式检查、类型检查和生产构建，模拟 CI 流程

### Changed

- 抽取共享登出流程，统一首页和个人空间的退出提示及返回首页行为
- 将全局提示容器从 `Alert` 重命名为 `AlertContainer`，将单条提示组件从 `AlertCard` 重命名为 `AlertItem`
- 重构管理员的系统配置页面，拆分为“系统设置”和“高级设置”两个选项，系统设置内只能编辑一些常用的，低危险性的配置，同时提供了比高级设置更友好的交互方式，高级设置为原“系统配置”
- 管理员页面的按钮组件采用新的 `AdminButton` 组件
- 设置生产构建目标为 ES2020，开发期可使用最新的 JavaScript 特性，构建产物统一降级到 ES2020
- 通过 Babel preset-env（`useBuiltIns: 'usage'`）按需注入 core-js polyfill，确保应用在 ES2020 环境下完全可用
- 新增 `type-check:es2020` 体检脚本及 `tsconfig.es2020.json`，用于检查源码是否使用了 ES2020 之后的内建 API

### Fixed

- 修复头像获取不到时显示 `alt` 文本的问题，使用本地 Steve 头像作为默认兜底

### Removed

- 解除对微信/QQ/UC 内置浏览器的封锁：内置浏览器不再被限制访问

### Security

- 调整密码复杂性校验规则：注册密码至少包含一个字母和一个数字，长度为 8-16 个字符；登录不再进行密码复杂性校验
- 将密码复杂性提示文案集中到 `REGISTER_MESSAGES` 中，并重命名密码校验函数以明确其用途

## [0.11.7] - 2026-08-22

### Added

- 答卷管理支持填写拒绝理由：拒绝答卷时必须填写理由，理由将随邮件发送给用户
- 考试查询页面和管理员阅卷页面展示被拒绝答卷的拒绝理由
- 管理员-系统配置页面，对于布尔值类型的配置，添加保护措施，使用下拉框收窄用户的输入

### Changed

- 将包管理器从 npm 迁移至 pnpm，新增 `pnpm-lock.yaml` 锁文件并移除 `package-lock.json`
- 更新 GitHub Actions CI/部署流程，改用 pnpm 安装依赖与执行脚本，并启用 pnpm 依赖缓存；pnpm 版本统一由 `package.json` 的 `packageManager` 字段声明，避免 workflow 与锁文件版本冲突
- 适配 pnpm 解析到的 axios 新版本类型定义，修正投影详情下载中的 `content-type` 类型判断

### Fixed

- 允许题目分数批改为 0 分

## [0.11.6] - 2026-08-15

### Added

- 添加浏览器版本检测功能，不符合要求的浏览器会提示切换浏览器

### Changed

- 将日期库从 Moment.js 迁移至 Day.js，大幅减小打包体积
- 引入 oxlint、prettier 与 vue-tsc 代码质量工具，新增 `lint` / `format` / `format:check` / `type-check` 脚本，并统一全项目代码格式
- 新增 GitHub Actions CI 流程：master/main/dev 分支推送及 Pull Request 时执行 lint、格式检查、类型检查与构建
- 部署流程（deploy）改为仅在 CI 通过后自动触发，并保留手动触发入口
- 将登录、注册、找回密码及退出登录等提示文案统一抽取到 `src/constants/messages.ts` 常量中集中管理

### Fixed

- 修正登录相关文案中「登陆」错别字为「登录」
- 修复找回密码页面在用户名或 QQ 为空时仍会发送请求的问题
- 修复资源中心页面 `img` 标签错误闭合导致的语法问题
- 在线统计页面日期显示问题 (#10)
- 修复错误页面样式问题

## [0.11.5] - 2026-07-06

### Added

- 为首页添加动画
- 添加最多只能创建10个插槽的限制
- 添加题目校验：
  - 单选题必须有一个正确选项
  - 多选题至少两个正确选项
- 添加错误页面（4xx，5xx 响应自动跳转）

### Changed

- 为管理页面新建插槽添加模态框，代替原生的 prompt 功能
- 使用 `useTemplateRef` (Vue 3.5+) 重构原来的模板引用
- 重构问卷相关代码

### Removed

- 移除依赖：`@element-plus/icons-vue`

### Fixed

- 限制在线统计的查询范围为开服日期到当天，如果未配置开服日期，则限制为一年前
- 修复每次打开服务器配置项都会清空配置的 `desc` 的问题
- 修复移动端在线列表页面的显示问题
- 修复管理页面用户注册时间显示异常的问题
- 修复管理页面不能查看问卷详情的问题
- 修复题目图片不能正确显示的问题

## [0.11.4] - 2026-06-29

### Added

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

### Changed

- 将管理后台页面全面迁移至 TailwindCSS
  - 重构 Admin 主页面、Dashboard、Exam、User、Whitelist、Response、ResponseDetail、EditExam、EditQuestion、Slot、GuaranteeMgmt、SetSurveyMetaData、Config、BaseTable 等组件
- 将 CSS 框架从 Element-plus 迁移为 TailwindCSS (#6)

### Removed

- 移除旧的 NewAdmin.vue 页面
- 移除 `main.js` 中对 Element-plus 的全局引入

### Fixed

- 修复了开始考试之后, 更改 URL 地址可以访问其他问卷的问题 (#5)

## [0.11.3] - 2026-06-10

### Changed

- 优化了一些样式

### Fixed

- 修复了不能考试的问题

## [0.11.2] - 2026-06-09

### Added

- 添加 GitHub action 的 deploy.yml，以实现自动部署 master 分支的代码
- 为个人中心页面添加动画效果
- 添加移动端退出登录按钮

### Changed

- 优化样式

### Fixed

- 修复玩家入服期数的计算问题
- 修复管理员修改用户注册时间时，未格式化时间就发送给后端的问题

## [0.11.1] - 2026-06-06

### Changed

- 优化样式

### Fixed

- 修复若干问题

## [0.11.0] - 2026-06-05

这个版本主要围绕“资源中心”功能展开

- 此版本需要搭配 fsp-exam-flask v0.2.0 及以上版本使用

### Added

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

### Changed

- MCButton & MCRouterLink：重构以根据不同的按钮长度来动态生成背景图片
- PrepareForExam：使用 MCSegmented 组件重构部分功能
- Auth：使用 MCDialog 组件重构部分功能
- 将编译目标版本从 ES6 升级到 ES2020，以获取更好的性能
- 由于兼容性问题，降级 pinia-plugin-persistedstate 插件到 `pinia-plugin-persistedstate@3` 版本

### Fixed

- 修复若干问题
