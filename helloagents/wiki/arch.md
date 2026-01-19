# 架构设计

## 总体架构
```mermaid
flowchart TD
    Ruleset[ruleset/*.list] --> Convert[convert.js]
    Params[订阅节点/脚本参数] --> Convert
    Convert --> PostConvert[post_convert.js]
    PostConvert --> Fallback[fallback_convert.js]
    Fallback --> Output[动态覆写配置]
    Fake[yaml_generator/fake_proxies.json] --> Generator[yaml_generator/generator.js]
    Generator --> Convert
    Generator --> Yamls[yamls/*.yaml]
```

## 技术栈
- **脚本:** Node.js（CommonJS）
- **数据:** 纯文件形式（规则列表、JSON、YAML）

## 核心流程
```mermaid
sequenceDiagram
    participant User as 用户/订阅
    participant Convert as convert.js
    participant Post as post_convert.js
    participant Fallback as fallback_convert.js
    participant Gen as generator.js
    User->>Convert: 传入参数与节点信息
    Convert->>Post: 输出初始配置
    Post->>Fallback: 追加后置覆写
    Fallback-->>User: 返回动态覆写配置
    Gen->>Convert: 组合参数并执行
    Convert-->>Gen: 生成配置对象
    Gen-->>User: 输出 yamls/*.yaml
```

## 重大架构决策
完整的 ADR 存储在各变更的 how.md 中，本章节提供索引。

| adr_id | title | date | status | affected_modules | details |
|--------|-------|------|--------|------------------|---------|
| ADR-000 | 暂无重大架构决策 | 2026-01-03 | ✅已采纳 | - | - |
