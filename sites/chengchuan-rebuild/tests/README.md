# 当前测试入口与证据范围

核查日期：2026-10-20。命令按 `package.json`、脚本和 CI 配置核对；本次文档整理没有重跑游戏回归。过去通过的结果不自动适用于未来重构。

## 现有 CI 实际执行什么

在 `sites/chengchuan-rebuild/` 中执行，Node.js 22+：

| 检查 | 命令 / 条件 | 能证明 | 不能证明 |
|---|---|---|---|
| 规则测试 | `npm test` | 六个 `*domain.test.mjs` 文件的断言 | 新剧本公平或好玩；所有规则都已集中到 domain 目录 |
| 本地服务器产物 | `npm run verify:build` | 构建与对应产物检查 | Pages 不依赖 API |
| 旧十分钟开场 | 启动 `npm run dev` 后 `npm run test:thanks` | 三个浏览器套件覆盖实际发送、拒绝、补送、改口、重复与布局等 | v4 已实现或真人会主动追查 |
| Pages 构建 | `npm run build:pages` | 静态资源与已封装 domain 规则检查 | 全部历史浏览器脚本适配静态版 |
| Pages 环境回归 | 启动 `node scripts/serve-pages.mjs`；设置下述地址后 `npm run test:pages` | 子路径跳转、同组三个开场套件、第二天部分分支在无 API 环境下工作 | 从全新玩家开场完整玩到第二天并产生兴趣 |

`test:thanks` = `reply-opening.cjs`、`thanks-experiment.cjs`、`thanks-curiosity.cjs`。

`test:pages` = `pages-navigation.cjs` + `test:thanks` + `morning-branches.cjs`。

```sh
GAME_BASE_URL=http://127.0.0.1:5175/chengchuan-mystery-game/ npm run test:pages
```

本地测试的浏览器依赖可先执行 `npx playwright install chromium`；支持的脚本可用 `BROWSER_PATH` 指定已有浏览器。CI 对开场分别测服务器与静态环境，这是两个环境的回归，不是两份真人体验证据。

## 历史脚本怎么处理

其他套件仍保留在仓库，有的依赖旧剧情、旧 UI、`GAME_URL` 或本机环境；有的默认指向 5173。不要全目录盲跑，也不要启动旧项目来让它们通过。按所改行为检查脚本的入口和适用状态，再决定更新、运行或退役。

`morning-branches.cjs` 使用第二天存档样例初始化；它检验该阶段行为，不证明前一天新玩家路径可达。合成样例在 `fixtures/`；临时截图和日志写忽略的 `qa/`。需要长期引用的记录整理到根目录 `docs/playtests/`，注明版本、使用过的状态注入和局限。

历史完整环境说明见 [固定旧版本](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/tests/README.md)，不可当作当前命令清单。

## 按改动选择验证

- 纯文档：链接、状态与适用版本、退休文件可恢复性、相互矛盾检查；实验合同用对应技能验证器。当前 CI 没有文档跳过规则，推送仍触发现有检查。
- 对话 / 事件：接收信息前后、拒绝、否定、改口、重复、未发送与已发送；根据改动运行相关领域与浏览器用例。
- 界面 / 教学：无指引实际操作、发送反馈、焦点与窄屏，不能只测按钮点击。
- 构建 / 路由：服务器与 Pages 子路径、资源加载及无 API 行为。
- 存档 / 删除旧模块：旧样例恢复、未发草稿与历史发送不丢失、没有残留入口与依赖；先约定不兼容时的处理方式。

故事是否值得做按 [产品工作流](../../../docs/WORKFLOW.md) 另验。重构选定前不要添加验证 v4 细节的测试，把尚未采用的方案锁进程序。
