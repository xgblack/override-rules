# yaml-generator

## 目的
批量生成 YAML 覆写配置，用于不支持 JS 覆写的客户端。

## 模块概述
- **职责:** 读取 `fake_proxies.json`，加载 `convert.js` 并遍历参数组合生成 `yamls/` 输出。
- **状态:** ✅稳定
- **最后更新:** 2026-01-03

## 规范
### 需求: 组合输出稳定
**模块:** yaml-generator
生成的文件命名与组合顺序必须与 FLAGS 列表保持一致。

#### 场景: 增加/删除参数
同步修改 FLAGS 与文件命名规则，并更新 README。
- 预期结果：生成文件命名与说明一致
- 预期结果：旧文件可被正确清理

## API接口
### CLI
**描述:** `npm run generate` 运行生成器脚本。

## 数据模型
- 输入：`yaml_generator/fake_proxies.json`
- 输出：`yamls/*.yaml`

## 依赖
- `convert.js`
- `yaml` 依赖库

## 变更历史
- 暂无知识库内变更记录
