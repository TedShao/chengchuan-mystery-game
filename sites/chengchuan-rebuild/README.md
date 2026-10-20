# 澄川工作空间 · 独立重构版

- 本项目独立于 `../chengchuan-firstday`，不修改原版。
- 本地地址：http://127.0.0.1:5174/
- 原版地址：http://127.0.0.1:5173/
- 独立浏览器存档键：`chengchuan-rebuild-v1`；不读取、迁移或清空原版存档。
- 没有复制原站点托管标识，不发布或覆盖原网站。
- 保留原版剧情、办公与下午状态模块作为迁移基础；本轮重做新玩家开场交互。

代码与文档统一维护于 [GitHub 仓库](https://github.com/TedShao/chengchuan-mystery-game)。完整迁移目录与开发约定见[根目录说明](../../README.md)。

使用 Node.js 22 或更新版本，先执行 `npm ci`，再执行 `npm run dev`。

## 本轮可玩内容

目前优先打磨的十分钟体验是 **《那句谢谢》**，入口为 http://127.0.0.1:5174/opening.html 。玩家从回复与内部复盘的差异入手，通过查阅、询问、修订和实际交付观察同事的选择。完整办公工作空间仍保留在根路径，支持自由办公与原有剧情模块。

历史重构方案见 [开场说明](docs/REBUILD-OPENING.md)，后续迭代记录见 [progress.md](progress.md)。

- `npm test`：剧情规则测试。
- `npx playwright install chromium`：首次安装测试浏览器。
- `npm run test:thanks`：当前十分钟开场的三个浏览器回归脚本，需先启动本地服务。可用 `BROWSER_PATH` 指定已有 Chrome。
- `npm run test:opening`：独立浏览器开场验证（需本机 Chrome 和 Playwright）。
- `npm run verify:build`：本地构建与产物检查。
