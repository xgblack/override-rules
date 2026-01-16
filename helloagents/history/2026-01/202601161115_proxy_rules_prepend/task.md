# 任务清单: 前置自定义代理规则

目录: `helloagents/plan/202601161115_proxy_rules_prepend/`

---

## 1. 覆写脚本
- [√] 1.1 调整 `post_convert.js` 规则合并顺序，使 CUSTOM_PROXY_RULES 前置到 CUSTOM_DIRECT_RULES 之后

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录新顺序
- [√] 2.2 更新 `helloagents/CHANGELOG.md` 记录变更

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 手动验证：规则顺序符合 EXTRA → CUSTOM_DIRECT → CUSTOM_PROXY → 原始 rules → EXTRA_TAIL
