# convert

## 目的
提供 JS 动态覆写脚本，基于订阅节点与参数生成代理组、规则与 DNS 配置。

## 模块概述
- **职责:** 参数解析、规则拼装、代理组生成、DNS 配置构建、输出配置对象。
- **状态:** ✅稳定
- **最后更新:** 2026-01-19

## 规范
### 需求: 参数一致性
**模块:** convert
确保 `convert.js` 与 `convert.min.js` 的参数列表与行为一致。

#### 场景: 新增参数
新增参数时需同步更新 README 与 `yaml_generator/generator.js` 的 FLAGS 列表。
- 预期结果：动态覆写与批量生成结果一致
- 预期结果：README 示例可用

### 需求: 后置覆写规则
**模块:** convert
使用 `post_convert.js` 在 `convert.js` 覆写完成后前置直连规则。

#### 场景: 规则头部前置
后置覆写脚本在 `rules` 列表头部插入指定规则，并确保幂等与原有顺序不变。

### 需求: 兜底覆写脚本
**模块:** convert
在 `convert.js` 与 `post_convert.js` 执行后追加 `fallback_convert.js`，用于订阅为空或手动选择分组异常时的兜底直连。

#### 场景: 兜底分组触发
当订阅为空、缺少 `手动选择` 分组，或该分组节点数小于等于 1 时，新增 `兜底分组`（仅 `DIRECT`）并保持幂等。

### 需求: 自定义分组与规则插入
**模块:** convert
新增 `自定义直连` 与 `自定义出国` 分组，且支持规则在头部/尾部插入。

#### 场景: 分组与规则位置
自定义分组插入优先级为：`静态资源` 之后 → `故障转移` 之后 → `手动选择` 之后 → 末尾；规则顺序为 `ExtraHead` → `CustomDirect` → `CustomProxy` → 原始 rules → `ExtraTail`，并保持幂等。

#### 场景: 自定义方式说明
自定义规则已迁移到 `ruleset/*.list` 文件中，仅保留“规则类型,匹配值”。对应文件为：`ruleset/ExtraHead.list`、`ruleset/CustomDirect.list`、`ruleset/CustomProxy.list`、`ruleset/ExtraTail.list`。脚本通过 rule-providers + RULE-SET 引用这些规则集。

#### 场景: 尾部规则数组
`ExtraTail` 规则集用于将规则插入到 `rules` 列表最末尾，适合作为兜底规则。

#### 场景: 移除广告拦截
后置覆写脚本会移除 `ADBlock` 与 `AdditionalFilter` 的 rule-providers、对应规则，以及 `广告拦截` 分组与其引用。

#### 场景: 自定义出国参考 AI 实现
“自定义出国”分组会参考 AI 分组的实现逻辑构建可选列表（选择代理 + 国家节点 + 低倍率节点 + 手动选择 + DIRECT）；当无法匹配时回退到原兜底逻辑。

#### 场景: 自定义分组图标
“自定义直连/自定义出国”分组使用统一图标 `select.png`，可在 `post_convert.js` 中调整。

## API接口
### SCRIPT 参数
**描述:** 以脚本参数控制覆写行为。详情见 `helloagents/wiki/api.md`。

## 数据模型
无持久化数据模型。

## 依赖
- `ruleset/` 规则列表
- `icons/` 图标资源

## 变更历史
- 暂无知识库内变更记录
