
----------

接下来你帮我看看  [https://github.com/ziioai/weird64/pulls](https://github.com/ziioai/weird64/pulls)  这些 dependabot 的提交是怎么回事

----------

这 3 个都是 `.github/dependabot.yml` 配置后，Dependabot 自动创建的**依赖升级 PR**，不是已经进入 `main` 的提交，也不会自行发布 npm 包。

| PR | 改了什么 | 我的判断 |
|---|---|---|
| [#1 Actions 升级](https://github.com/ziioai/weird64/pull/1) | 一次升级 5 个 GitHub Actions，包括 checkout、pnpm 安装和 Pages 部署组件 | PR 的 CI 全绿，可以考虑合并；但它创建于后续修复之前，建议先更新分支、重新跑 CI。PR 检查没有实际执行 Pages 部署和 npm 发布流程，合并后还要观察文档部署。 |
| [#2 Biome 1 → 2](https://github.com/ziioai/weird64/pull/2) | 只升级 Biome 和锁文件，没迁移 `biome.json` | **现在不要合并。** 我用 Biome 2.5.14 对现有配置做了只读复现：`organizeImports`、`files.ignore` 已不被接受，`biome check` 直接失败。需按 [Biome 官方迁移指南](https://biomejs.dev/guides/upgrade-to-biome-v2/)迁移配置，再跑完整验证。 |
| [#3 Node 类型 24 → 26](https://github.com/ziioai/weird64/pull/3) | 升级开发依赖 `@types/node`，不直接升级包的运行时要求 | 暂时没必要合并。项目目前用 Node 24 构建，直接采用 Node 26 类型可能让新 API 混入开发检查。它显示的 Node 20 CI 失败来自**旧工作流用 Node 20 启动 pnpm 11**，不能据此判断类型升级本身失败。 |

简言之：**先别一键合并三个。** #1 可在刷新并复测后处理；#2 需要人工迁移配置；#3 可以先搁置。锁文件里出现的 `glob`、`@ungap/structured-clone` 弃用提示，是已有传递依赖的元数据警告，不代表这几个 PR 新增了这些依赖；值得单独排查，但不应把它们当作这次升级已经修复的漏洞。

另外，pnpm 官方现在建议 pnpm 11+ 后续改用 [`pnpm/setup`](https://github.com/pnpm/action-setup/blob/master/README.md)；#1 只是机械地把现有 `pnpm/action-setup` 从 v4 升到 v6，没有完成这项工作流迁移。

----------



----------



----------
