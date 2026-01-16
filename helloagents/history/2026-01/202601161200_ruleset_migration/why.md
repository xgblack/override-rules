# 变更提案: 自定义规则迁移至 ruleset

## 需求背景
当前自定义直连/出国与 EXTRA 规则通过脚本数组维护。需要迁移到 ruleset 文件，按规则集 provider 引用，便于维护与更新。

## 变更内容
1. 新增自定义 ruleset provider（CustomDirect/CustomProxy/ExtraHead/ExtraTail）。
2. 在脚本中改用 RULE-SET 引用这些规则集，并移除数组实现。
3. 新增 ruleset 列表文件并填充规则。

## 影响范围
- **模块:** convert（后置覆写脚本）
- **文件:** post_convert.js、ruleset/*.list
- **API:** 无
- **数据:** 无

## 核心场景

### 需求: ruleset 接入
**模块:** convert
自定义规则以 ruleset 方式加载并插入到规则链指定位置。

#### 场景: 规则顺序
规则顺序为 ExtraHead → CustomDirect → CustomProxy → 原始 rules → ExtraTail。

## 风险评估
- **风险:** URL 或文件名错误导致规则集加载失败。
- **缓解:** 统一使用给定 URL 前缀并保持文件名一致。
