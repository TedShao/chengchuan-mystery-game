# GitHub 编辑、测试和试玩

GitHub 是版本来源，继续使用免费仓库、标准 Actions 和 Pages；不创建 Codespaces、付费 API 或数据库。

- [网页编辑器](https://github.dev/TedShao/chengchuan-mystery-game)：编辑时明确选择当前工作分支。
- [Actions](https://github.com/TedShao/chengchuan-mystery-game/actions)：检查构建、域规则与两种运行方式的浏览器验证。
- [现有线上 Pages](https://tedshao.github.io/chengchuan-mystery-game/)：只有 main 成功构建才发布。当前工程分支不自动部署，所以此入口仍可能是旧游戏。

## 分支与发布

文档基线在 `docs/mystery-rebuild-v4`，新工程在基于它建立的 `feat/recruitment-desktop`。工程 PR 先对文档分支评审；后续合并到 main 才更新 Pages。不要把分支链接或测试截图称为在线新版本。

Actions 的 checks 执行新 domain 测试、构建校验、5174 本地 API 模式和 5175 无 API 子路径模式。deploy 仍只在 main 的成功检查后运行，产物只含 dist/pages，保留时间 1 天。不上传凭据、存档或长期截图包。

## 本地看新版本

在 `sites/chengchuan-rebuild/`，Node.js 22+：

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:5174/ 。不再有两套独立故事入口；opening.html 转到根路径。5173 与原托管站不动。

检查 Pages 模式：

```sh
npm run verify:build
node scripts/serve-pages.mjs
```

另一个终端运行：

```sh
GAME_BASE_URL=http://127.0.0.1:5175/chengchuan-mystery-game/ npm run test:pages
```

## 存档与架构

所有邮件、通话、网站和求助都是游戏内模拟。新前端通过命令接口推进，domain 在本地 API 和 Pages 中保持同一份；静态版本不需要服务器或账号。

存档属于当前浏览器和域名，不会自动跨电脑同步。设置中可导出、导入。新版不读取旧游戏存档，拒绝不匹配版本；重开仅清自己的新版键。关闭或刷新网页不是剧情里的下班、出发或发送。

具体内容与验收见 [PROJECT](PROJECT.md)、[PLAN](PLAN.md)、[运行说明](../sites/chengchuan-rebuild/README.md)和[测试入口](../sites/chengchuan-rebuild/tests/README.md)。
