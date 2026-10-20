# 澄川 · 网页悬疑推理游戏

[开发先读](docs/PROJECT.md) · [当前计划](docs/PLAN.md) · [迭代工作流](docs/WORKFLOW.md) · [资产与历史索引](docs/DOCUMENTS.md)

**当前阶段：《替你说的话》纸面复查后删减，未改代码。** 身份冲突和公司服务安排仍可核实，但“远汀购买独立推荐”可以被普通获客动机解释，尚未自然接成新的调查。本轮删除人为的交接取证与孟宁随对话时序变化的反应，保留有效退出、暂停和改口；完整后半回 R01/R02，线上仍为旧版。

这是以公司电脑为探索空间的现实向推理游戏。玩家通过文件、网页和人物行动验证猜测，选择应改变后续事件。自由办公是环境，不是主线需要完成的工作量。

## 我现在该看什么

| 要做的事 | 入口 |
|---|---|
| 开始任何开发 | [PROJECT](docs/PROJECT.md)：边界、基线与依据顺序 |
| 领取下一项工作 | [PLAN](docs/PLAN.md)：阶段、依赖和验收 |
| 设计、删减、测试、发布 | [WORKFLOW](docs/WORKFLOW.md) |
| 阅读当前重构设计 | [STORY](docs/design/STORY.md)：事实、人物、冲突；[SLICE](docs/design/SLICE.md)：网页操作、分支、参考体验与纸面检查 |
| 找研究、旧剧本、过去验证 | [DOCUMENTS](docs/DOCUMENTS.md)：保留与退役原因、固定历史链接 |
| 启动或维护现有代码 | [项目说明](sites/chengchuan-rebuild/README.md) / [测试说明](sites/chengchuan-rebuild/tests/README.md) |

本次按直接问孟宁、提前暂停、只撤本人、部分阅读和改口作无指引作者纸面复查。允许在合理收尾处停下，不替玩家追加阅读动作。记录不是陌生玩家体验证据；旧稿及被删分支保留在 Git 历史。

## 已实现版本与工具

[旧版十分钟试玩](https://tedshao.github.io/chengchuan-mystery-game/opening.html) · [旧完整办公流程](https://tedshao.github.io/chengchuan-mystery-game/) · [网页编辑](https://github.dev/TedShao/chengchuan-mystery-game) · [测试与发布](https://github.com/TedShao/chengchuan-mystery-game/actions)

当前代码在 `sites/chengchuan-rebuild/`。GitHub 保存文档与代码；`main` 测试通过后发布 Pages。分支和 PR 当前只测试，没有自动预览站。浏览器编辑不能直接运行游戏，操作见[在线指南](docs/ONLINE-WORKFLOW.md)。不使用 Codespaces、付费运行器或外部 AI/通信服务。

可选本地运行（Node.js 22+）：

```sh
cd sites/chengchuan-rebuild
npm ci
npm run dev
```

地址为 `http://127.0.0.1:5174/opening.html` 与 `http://127.0.0.1:5174/`。旧 5173 项目保持隔离。玩家进度在浏览器本地，不随 GitHub 跨设备同步。

资料含完整剧透，人物与公司均为虚构。`archive/` 为原版只读快照；`sources/` 如在本机存在，则是只读同步参考，不在本仓库维护。代码可运行、测试通过，不代表悬疑体验已经获玩家验证。
