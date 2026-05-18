# 模块: 构建与发布脚本

## 用途
负责从 TypeScript 源码生成 JS 构建产物、生成变更日志，以及在版本发布流程中衔接 Git 操作。

## 关键文件
- `scripts/build.mjs`：通过 esbuild 打包生成 `convert.js` 和 `convert.min.js`，并注入版权/说明 Banner。
- `scripts/changelog.mjs`：版本生命周期中更新 `CHANGELOG.md`。
- `package.json`：定义 `typecheck`、`build`、`generate`、`artifacts`、`lint`、`format` 和发布生命周期脚本。
- `package-lock.json`：锁定依赖版本。
- `CHANGELOG.md`：项目对外变更日志。

## 依赖
- 构建依赖 `esbuild`、TypeScript/tsgo 和 Node.js。
- 发布辅助依赖 `git-cliff` 与 npm version lifecycle。
- 发布流程依赖 Git 远程权限，且会执行 `git push --follow-tags`。

## 经验
- 常规开发只运行验证和构建命令，不运行 `npm version`。
- `npm version patch|minor|major` 会触发 `preversion`、`version`、`postversion`，其中 `postversion` 会推送远程标签；只有用户 `powerfullz` 或代表 `powerfullz` 的 Agent 可执行。
- 根目录 `convert.js`、`convert.min.js` 和 `yamls/` 是产物，不直接修改，也默认不提交。
