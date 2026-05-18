# 模块: YAML 生成器

## 用途
批量生成静态 YAML 覆写配置，用于不支持执行 JS 覆写脚本的客户端。

## 关键文件
- `scripts/yaml_generator/generator.ts`：生成器入口，加载 `convert.js`，遍历布尔参数组合并输出 YAML。
- `scripts/yaml_generator/fake_proxies.json`：生成静态 YAML 时使用的模拟订阅节点输入。
- `yamls/`：生成输出目录，属于构建产物，不直接编辑。
- `convert.js`：生成器加载的动态覆写构建产物，运行前需先执行 `npm run build`。

## 依赖
- 依赖 `yaml` 包序列化配置。
- 依赖 Node.js `vm` 执行构建后的 `convert.js`。
- 依赖 `src/main.ts` 暴露到 `globalThis.main` 的主函数。
- `npm run artifacts` 会先运行 `npm run build`，再运行 `npm run generate`。

## 经验
- 预生成 YAML 固定注入 `{ regex: true }`，即静态 YAML 使用正则过滤模式。
- `LIMIT_COMBOS` 可限制生成前 N 个参数组合，适合快速本地验证。
- 修改 `FLAGS` 后必须同步 `FLAG_SHORT_NAMES`、README 的 YAML 文件名格式，以及旧文件清理逻辑。
- 生成器会清理不符合当前命名模式的旧 `config_*.yaml`，避免参数变更后遗留旧产物。
