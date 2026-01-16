# 变更提案: 前置自定义代理规则

## 需求背景
当前规则合并顺序为 EXTRA → CUSTOM_DIRECT → 原始 rules → CUSTOM_PROXY → EXTRA_TAIL。需要将自定义代理规则前置到自定义直连规则之后。

## 变更内容
1. 调整规则合并顺序为：EXTRA → CUSTOM_DIRECT → CUSTOM_PROXY → 原始 rules → EXTRA_TAIL。
2. 保持去重逻辑与其余规则顺序不变。

## 影响范围
- **模块:** convert（后置覆写脚本）
- **文件:** post_convert.js
- **API:** 无
- **数据:** 无

## 核心场景

### 需求: 前置代理规则
**模块:** convert
自定义代理规则应在原始 rules 之前生效。

#### 场景: 顺序调整
规则顺序从“代理后置”调整为“代理前置”。

## 风险评估
- **风险:** 顺序变化导致规则优先级变化。
- **缓解:** 按用户指定顺序调整。
