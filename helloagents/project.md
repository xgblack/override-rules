# 项目技术约定

## 技术栈
- **核心:** Node.js（CommonJS）
- **依赖:** yaml ^2.5.0
- **脚本:** Bash（`auto_update.sh`）

## 开发约定
- **代码规范:** JavaScript 使用 4 空格缩进，优先双引号，保持函数与常量命名清晰可读。
- **命名约定:** 生成文件遵循 `config_lb-{0|1}_landing-{0|1}_ipv6-{0|1}_full-{0|1}_keepalive-{0|1}_fakeip-{0|1}.yaml`。
- **配置一致性:** `convert.js` 与 `convert.min.js` 需保持功能同步。

## 错误与日志
- **生成器日志:** `yaml_generator/generator.js` 输出到标准输出。
- **更新脚本日志:** `auto_update.sh` 写入 `/var/log/mihomo_update.log`。

## 测试与流程
- **测试:** 当前无自动化测试框架，提交前至少执行 `npm run generate` 进行生成验证。
- **提交:** 常用前缀 `feat:`、`fix:`、`chore:`、`CI:`；简短动词式描述可接受（如 `update readme`）。
