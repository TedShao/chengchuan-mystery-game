# 保留程序的测试入口

2026-10-21 按 package.json 与现有 CI 配置核对。此页只说明旧程序如何检查，不含故事规范；本轮未重跑游戏测试，也未改测试程序。测试通过不能证明新故事已实现或体验成立。

在 `sites/chengchuan-rebuild/` 下，Node.js 22+：

| 命令 | 范围与条件 |
|---|---|
| `npm test` | 现有 domain 规则断言 |
| `npm run verify:build` | 本地服务器构建与产物检查 |
| `npm run test:thanks` | 启动 `npm run dev` 后，检查现有开场的三个浏览器套件 |
| `npm run build:pages` | 静态资源及 domain 浏览器封装检查 |
| `npm run test:pages` | 启动 `node scripts/serve-pages.mjs` 后，检查子路径与已有行为 |

Pages 测试地址：

```sh
GAME_BASE_URL=http://127.0.0.1:5175/chengchuan-mystery-game/ npm run test:pages
```

浏览器依赖可执行 `npx playwright install chromium`。CI 同时检查服务器与静态环境；不是两份真人体验证据。

其他历史脚本仍在，可能依赖旧 UI、旧存档、特定环境或 5173 默认值。不要全目录盲跑，不要为使它们通过启动原项目。使用前检查入口和适用条件。fixtures 为程序测试数据，未参与本次文本清理；不能作为新剧情事实。

纯文档只查链接、编码、范围和一致性；现有 CI 没有文档跳过规则，推送仍可能运行旧程序检查。以后修改事件需测收件、否定、改口、重复；修改 UI 需测真实操作、反馈、焦点和窄屏；改存档需明确兼容策略。

内容验收以 [WORKFLOW](../../../docs/WORKFLOW.md) 为准，不从历史测试名称推断新游戏需求。
