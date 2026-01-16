# 任务清单: 自定义出国分组参考 AI 实现

目录: `helloagents/plan/202601161125_custom_proxy_ai_like/`

---

## 1. 覆写脚本
- [√] 1.1 在 `post_convert.js` 中调整“自定义出国”代理列表构建，参考 AI 分组逻辑并保留兜底

## 2. 文档更新
- [√] 2.1 更新 `helloagents/wiki/modules/convert.md` 记录 AI 风格构建逻辑
- [√] 2.2 更新 `helloagents/CHANGELOG.md` 记录变更

## 3. 安全检查
- [√] 3.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 4. 测试
- [√] 4.1 手动验证：自定义出国分组 proxies 符合 AI 风格顺序，无法匹配时回退兜底
