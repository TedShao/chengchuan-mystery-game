# 澄川 · 网页悬疑推理游戏

[在线试玩《那句谢谢》](https://tedshao.github.io/chengchuan-mystery-game/opening.html) · [完整工作空间](https://tedshao.github.io/chengchuan-mystery-game/) · [网页编辑代码与文档](https://github.dev/TedShao/chengchuan-mystery-game) · [测试与发布状态](https://github.com/TedShao/chengchuan-mystery-game/actions)

默认更新方式：浏览器编辑 → 提交 GitHub → Actions 自动测试 → 测试通过后发布 Pages。无需在本机安装依赖或运行服务器；不使用 Codespaces、付费运行器或自购域名。操作步骤与存档说明见 [在线开发指南](docs/ONLINE-WORKFLOW.md)。

一个以公司电脑、邮件、聊天、文档和培训材料为探索界面的网页推理游戏。当前打磨对象是十分钟开场 **《那句谢谢》**：玩家核对罗青的来信，决定如何回复、修订和交付材料，并观察不同收件范围造成的实际后果。

本仓库是代码与创作文档的统一版本库。资料包含完整剧透；人物、公司及业务记录均为虚构。历史方案是研究与迭代记录，不代表全部已经实现。

## 从哪里开始

| 内容 | 位置 |
| --- | --- |
| 当前独立开发版 | [sites/chengchuan-rebuild](sites/chengchuan-rebuild) |
| 十分钟开场源码 | [reply-opening.js](sites/chengchuan-rebuild/web/reply-opening.js) |
| 最新试玩分析 | [十分钟体验审查](sites/chengchuan-rebuild/docs/THANKS-TEN-MINUTE-AUDIT.md) |
| 调研、故事与分场剧本 | [文档目录](docs/DOCUMENTS.md) / [outputs](outputs) |
| 原版代码归档 | [archive/chengchuan-firstday](archive/chengchuan-firstday) |
| 后续开发约定 | [CONTRIBUTING.md](CONTRIBUTING.md) |
| 迁移说明 | [docs/MIGRATION.md](docs/MIGRATION.md) |

## 可选的本地运行

需要 Node.js 22 或以上版本。应用本身无需数据库、API 密钥或付费服务。

```sh
cd sites/chengchuan-rebuild
npm ci
npm run dev
```

- 《那句谢谢》：http://127.0.0.1:5174/opening.html
- 完整办公工作空间：http://127.0.0.1:5174/

存档保存在浏览器本地；GitHub 保存代码与文档，不同步玩家存档。新的 Pages 域名与 localhost、原托管网站的存档各自独立。Pages 的更新不会覆盖此前托管的网站。

## 验证

```sh
cd sites/chengchuan-rebuild
npm test
npm run verify:build
npx playwright install chromium
# 保持另一个终端中的 npm run dev 运行
npm run test:thanks
```

`test:thanks` 覆盖当前开场的拒绝、漏附、交付、改口、收件范围、重复操作及手机布局。可用 `BROWSER_PATH` 指定本机 Chrome。部分较早的完整办公试玩脚本仍保留原环境配置，参见项目测试说明。

GitHub Actions 自动运行规则测试、构建与开场浏览器回归，并在不提供 API 的静态服务器上验证开场、页面跳转及第二天分支。`main` 的全部检查通过后才更新 Pages；其他分支和 Pull Request 仅测试。通过技术测试不代表已验证真人玩家的悬疑感或乐趣。
