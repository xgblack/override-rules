# 技术设计: 移除广告拦截相关配置

## 技术方案
### 核心技术
- Node.js CommonJS 覆写脚本

### 实现要点
- 在 `post_convert.js` 中增加清理逻辑：
  - `rule-providers` 删除 `ADBlock` 与 `AdditionalFilter`。
  - `rules` 删除 `RULE-SET,ADBlock,广告拦截` 与 `RULE-SET,AdditionalFilter,广告拦截`。
  - `proxy-groups` 删除名为 `广告拦截` 的分组，并清理其他分组 `proxies` 中的引用。
- 与现有自定义分组逻辑兼容。

## 安全与性能
- **安全:** 不涉及外部输入或权限变更。
- **性能:** 线性过滤数组，开销可控。

## 测试与部署
- **测试:** 手动检查最终配置中不存在广告拦截相关 provider、规则与分组。
- **部署:** 与现有后置覆写脚本一起发布。
