# 任务清单: 兜底分组覆写脚本

目录: `helloagents/plan/202601192046_fallback_group/`

---

## 1. 兜底覆写脚本
- [√] 1.1 新增 `fallback_convert.js`，检测订阅为空/手动选择分组缺失或节点不足时插入兜底分组（DIRECT），保持幂等

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录兜底脚本与触发条件
- [√] 2.2 更新 `helloagents/wiki/arch.md` 补充覆写链路
- [√] 2.3 更新 `helloagents/CHANGELOG.md` 记录新增兜底覆写脚本
- [√] 2.4 更新 `helloagents/history/index.md` 添加方案包索引

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 确认无需执行自动化测试并记录原因
