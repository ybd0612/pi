# 简洁主区域渲染模式

简洁模式只改变交互式主区域的展示，不改变 AgentSession、工具执行、权限确认、会话、队列、压缩、重试、插件 renderer 或既有快捷键。模式默认启用。

## 使用

可在设置文件中显式关闭：

```json
{ "simpleMainRender": false }
```

运行中可通过可配置的应用动作 `app.main.toggleSimpleRender` 切换。该动作默认不绑定快捷键，可在现有 keybinding 配置中自行绑定，不会覆盖既有 action。

简洁模式显示中文处理状态、点阵动画、最终回答和错误摘要；思考内容、工具参数和工具输出由现有组件保留，并可通过点击或已有展开 action 查看完整详情。

## 迁移与兼容性

旧设置没有 `simpleMainRender` 时按 `true` 处理，不需要迁移脚本，也不会为了补默认值重写文件。设置为 `false` 即恢复现有完整主区域呈现。

简洁 renderer 只实现现有 assistant/tool 生命周期接口，工具的 `renderCall`、`renderResult`、partial/error、图片、共享 state、异常回退和展开行为仍由现有 `ToolExecutionComponent` 负责。

## Fork 同步流程

个人功能分支：

```sh
git fetch upstream
git switch main
git merge --ff-only upstream/main
git switch <feature-branch>
git rebase main
```

共享分支不要改写历史时，用 `git merge main` 替代 rebase。冲突解决后运行聚焦测试和 `npm run check`。
