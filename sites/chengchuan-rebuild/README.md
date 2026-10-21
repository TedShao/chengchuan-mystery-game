# 保留程序的运行说明

本目录代码尚未应用《回来以后再联系》。开发前读 [PROJECT](../../docs/PROJECT.md) 与 [PLAN](../../docs/PLAN.md)；不把当前代码中的人物、剧情、选项当新故事规范。

## 现有入口

- `web/opening.html`：原十分钟原型；主要逻辑在 `web/reply-opening.js`。
- `web/index.html`：原办公工作空间；部分规则在 `src/domain/`，部分在 `web/`。

Pages 构建把 domain 模块封装进浏览器，另保留可选本地服务器；不是所有规则都已集中到 domain。

Node.js 22+，在本目录执行：

```sh
npm ci
npm run dev
```

地址为 `http://127.0.0.1:5174/opening.html` 和根路径。5173 属于原项目，不占用；保留现有存档，不在文本整理中迁移或重置。

测试命令与限制见 [tests/README.md](tests/README.md)，GitHub 操作见 [在线指南](../../docs/ONLINE-WORKFLOW.md)。旧剧情试玩报告与重复进度入口已清理；进度只维护于 PLAN。

旧源码及其测试夹具因本轮不改代码而保留。后续是否复用、替换或删除，由专门的工程任务在依赖和存档检查后决定。
