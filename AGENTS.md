# Repository Guidelines

## 项目结构与模块组织
- `convert.js` / `convert.min.js`: JS 覆写脚本（动态覆写与压缩版）。
- `yaml_generator/`: YAML 覆写生成器；`yamls/` 为生成结果目录（由 `npm run generate` 产出）。
- `ruleset/`: 规则列表与分流规则源；`icons/` 为图标资源。
- `auto_update.sh`: Linux 上自动更新配置的辅助脚本。

## 构建、测试与本地开发
- `npm install`: 安装依赖（仅 `yaml`）。
- `npm run generate`: 运行 `yaml_generator/generator.js` 生成 `yamls/` 下的配置文件。
- 无独立构建/打包命令；`convert.min.js` 为压缩版，变更 `convert.js` 时请保持一致。

## 编码风格与命名
- JavaScript 使用 CommonJS（`type: commonjs`），代码缩进为 4 空格，字符串以双引号为主。
- 生成文件命名遵循：`config_lb-{0|1}_landing-{0|1}_ipv6-{0|1}_full-{0|1}_keepalive-{0|1}_fakeip-{0|1}.yaml`。
- 新规则文件放在 `ruleset/`，保持名称语义清晰（如 `Crypto.list`）。

## 测试指南
- 当前未配置自动化测试框架；提交前至少运行 `npm run generate` 以验证生成流程。
- 如新增测试，请优先放在 `yaml_generator/` 对应模块旁并在文档补充运行方式。

## 提交与 PR 规范
- 历史提交常用前缀：`feat:`、`fix:`、`chore:`、`CI:`，也有简短的 `update readme`；建议延续该风格。
- PR 建议包含：变更摘要、影响范围（如 `ruleset/` 或 `yamls/`）、相关链接/Issue（如有）。

## 安全与配置提示
- `auto_update.sh` 会覆盖系统配置并重启服务，使用前请先设置 `CONFIG_URL` 并确认备份路径。
- 不要提交私有订阅链接或任何密钥。
