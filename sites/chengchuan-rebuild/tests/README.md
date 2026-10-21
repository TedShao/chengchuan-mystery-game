# 新故事的验证入口

在本目录上一级运行，Node.js 22+。旧原型的测试和剧情夹具已删除；这些检查针对《回来以后再联系》。截图、状态与测试结果生成在忽略的 `qa/` 下。

| 命令 | 覆盖 |
|---|---|
| `npm test` | 命令重放、未知资料拒绝、收件隔离、重复、撤回再联系、改口、暂停、出境前提及 API 一致性 |
| `npm run verify:build` | 静态构建、相对资源、唯一入口和旧剧情退出产物 |
| `npm run test:browser` | 需先启动 5174；从序幕关闭指引，走漏接、误判、拒绝、改口、实际转交、结局、办公保存与移动端 |
| `GAME_BASE_URL=http://127.0.0.1:5175/chengchuan-mystery-game/ npm run test:pages` | 先构建并启动 serve-pages；在无 API 子路径重复同一实际交互流程 |

浏览器使用 Playwright 的独立 context，不清理用户浏览器存档。优先已安装 Chromium，macOS 可使用本机 Chrome；CI 安装 Chromium。初始化可运行 `npx playwright install chromium`。

测试中的行为与因果断言不代表陌生玩家会自然选择同样路线。界面截图需实际查看，兴趣、对白口语感和推理公平性仍需真人观察。新版内容的限制与下一步只记在 PLAN。
