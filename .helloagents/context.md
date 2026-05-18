# 项目上下文

## 概述
override-rules 为 Mihomo/Substore 提供覆写规则与生成工具。项目核心输出包括 JS 动态覆写脚本、面向不支持 JS 覆写客户端的 YAML 静态覆写文件，以及配套的规则集与图标资源。

本项目主要服务 powerfullz 的自用订阅覆写场景，同时接受 Issue/PR 形式的交流与贡献。默认优先满足个人体验优化。

## 技术栈
- 语言：TypeScript；运行时目标为 Node.js/CommonJS。
- 构建：`esbuild` 通过 `scripts/build.mjs` 生成 `convert.js` 和 `convert.min.js`。
- YAML 生成：`tsx scripts/yaml_generator/generator.ts` 加载构建后的 `convert.js`，批量生成 `yamls/*.yaml`。
- 类型检查：`tsgo --noEmit`。
- 代码质量：ESLint、Prettier、lint-staged、Husky。
- 主要运行依赖：`yaml`。

## 架构
源码驱动，所有核心逻辑在 TypeScript 源文件中维护，根目录 `convert.js`、`convert.min.js` 与 `yamls/` 是自动生成产物，不直接编辑。

核心数据流：
1. `src/main.ts` 读取外部脚本参数并构建功能开关。
2. `src/node_parser.ts` 按节点名称识别地区、低倍率节点与落地节点。
3. `src/selectors.ts` 根据功能开关和节点信息生成通用代理列表。
4. `src/proxy_groups.ts` 生成基础代理组、业务分流代理组和地区代理组。
5. `src/rule_providers.ts` 与 `src/rules.ts` 生成规则集来源和最终规则顺序。
6. `src/dns.ts` 与 `src/tun.ts` 生成 DNS、嗅探和 TUN 配置。
7. `scripts/build.mjs` 打包源码为 JS 产物；`scripts/yaml_generator/generator.ts` 复用构建产物生成静态 YAML。

## 领域语言
- **覆写脚本**：Substore/Mihomo 客户端加载的 JS 脚本；当前源码入口为 `src/main.ts`，构建产物为 `convert.js` / `convert.min.js`。
- **静态 YAML 覆写**：由生成器基于 fake proxies 和参数组合生成的 `yamls/*.yaml`；用于不能执行 JS 的客户端。
- **规则集**：`ruleset/*.list` 与远程规则源组成的 Mihomo rule-provider 输入。
- **代理组**：Mihomo `proxy-groups` 中的策略组；包括选择代理、手动选择、自动选择、故障转移、地区节点、业务分流组等。
- **地区节点**：按 `countriesMeta` 的正则和权重识别出的国家/地区分组，统一使用“{地区}节点”命名。
- **落地节点**：名称匹配家宽、商宽、星链或落地等关键词的节点；启用 `landing` 后会从普通地区组中排除。
- **低倍率节点**：名称匹配低倍率、省流、实验性或 `0.[0-5]` 的节点；用于静态资源等可节省流量场景。
- **正则过滤模式**：`regex=true` 时代理组使用 `include-all` + `filter`，由 Mihomo 运行时筛选节点；预生成 YAML 固定使用此模式。

## 目录结构
- `src/`：核心 TypeScript 源码。
- `src/main.ts`：动态覆写脚本入口，组装最终 Clash/Mihomo 配置。
- `src/args.ts`：脚本参数解析。
- `src/constants.ts`：代理组名称、地区元数据、节点匹配正则和 CDN 常量。
- `src/node_parser.ts`：订阅节点解析与地区/落地/低倍率分类。
- `src/selectors.ts`：各代理组共用的代理列表构建。
- `src/proxy_groups.ts`：代理组生成逻辑。
- `src/rule_providers.ts`：rule-provider 配置。
- `src/rules.ts`：最终规则列表构建。
- `src/dns.ts`：DNS 与嗅探配置。
- `src/tun.ts`：TUN 配置。
- `src/types.ts`：配置、参数、代理组等类型定义。
- `src/utils.ts`：布尔/数值解析、列表构建、节点正则工具。
- `scripts/build.mjs`：打包与压缩构建脚本。
- `scripts/yaml_generator/`：YAML 静态覆写生成器与 fake proxies 输入。
- `scripts/changelog.mjs`：版本发布时生成变更日志。
- `ruleset/`：本项目维护的规则列表。
- `icons/`：项目自有图标资源。
- `docs/`：自定义与贡献文档。
- `convert.js`、`convert.min.js`、`yamls/`：构建产物，禁止直接编辑。

## 模块文档
- [动态覆写核心](modules/convert.md)
- [YAML 生成器](modules/yaml-generator.md)
- [规则集资源](modules/ruleset.md)
- [构建与发布脚本](modules/build-release.md)
- [自动更新脚本](modules/auto-update.md)

## 最近变更
见 [CHANGELOG.md](CHANGELOG.md)
