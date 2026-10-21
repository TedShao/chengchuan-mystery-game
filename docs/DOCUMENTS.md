# 当前文件职责与清理结果

2026-10-21。这里只索引当前材料，不再提供旧故事、旧研究或旧实验入口。日常创作无需翻 Git 历史。

## 创作只看三份

| 文档 | 唯一职责 | 不写什么 |
|---|---|---|
| [STORY](design/STORY.md) | 完整故事、公司与人物、作者真相、时序、线索推理、结局 | 不承担界面逐步点击说明 |
| [SLICE](design/SLICE.md) | 实际可见材料、场景行动、分支、纸面反路线和体验检验 | 不另造与 STORY 不同的事实 |
| [INTERACTION](design/INTERACTION.md) | 软件职责、动态教学、判断表达、发送与改口、知情与事件约定 | 不重复写长篇人物故事，不声称已实现 |

## 管理与现实依据

| 文档 | 用途 |
|---|---|
| [PROJECT](PROJECT.md) | 方向、用户已确认的边界与依据顺序 |
| [PLAN](PLAN.md) | 唯一进度与下一任务、待证据和待决定项 |
| [WORKFLOW](WORKFLOW.md) | 一轮怎样设计、删改、验证、提交；技能如何参与 |
| [REFERENCES](research/REFERENCES.md) | 只与招聘新故事有关的一手来源、阅读限制与虚构边界 |
| [ONLINE-WORKFLOW](ONLINE-WORKFLOW.md) | 已有 GitHub 编辑、测试和 Pages 发布操作 |
| [根 README](../README.md) / [CONTRIBUTING](../CONTRIBUTING.md) | 新读者入口 / 维护约定 |

## 保留工程区

| 路径 | 当前状态 |
|---|---|
| `sites/chengchuan-rebuild/` | 现有程序、测试与夹具保留；[运行说明](../sites/chengchuan-rebuild/README.md)、[测试入口](../sites/chengchuan-rebuild/tests/README.md)只解释工具，不提供新剧情要求 |
| `.github/workflows/verify.yml` | 保持原样；分支检查、main 成功后发布 Pages，没有 PR 自动预览 |
| `archive/chengchuan-firstday/` | 原程序保留；其中旧 Markdown 文本已删除，不参与创作 |
| `sources/` | 本机只读同步参考，Git 忽略，未进入本次清理；不要编辑 |

## 本轮实际清理

基线为清理开始时的设计分支：162 个跟踪文件、30 份 Markdown。删除 22 份旧文本与数据材料，新增 2 份有独立职责的文档，完成后为 142 个跟踪文件、15 份 Markdown。

- 删除旧实验合同、三份旧研究、旧剧情试玩报告及三份合成记录。
- 删除迁移记录与过时文件清单、重复进度入口。
- 删除原程序保留区内 11 份旧说明、剧本相关研究、试玩与进度 Markdown。
- 原位重写故事、片段、项目依据、计划和工作流；清空累积决策年表与旧稿导航。没有另建历史稿文件夹。
- 新增 INTERACTION，承载此前散落且缺失的界面/行为约束；新增 REFERENCES，只存新故事实际使用的现实依据。

删除只作用于当前分支文件树，未重写 Git 历史。代码中的旧剧情字符串、测试和测试夹具依“本次不改代码”要求保留，它们不是文本创作依据；之后由独立工程任务评估清除。
