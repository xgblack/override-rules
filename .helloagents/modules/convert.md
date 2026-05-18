# 模块: 动态覆写核心

## 用途
基于订阅节点和脚本参数生成 Mihomo/Substore 动态覆写配置，输出代理组、规则、DNS、嗅探、TUN 与 GeoX 资源地址。

## 关键文件
- `src/main.ts`：主入口，读取 `$arguments`，组装最终配置对象并暴露 `main(config)`。
- `src/args.ts`：解析 `loadbalance`、`landing`、`ipv6`、`full`、`keepalive`、`fakeip`、`quic`、`regex`、`tun`、`threshold`。
- `src/constants.ts`：代理组名称、地区元数据、落地/低倍率节点匹配规则。
- `src/node_parser.ts`：按订阅节点名称识别地区节点、落地节点和低倍率节点。
- `src/selectors.ts`：构建默认选择列表、直连优先列表、故障转移列表和前置代理列表。
- `src/proxy_groups.ts`：生成基础代理组、业务分流组、地区代理组、GLOBAL 组。
- `src/rules.ts`：维护最终规则顺序，默认在 `quic=false` 时前置 UDP 443 拒绝规则。
- `src/rule_providers.ts`：维护远程和本仓库规则集来源。
- `src/dns.ts`：生成 fake-ip/redir-host DNS 配置与 sniffer 配置。
- `src/tun.ts`：生成 gvisor TUN 配置。
- `src/types.ts`、`src/utils.ts`：类型与工具函数。

## 依赖
- 依赖 `ruleset/` 和远程规则源作为 rule-provider 输入。
- 依赖 `icons/` 和 CDN 图标 URL 作为代理组图标。
- 依赖 `scripts/build.mjs` 将 TypeScript 打包为 `convert.js` / `convert.min.js`。

## 经验
- 新增或修改脚本参数时，必须同步 `src/args.ts`、`src/types.ts`、`src/main.ts` 顶部说明、`README.md` 参数说明；若影响静态 YAML，还要同步 `scripts/yaml_generator/generator.ts` 的 `FLAGS` / `FLAG_SHORT_NAMES` 与文件名说明。
- 地区分组顺序由 `countriesMeta` 的 `weight` 控制，未设置权重的地区会排在已设置权重之后。
- `landing=true` 会把落地节点从普通地区节点里排除，并额外生成“前置代理”和“落地节点”代理组。
- `regex=true` 时不要假设脚本执行期能枚举单节点；代理组会交给 Mihomo 用 `include-all` 和 `filter` 运行时筛选。
- `fakeip` 默认值为 `true`，显式传 `false` 才切换为 `redir-host`。
