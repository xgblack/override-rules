# 任务清单: 自定义规则迁移至 ruleset

目录: `helloagents/plan/202601161200_ruleset_migration/`

---

## 1. 覆写脚本
- [√] 1.1 在 `post_convert.js` 新增自定义 rule-providers
- [√] 1.2 规则合并逻辑改为插入 RULE-SET（ExtraHead/CustomDirect/CustomProxy/ExtraTail）
- [√] 1.3 移除脚本中的自定义规则数组（EXTRA/CUSTOM）

## 2. 规则集文件
- [√] 2.1 新增 `ruleset/ExtraHead.list` 并填充规则
- [√] 2.2 新增 `ruleset/CustomDirect.list` 并填充规则
- [√] 2.3 新增 `ruleset/CustomProxy.list` 并填充规则
- [√] 2.4 新增 `ruleset/ExtraTail.list`（可为空）

## 3. 文档更新
- [√] 3.1 更新 `helloagents/wiki/modules/convert.md` 记录 ruleset 迁移与文件路径
- [√] 3.2 更新 `helloagents/CHANGELOG.md` 记录变更

## 4. 安全检查
- [√] 4.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 5. 测试
- [√] 5.1 手动验证：rules 中 RULE-SET 顺序与 provider 一致
