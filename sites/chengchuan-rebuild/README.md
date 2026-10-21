# 《回来以后再联系》｜重构工程

这是新的招聘调查工作台。原 5174 的旧界面、剧情、夹具和构建脚本已被替换，不再把新故事接进旧办公汇报系统。原程序可由 Git 历史追溯；5173 与 archive 未改。

## 运行

Node.js 22+：

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:5174/ 。`opening.html` 仅兼容旧书签，跳回同一入口。序幕可跳过，操作教学可关闭；浏览器不需要账号。

## 分层

| 路径 | 职责 |
|---|---|
| `src/domain/content.mjs` | 人物、材料与许可转交范围 |
| `src/domain/engine.mjs` | 命令校验、事件重放、会话、知情、安排、分支与结局 |
| `src/server/handler.mjs` | 本地 HTTP API；限定请求大小、版本与同源；重放玩家提交的命令，不接真实业务 |
| `web/transport.js` | 本地 API / 静态适配、版本化存档与重复写入检查 |
| `web/app.js` | 工作台、会话草稿、材料、内网、模拟网站、自由办公与设置 |
| `web/style.css`、`icons.js` | 新视觉、响应式布局、无障碍焦点、图标 |
| `scripts/` | 本地服务、Pages 子路径预览、静态构建与产物校验 |

单人游戏不引入数据库。服务器不保存账号与私人数据，浏览器保留命令历史；静态模式在本机调用同一纯函数。它不是现实员工系统，也不宣称具备防作弊或服务端保密剧情能力。

## 存档与测试

新存档键为 `chengchuan-return-call-v1` 与 `chengchuan-return-call-ui-v1`，不读取或覆盖旧游戏键。设置里可导出、导入和明确重新开始。草稿与私人文件不会进入对方知识；多窗口进度冲突拒绝覆盖，刷新后继续。结局可退回结束前。

[测试入口](tests/README.md) · [剧情依据](../../docs/PROJECT.md) · [当前计划](../../docs/PLAN.md)。自由办公提供简单文档、表格与演示，不是 Office 格式兼容软件；当前通讯采用可预览的多问题意图选项，不伪装任意自由输入或 AI。

## 免费静态版本

```sh
npm run verify:build
node scripts/serve-pages.mjs
```

打开 http://127.0.0.1:5175/chengchuan-mystery-game/ 。构建只复制界面和同一 domain 模块，不改写剧情函数。合并 main 后才由既有 Actions 发布；分支推送不代表线上已更新。
