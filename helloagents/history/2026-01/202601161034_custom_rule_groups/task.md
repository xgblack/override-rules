# 任务清单: 自定义规则分组与规则插入

目录: `helloagents/plan/202601161034_custom_rule_groups/`

---

## 1. 覆写脚本
- [√] 1.1 在 `post_convert.js` 中新增自定义分组，并在 `rules` 头尾插入规则数组

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录新分组与规则插入方式
- [√] 2.2 更新 `helloagents/CHANGELOG.md` 记录新增能力

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 手动验证：新增分组位于“静态资源”之后，规则按前置/后置插入且无重复
