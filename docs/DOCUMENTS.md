# 文档盘点、职责与退役索引

整理基线：2026-10-20，`42ab1e0`；main 当时是 `9ed607e`。完整整理前快照由 Git 标签 [`archive/docs-before-reset-2026-10-20`](https://github.com/TedShao/chengchuan-mystery-game/tree/archive/docs-before-reset-2026-10-20) 保留，不依赖后续 PR 分支是否删除。本索引用于定位，不是额外的开发大纲。

## 开发只从这里开始

| 文档 | 作用 | 是否直接决定开发 |
|---|---|---|
| [PROJECT](PROJECT.md) | 当前方向、边界、基线、保留与推翻决定 | 是，约束层 |
| [PLAN](PLAN.md) | 唯一待办与阶段状态、验收、下一项 | 是，执行层 |
| [WORKFLOW](WORKFLOW.md) | 设计、验证、实现、删减、发布如何衔接 | 是，流程层 |
| 本索引 | 查找现有资产及退役原因 | 否，不含剧情决定 |
| [在线操作](ONLINE-WORKFLOW.md) | 网页编辑、Actions、Pages 的实际操作 | 工具层，不能代替故事验收 |
| [项目 README](../sites/chengchuan-rebuild/README.md) / [测试说明](../sites/chengchuan-rebuild/tests/README.md) | 实际运行、测试范围和局限 | 当前代码维护依据 |

当前设计只有 [STORY](design/STORY.md)（保留事实、人物、冲突与被否决的推断）与 [SLICE](design/SLICE.md)（参考体验、局部动作、分支与纸面反证）。两者当前保留局部片段，不能作为完整悬疑的实现依据或就绪的盲测稿；下一项以 PLAN 为准，不从历史里自行选“最新版本”开工。

## 当前有什么：盘点时的代码与资产

| 路径 | 整理前数量 / 内容 | 用途与处理 |
|---|---|---|
| `sites/chengchuan-rebuild/` | 96 个文件；2 个 HTML 入口、16 个 JS、7 个 CSS、3 个 domain 模块、服务器/打包脚本、43 个测试程序（37 cjs + 6 domain test mjs） | 已实现的独立项目；本轮只整理其说明文档 |
| `outputs/` | 24 份 Markdown + 1 份实验 JSON | 研究、旧故事和新提案混放；现目录内容退出当前树，3 份研究移动、其余退役 |
| `docs/` | 原有 3 份 Markdown + 迁移清单及 3 份合成试玩 JSON | 原本主要是迁移/技术流程；现在补充产品迭代入口 |
| `archive/` | 53 个文件，含 12 份 Markdown | 原 5173 项目只读快照，本轮不改；不是另一个开发主线 |
| `.github/workflows/verify.yml` | 一个 CI/发布工作流 | 自动测试与 main Pages 发布；没有剧情质量验收或 PR 试玩部署 |
| 根目录 | README、CONTRIBUTING、忽略规则 | 项目入口、更新约定与排除产物 |

总计 185 个跟踪文件、52 份 Markdown，是本轮整理前的固定快照。`sources/`、本机依赖、临时 QA、密钥和未跟踪运行目录不纳入仓库资产盘点，也不改动。

R00 整理后 Markdown 共 28 份，其中原版只读快照仍占 12 份；原版快照以外从 40 份减到 16 份。随后 R01/R02 只新增约定的 STORY、SLICE，目前为 30 份，原版快照以外 18 份。管理入口是 PROJECT、PLAN、WORKFLOW；设计读两份规范，参考与历史按需查阅。

**已确认的结构问题：**开场 `web/reply-opening.js` 自带规则，完整办公也有前端规则；不能声称整个项目已经统一到 `src/domain/`。旧测试说明混写多个“当前版本”并宣称必须 API，与现有静态 Pages 入口不符。本轮修正文档，工程处理见 R04。

## 保留下来的研究与证据

| 文件 | 为什么留 | 不能拿来做什么 |
|---|---|---|
| [网页解谜多维研究](research/WIG网页解谜游戏_多维度深度调研报告.md) | 类型、交互、技术、商业参考 | 直接指定本项目玩法；旧平台规则/价格须在使用前复核 |
| [悬疑审稿标准](research/优秀悬疑故事_多维度标准与WIG审稿体系.md) | 检查信息公平、动机和揭示 | 把长评分表全部变成制作流程 |
| [电诈公司现实研究](research/电诈公司如何运作_真实案例与澄川定位修正.md) | 区分公司运作、协作、知情和地点 | 证明任一虚构人物有罪、把具体案件普遍化 |
| [旧版十分钟审查](playtests/THANKS-TEN-MINUTE-AUDIT.md) | 有具体界面问题、修正和限制 | 当作独立真人盲测或新方案验收 |
| [拒绝路线原记录](playtests/thanks-novice-baseline.json)、[修订实验](playtests/thanks-experiment.json)、[用途核实](playtests/thanks-curiosity.json) | 保留代理操作的结构化证据 | 用旧记录证明新版本效果 |
| [H001 实验合同](experiments/H001/game-design-hypothesis.json) | 只检验一个冲突与调查动机假设 | 作为固定剧情或全部产品需求 |
| [迁移记录](MIGRATION.md)、[迁移文件清单](migrated-files.json) | 保存当时纳入范围 | 充当今日目录或持续开发流程 |
| [进度入口](../sites/chengchuan-rebuild/progress.md) | 指向唯一当前计划，旧日志可追溯 | 再建立第二套任务状态 |
| [原版快照](../archive/README.md) | 追溯原版，不在其内继续编辑 | 拼回新项目作为默认实现 |

## 本轮从当前目录退役的文件

以下链接均固定到整理前提交，完整正文仍可阅读。退役意味着退出开发依据，不代表内容从 Git 历史永久抹除。没有把这些文件复制到另一个同样臃肿的目录。

### 旧故事、方案与纸面走查（含撤回默认采用的 v4）

| 原文（历史链接） | 原作用 | 退役原因 |
|---|---|---|
| [OA桌面推理解谜_玩法重定位与三结局框架](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/OA桌面推理解谜_玩法重定位与三结局框架.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [WIG平台原生悬疑_10个重构方向](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/WIG平台原生悬疑_10个重构方向.md) | 早期选题与玩法研究 | 方向已偏离当前目标；需要时提取素材，不保持为并列候选 |
| [WIG悬疑游戏_10个故事概念与标准初审](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/WIG悬疑游戏_10个故事概念与标准初审.md) | 早期选题与玩法研究 | 方向已偏离当前目标；需要时提取素材，不保持为并列候选 |
| [WIG网页解谜_重新调研与昨日首页玩法方案](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/WIG网页解谜_重新调研与昨日首页玩法方案.md) | 早期选题与玩法研究 | 方向已偏离当前目标；需要时提取素材，不保持为并列候选 |
| [未送达事务所_网页推理与现实互动玩法研究](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/未送达事务所_网页推理与现实互动玩法研究.md) | 早期选题与玩法研究 | 方向已偏离当前目标；需要时提取素材，不保持为并列候选 |
| [欢迎入职_人物驱动故事梗概_v2](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/欢迎入职_人物驱动故事梗概_v2.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [欢迎入职_境内运营公司版故事梗概_v3](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/欢迎入职_境内运营公司版故事梗概_v3.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [欢迎入职_离职申请已通过_完整故事与网页解谜大纲](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/欢迎入职_离职申请已通过_完整故事与网页解谜大纲.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [欢迎入职_第一天下午至第二天上午_完整分场剧本_v1](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/欢迎入职_第一天下午至第二天上午_完整分场剧本_v1.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [欢迎入职_第一天完整分场剧本_v1](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/欢迎入职_第一天完整分场剧本_v1.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [欢迎入职_第二天下午_完整分场剧本_v1](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/欢迎入职_第二天下午_完整分场剧本_v1.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [澄川OA_现实题材研究与悬疑主线重构论证](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/澄川OA_现实题材研究与悬疑主线重构论证.md) | 现实调研与当时重构论证 | 参考依据由保留的现实研究承接；虚构方案不沿用为事实 |
| [第一天至第二天_罗青案例与公司业务衔接方案_v1](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/第一天至第二天_罗青案例与公司业务衔接方案_v1.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [第二天下午_无指引纸面试玩与修订记录_2026-10-19](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/第二天下午_无指引纸面试玩与修订记录_2026-10-19.md) | 旧剧本的作者纸面走查 | 适用旧版本，不是陌生玩家证据；必要问题已进入新门槛 |
| [罗青案例_完整事件与第一天网页推理设计_v1](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/罗青案例_完整事件与第一天网页推理设计_v1.md) | 早期大纲、分场或衔接设计 | 与多轮开场冲突且驱动办公待办；有独立价值的约束已转入 PROJECT |
| [罗青案例_无指引完整纸面试玩与工作闭环修订_2026-10-19](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/罗青案例_无指引完整纸面试玩与工作闭环修订_2026-10-19.md) | 旧剧本的作者纸面走查 | 适用旧版本，不是陌生玩家证据；必要问题已进入新门槛 |
| [罗青案例_纸面试玩与修订记录_2026-10-19](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/罗青案例_纸面试玩与修订记录_2026-10-19.md) | 旧剧本的作者纸面走查 | 适用旧版本，不是陌生玩家证据；必要问题已进入新门槛 |
| [那句谢谢_v4_开场分场与交互稿](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/那句谢谢_v4_开场分场与交互稿.md) | v4 重构提案或对应自审 | 用户质疑冲突强度；退出默认采用，先做 R01；不再整稿推进 |
| [那句谢谢_v4_故事设计](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/那句谢谢_v4_故事设计.md) | v4 重构提案或对应自审 | 用户质疑冲突强度；退出默认采用，先做 R01；不再整稿推进 |
| [那句谢谢_v4_旧稿悬疑审查](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/那句谢谢_v4_旧稿悬疑审查.md) | v4 重构提案或对应自审 | 用户质疑冲突强度；退出默认采用，先做 R01；不再整稿推进 |
| [那句谢谢_v4_纸面走查与验收](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/那句谢谢_v4_纸面走查与验收.md) | v4 重构提案或对应自审 | 用户质疑冲突强度；退出默认采用，先做 R01；不再整稿推进 |

### 旧局部开发说明

| 原文（历史链接） | 原作用 | 退役原因 |
|---|---|---|
| [DAY-TWO-OBSERVER.md](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/DAY-TWO-OBSERVER.md) | 旧实现的设计、局部审查或版本复核 | 已被实际代码、保留审查和当前计划替代；不再自称当前规范 |
| [NEW-PLAYER-RECOVERY.md](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/NEW-PLAYER-RECOVERY.md) | 旧实现的设计、局部审查或版本复核 | 已被实际代码、保留审查和当前计划替代；不再自称当前规范 |
| [REBUILD-OPENING.md](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/REBUILD-OPENING.md) | 旧实现的设计、局部审查或版本复核 | 已被实际代码、保留审查和当前计划替代；不再自称当前规范 |
| [REPORT-FEEDBACK.md](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/REPORT-FEEDBACK.md) | 旧实现的设计、局部审查或版本复核 | 已被实际代码、保留审查和当前计划替代；不再自称当前规范 |
| [REPORT-NARRATIVE.md](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/REPORT-NARRATIVE.md) | 旧实现的设计、局部审查或版本复核 | 已被实际代码、保留审查和当前计划替代；不再自称当前规范 |
| [RESEARCH-REFACTOR-V16.md](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/RESEARCH-REFACTOR-V16.md) | 旧实现的设计、局部审查或版本复核 | 已被实际代码、保留审查和当前计划替代；不再自称当前规范 |

### 旧实验合同与重复日志

- [outputs/game-design-hypothesis.json](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/outputs/game-design-hypothesis.json)：测试的是旧开场或旧架构，当前问题由 H001 重新界定；已从当前树删除。
- [sites/chengchuan-rebuild/docs/game-design-hypothesis.json](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/docs/game-design-hypothesis.json)：测试的是旧开场或旧架构，当前问题由 H001 重新界定；已从当前树删除。
- [完整旧进度日志](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/progress.md)：保留历史正文，当前文件只作入口，避免第二套状态。
- [旧测试说明](https://github.com/TedShao/chengchuan-mystery-game/blob/42ab1e0216f19c24096aa2b123c90565cd7f552c/sites/chengchuan-rebuild/tests/README.md)：历史环境与适用场景保留可追溯链接；当前测试说明已重写。

## 找回历史的方法

优先打开上面的固定链接。需要提取片段时，用 `git show 42ab1e0:原路径` 查看；需要恢复整文件时，先说明它在当前计划里的独立用途，再恢复到对应的参考或规范位置。不要整批恢复到 `outputs/`，也不要再次把文件名中的版本号当成权威顺序。

`archive/chengchuan-firstday/` 原有 README、progress、EDGE-CASES、PLAYTEST 系列、RESEARCH-REFACTOR-V16 与 tests/README 仍属于原版快照。它们不参与当前规范优先级；未为这次整理改写这些历史文件。
