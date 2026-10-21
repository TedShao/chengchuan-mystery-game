# 澄川｜网页悬疑推理游戏

当前重构故事：**《回来以后再联系》**。你是一名刚找到工作的招聘助理。一个接待过的求职者去了国外，他的父亲打来电话，想知道儿子为什么回不来。

**先看 [完整故事大纲](docs/design/STORY.md)。** 需要看玩家如何操作，读 [场景与材料](docs/design/SLICE.md)；需要做界面和行为，读 [交互约定](docs/design/INTERACTION.md)。

[项目基线](docs/PROJECT.md) · [当前计划](docs/PLAN.md) · [工作流](docs/WORKFLOW.md) · [文件职责](docs/DOCUMENTS.md)

工程分支已整体替换旧 5174 程序，新故事已有可玩工作台、共享剧情引擎和新测试。旧故事、旧调研、旧实验及旧代码退出重构项目；新版未经过陌生玩家验证。人物和公司均为虚构，设计文档包含剧透。

## 仓库与试玩

GitHub 是代码与文档的唯一版本来源。文档基线在 `docs/mystery-rebuild-v4`，新实现分支为 `feat/recruitment-desktop`。分别通过 PR 评审，尚未合并主线。

[已有原型入口](https://tedshao.github.io/chengchuan-mystery-game/opening.html) · [已有工作空间](https://tedshao.github.io/chengchuan-mystery-game/) · [网页编辑器](https://github.dev/TedShao/chengchuan-mystery-game) · [Actions](https://github.com/TedShao/chengchuan-mystery-game/actions)

以上网页仍是旧程序，仅供维护时确认现状，**不是新故事试玩**。main 成功构建后才发布 Pages；当前没有自动 PR 预览站。具体操作见 [在线指南](docs/ONLINE-WORKFLOW.md)。不使用 Codespaces 或付费 API。

新程序在 `sites/chengchuan-rebuild/`，本地试玩 http://127.0.0.1:5174/ ；[运行说明](sites/chengchuan-rebuild/README.md)。`archive/` 仅保存原程序，旧文本已清理；不与新项目混用。`sources/` 若在本机存在，是只读同步材料，不在本仓库维护。
