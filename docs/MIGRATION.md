# GitHub 迁移记录 · 2026-10-20

本页是迁移当时的记录，路径与数量不是当前目录。现行工作流见 [WORKFLOW](WORKFLOW.md)，当前目录见 [DOCUMENTS](DOCUMENTS.md)。

目标仓库：`TedShao/chengchuan-mystery-game`，公开仓库。

## 纳入的内容

- `sites/chengchuan-rebuild/`：当前独立开发项目，包括《那句谢谢》、完整办公工作空间、剧情模块、测试和开发记录。
- `outputs/`：已有 20 份调研、悬疑标准、故事梗概、分场剧本与纸面试玩文档，以及设计假设 JSON。
- `archive/chengchuan-firstday/`：原版当前源码及文档快照，作为只读归档；不是仍在运行的原版目录，也没有迁移其独立 Git 历史。
- `docs/playtests/`：本轮开场已审阅的合成试玩文本记录。必要存档样例迁入 `tests/fixtures/`，不再依赖未跟踪的 QA 输出。
- GitHub Actions、启动说明、测试依赖锁文件及后续更新约定。

## 留在本地的内容

临时 QA 截图和日志、构建产物、依赖目录、ChatGPT 同步参考目录、原版运行目录、原版 Git 元数据和托管标识。不移动或清空浏览器存档，不覆盖现有网页。

用户已在 GitHub 添加单仓库写入 Deploy key，首次推送成功。私钥保存在被忽略的 `.local/`，不纳入 Git。其他机器应使用各自的 GitHub 登录；如不再使用此机器，可从仓库 Settings → Deploy keys 移除对应公钥。

迁移初期采用本地编辑后推送；随后改为默认网页编辑、Actions 测试、Pages 试玩。本地已有副本可用于调试，但不作为第二套文档来源。

## 迁移完成

初始提交 `ba00ed6` 已推送到远端 `main`，共 176 个文件。本地 `main` 已跟踪 `origin/main`，后续代码与文档更新在此仓库提交、推送。
