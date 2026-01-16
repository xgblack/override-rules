# 任务清单: 后置覆写规则脚本

目录: `helloagents/plan/202601161021_post_override_rules/`

---

## 1. 覆写脚本
- [√] 1.1 在 `post_convert.js` 中实现后置覆写逻辑，验证 why.md#需求-规则前置覆写-场景-覆写后规则前置

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录新脚本与行为
- [√] 2.2 更新 `helloagents/CHANGELOG.md` 记录新增脚本

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 手动验证覆写结果：rules 头部包含 7 条指定规则且无重复
