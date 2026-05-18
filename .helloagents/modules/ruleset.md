# 模块: 规则集资源

## 用途
维护项目自有规则列表与图标资源，为动态覆写和静态 YAML 提供可复用的分流规则来源。

## 关键文件
- `ruleset/*.list`：本项目维护的规则文本列表，一行一条规则。
- `icons/`：本项目自有代理组图标。
- `src/rule_providers.ts`：把本地规则集发布 URL 和第三方规则源注册为 Mihomo rule-provider。
- `src/rules.ts`：把 rule-provider 绑定到目标代理组并定义规则顺序。
- `src/constants.ts`：定义与规则对应的业务代理组名称。

## 依赖
- 依赖 GitHub/jsDelivr 发布路径，当前本仓库规则 URL 多数使用 `https://cdn.jsdelivr.net/gh/powerfullz/override-rules@master/ruleset/...`。
- 依赖 SukkaW、217heidai、Loyalsoldier 等第三方规则与 GeoSite/GeoIP 数据源。
- 规则集新增后通常需要同步 README 或 docs，说明用途和目标代理组。

## 经验
- `ruleset/CustomDirect.list` 包含用户指定的 `10.102.0.0/16`，以及常用 IPv4 私有地址、CGNAT、本地回环、链路本地和 IPv6 ULA/链路本地直连规则。
- 新增规则集时，要同步 `src/rule_providers.ts` 和 `src/rules.ts`；只新增文件但不注册不会生效。
- 规则文件保持一行一条规则，避免无意义空行和重复规则。
- 默认规则中 `GEOIP,private` 会优先直连；QUIC 默认通过 `AND,((DST-PORT,443),(NETWORK,UDP)),REJECT` 拦截，除非 `quic=true`。
