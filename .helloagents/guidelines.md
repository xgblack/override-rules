# 项目约定

<!-- 只记录从代码看不出来的约定。AI 能从代码推断的风格不需要写在这里。 -->

## 编码风格
- 所有核心逻辑必须修改 TypeScript 源码，不直接编辑根目录 `convert.js`、`convert.min.js` 或 `yamls/` 产物。
- 新增公共函数需要写简洁 docstring；复杂逻辑只在必要处补注释。
- 代码格式以 Prettier 和 ESLint 为准，提交前优先运行 `npm run format:check`、`npm run lint` 和 `npm run typecheck`。

## 命名规范
- 代理组名称统一在 `src/constants.ts` 的 `PROXY_GROUPS` 中维护。
- 地区代理组统一命名为“{地区}节点”，后缀来自 `NODE_SUFFIX`。
- YAML 文件名由 `scripts/yaml_generator/generator.ts` 的 `FLAGS` 与 `FLAG_SHORT_NAMES` 统一生成，格式为 `config_lb-{0|1}_landing-{0|1}_ipv6-{0|1}_full-{0|1}_keepalive-{0|1}_fakeip-{0|1}_quic-{0|1}_tun-{0|1}.yaml`。
- 自有规则文件保存在 `ruleset/*.list`，一行一条规则，文件名要能表达目标规则集或业务场景。

## Git 工作流
- 默认不提交构建产物；`convert.js`、`convert.min.js`、`yamls/` 已在 `.gitignore` 中忽略。
- 功能修改与文档修改可以分离提交；提交信息常用 `feat:`、`fix:`、`chore:` 等 conventional commit 前缀。
- 发布流程只允许用户 `powerfullz` 或代表 `powerfullz` 的 Agent 执行；普通贡献者 Agent 不得运行 `npm version patch|minor|major` 或触发发布。

## 测试
- 源码修改后至少运行 `npm run typecheck` 和 `npm run lint`。
- 涉及构建产物、参数、代理组、规则集或 YAML 生成时，运行 `npm run artifacts` 做全量验证。
- 只修改文档或知识库时，运行相关文件检查即可，避免无意义生成产物。
