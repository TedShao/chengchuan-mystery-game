# 项目维护约定

先读 [PROJECT](docs/PROJECT.md) 和 [PLAN](docs/PLAN.md)，按 [WORKFLOW](docs/WORKFLOW.md) 执行。

- 当前唯一故事是《回来以后再联系》，依据为 [STORY](docs/design/STORY.md)、[SLICE](docs/design/SLICE.md)、[INTERACTION](docs/design/INTERACTION.md)。旧实现不是新剧情的补充资料。
- 用户已授权根据新故事重构前后端，并明确清除旧 5174 实现。代码与场景同步维护；合并 main 或部署仍单独决定。
- 修改现有文件，不建版本副本；旧故事、旧调研、旧实验和旧剧情测试记录不回填当前目录。需要研究时重新提取有证据支持的事实，不恢复整个旧稿。
- 普通更新用分支 / PR；检查远端和本地变更，保留他人修改，不强推、不擅自合并或发布。
- `sources/` 是只读同步材料。原 5173 和旧托管站不动；当前项目只用 5174。`archive/` 仅存保留程序，不参与创作。
- 真实收件、草稿隔离、改口留痕及角色知情边界是行为约束。作者推演、自动测试、真人观察分别报告。
- 不提交凭据、依赖目录、构建产物或未经同意的私人资料。不引入付费服务。

当前结构见 [DOCUMENTS](docs/DOCUMENTS.md)；工程操作见 [在线指南](docs/ONLINE-WORKFLOW.md)及[测试说明](sites/chengchuan-rebuild/tests/README.md)。
