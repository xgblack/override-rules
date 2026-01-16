# 任务清单: 保留 EXTRA_RULES 功能

目录: `helloagents/plan/202601161038_keep_extra_rules/`

---

## 1. 覆写脚本
- [√] 1.1 在 `post_convert.js` 中恢复并保留 `EXTRA_RULES` 功能，保持规则插入顺序与幂等

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录 EXTRA_RULES 的插入位置与用途
- [√] 2.2 更新 `helloagents/CHANGELOG.md` 记录能力补充

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 手动验证：EXTRA_RULES 仍可前置生效，且不影响自定义分组规则
