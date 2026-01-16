# override-rules

> 本文件包含项目级别的核心信息。详细的模块文档见 `modules/` 目录。

## 1. 项目概述

### 目标与背景
提供面向 Mihomo/Substore 的覆写规则与生成工具，核心输出为 JS 动态覆写脚本与 YAML 覆写文件。

### 范围
- **范围内:** 覆写规则维护、规则集整理、YAML 生成脚本与输出产物。
- **范围外:** 客户端配置管理、订阅服务端实现、代理服务运维。

### 干系人
- **负责人:** powerfullz

## 2. 模块索引

| 模块名称 | 职责 | 状态 | 文档 |
|---------|------|------|------|
| convert | JS 动态覆写脚本与参数解析 | ✅稳定 | [modules/convert.md](modules/convert.md) |
| yaml-generator | YAML 批量生成与组合管理 | ✅稳定 | [modules/yaml-generator.md](modules/yaml-generator.md) |
| ruleset | 规则列表与图标资源维护 | ✅稳定 | [modules/ruleset.md](modules/ruleset.md) |
| auto-update | 本地自动更新脚本 | ✅稳定 | [modules/auto-update.md](modules/auto-update.md) |

## 3. 快速链接
- [技术约定](../project.md)
- [架构设计](arch.md)
- [API 手册](api.md)
- [数据模型](data.md)
- [变更历史](../history/index.md)
