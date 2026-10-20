# 浏览器编辑、自动测试和在线试玩

## 三个入口

- [编辑代码和文档](https://github.dev/TedShao/chengchuan-mystery-game)
- [查看测试与发布](https://github.com/TedShao/chengchuan-mystery-game/actions)
- [试玩《那句谢谢》](https://tedshao.github.io/chengchuan-mystery-game/opening.html) / [完整办公工作空间](https://tedshao.github.io/chengchuan-mystery-game/)

网页编辑器也可以从仓库页面按英文句号 `.` 打开。它不需要克隆本地项目，不需要 Codespaces。未提交的编辑暂存在浏览器中，关掉或清理浏览器之前应提交。

## 一次更新怎么完成

1. 在网页编辑器打开 `sites/chengchuan-rebuild/web/` 修改界面和开场；完整工作空间的剧情规则放在 `src/domain/`。剧本及调研放在 `outputs/`。
2. 使用源代码管理查看差异，填写说明并提交。较大改动先建分支、发 Pull Request；合并到 `main` 后才发布。
3. 在 Actions 查看 **Test and publish game**。`checks` 是测试，`deploy` 是发布。测试失败时旧网站保留，打开失败步骤查看原因后修改再提交。
4. 发布完成后打开试玩网址。浏览器可能短时间缓存旧资源；必要时强制刷新。

网页编辑器没有终端，也不会即时运行修改后的应用；预览来自通过测试后发布的 Pages。需要保留旧发布时，在新分支修改，不要先提交到 `main`。

## 免费使用边界

当前采用公开仓库、标准 `ubuntu-latest` 运行器及 Pages 默认域名。不创建 Codespaces、不使用大型付费运行器、不启用按量付费外部 API，也不调整账户付款或预算设置。

发布只上传 `dist/pages/`，不会发布整个仓库、开发依赖、私钥或环境配置。构建包保留 1 天，不上传浏览器截图和测试日志作为长期 Actions 产物；工作流超时受限，同一分支的新提交取消旧流程。不要加入无限循环、定时保活或付费服务。

官方说明：[网页编辑器](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor)、[Actions 计费](https://docs.github.com/en/billing/concepts/product-billing/github-actions)、[Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)。

## 游戏与存档

Pages 不能运行服务器 API。构建脚本将原有纯剧情模块封装为浏览器运行时，与可选服务器共享同一份规则，不复制维护另一套剧情。发送、拒绝、改口和知情范围仍由同一事件规则判定。

所有邮件、聊天、电话和公司网页均为游戏内模拟；不发送真实邮件、短信或电话。

存档仍留在当前浏览器。新域名不会自动读到 localhost 或原网站的存档；本次迁移不清理旧存档。完整工作空间原有导入导出功能保留，十分钟开场在新网址默认重新开始。换电脑不自动同步游戏进度。

## 可选调试

无需本机运行即可使用以上流程。维护者如需调试，仍可在一个临时或已有工作副本中运行：

```sh
cd sites/chengchuan-rebuild
npm ci
npm run build:pages
node scripts/serve-pages.mjs
```

另一个终端：

```sh
cd sites/chengchuan-rebuild
npx playwright install chromium
GAME_BASE_URL=http://127.0.0.1:5175/chengchuan-mystery-game/ npm run test:pages
```

5175 仅用于模拟 Pages 子路径和无 API 环境。旧 5173、5174 服务不受影响。本地旧文件目前保留，不因迁移自动删除。
