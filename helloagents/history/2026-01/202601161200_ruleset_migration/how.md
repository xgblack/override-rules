# 技术设计: 自定义规则迁移至 ruleset

## 技术方案
### 核心技术
- Node.js CommonJS 覆写脚本
- Clash/Mihomo rule-providers

### 实现要点
- 新增 `rule-providers` 条目（CustomDirect/CustomProxy/ExtraHead/ExtraTail），使用提供的 URL 前缀。
- 将 `EXTRA_RULES`/`EXTRA_TAIL_RULES`/`CUSTOM_DIRECT_RULES`/`CUSTOM_PROXY_RULES` 替换为 RULE-SET 规则插入。
- 新增 `ruleset/*.list` 文件，仅包含“规则类型,匹配值”。
- 保持规则顺序：ExtraHead → CustomDirect → CustomProxy → 原始 rules → ExtraTail。

## 安全与性能
- **安全:** 仅新增规则集引用。
- **性能:** 规则集加载交由内核处理。

## 测试与部署
- **测试:** 手动检查最终 rules 中 RULE-SET 顺序与 provider 是否存在。
- **部署:** 上传 ruleset 文件并确保 URL 可访问。
