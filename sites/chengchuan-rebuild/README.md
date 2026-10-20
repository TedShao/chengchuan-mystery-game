# 澄川独立项目：当前代码说明

开工先读 [PROJECT](../../docs/PROJECT.md) 与 [PLAN](../../docs/PLAN.md)。当前阶段是重建冲突，不是照 v4 实现；本目录代码尚未替换为新方案。

## 实际存在的两个入口

- `web/opening.html` / [线上十分钟开场](https://tedshao.github.io/chengchuan-mystery-game/opening.html)：文书核对版《那句谢谢》，主要逻辑在 `web/reply-opening.js`。
- `web/index.html` / [线上完整办公](https://tedshao.github.io/chengchuan-mystery-game/)：更早的办公和第二天剧情。部分规则在 `src/domain/`，部分仍在 `web/`。

Pages 构建将 domain 模块封装进浏览器，保留可选本地服务器。只有这一部分是同源规则，不能据此声称所有开场和聊天已统一架构。

## 可选本地运行

Node.js 22+，在本目录执行：

```sh
npm ci
npm run dev
```

访问 `http://127.0.0.1:5174/opening.html` 或根路径。5173 属于原版，不能占用。浏览器存档键保留 `chengchuan-rebuild-v1` 及独立序幕键；不清空或迁移原版存档。

构建、测试与适用范围见 [tests/README.md](tests/README.md)。网页编辑、Actions、Pages 见 [在线指南](../../docs/ONLINE-WORKFLOW.md)。旧实现的体验问题见 [代理试玩审查](../../docs/playtests/THANKS-TEN-MINUTE-AUDIT.md)，不把它当作真人验收。

原版快照、旧托管站和同级原项目保持隔离。新片段验证通过以后，才按 R05 决定生产入口及旧模块退役，避免永久并列叠加。
