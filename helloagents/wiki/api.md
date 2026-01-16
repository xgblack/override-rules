# API 手册

## 概述
本项目不提供网络服务 API，主要通过 JS 覆写脚本参数与本地生成脚本进行交互。

## 认证方式
不涉及认证。

## 接口列表

### JS 覆写脚本参数（convert.js）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| loadbalance | boolean | 否 | 启用负载均衡（url-test/load-balance） |
| landing | boolean | 否 | 启用落地节点功能 |
| ipv6 | boolean | 否 | 启用 IPv6 支持 |
| full | boolean | 否 | 生成完整配置（适合纯内核启动） |
| keepalive | boolean | 否 | 启用 TCP Keep Alive |
| fakeip | boolean | 否 | DNS 使用 FakeIP 模式 |
| quic | boolean | 否 | 允许 QUIC 流量（UDP 443） |
| threshold | number | 否 | 国家节点数量小于该值时不显示分组 |

### YAML 生成器（generator.js）

- **入口:** `npm run generate`
- **可选环境变量:** `LIMIT_COMBOS`（限制生成组合数量）
