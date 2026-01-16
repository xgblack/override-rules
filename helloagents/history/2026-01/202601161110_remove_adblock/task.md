# 任务清单: 移除广告拦截相关配置

目录: `helloagents/plan/202601161110_remove_adblock/`

---

## 1. 覆写脚本
- [√] 1.1 在 `post_convert.js` 中移除 ADBlock 与 AdditionalFilter 的 rule-providers
- [√] 1.2 在 `post_convert.js` 中移除广告拦截相关规则
- [√] 1.3 在 `post_convert.js` 中移除 `广告拦截` 分组并清理引用

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录广告拦截清理逻辑
- [√] 2.2 更新 `helloagents/CHANGELOG.md` 记录变更

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 手动验证：最终配置中无广告拦截相关 provider/规则/分组
