/*
后置覆写脚本：在 convert.js 生成结果上追加分组与规则，避免直接修改 convert.js。
用途：新增自定义分组，并支持规则在头部/尾部插入且幂等。
*/

// =========================
// 可自定义区域（分组名称）
// 说明:
// - 这些名称必须与 convert.js 生成的分组名称保持一致，否则规则无法命中目标分组。
// - 如果你在 convert.js 中改了分组名，请同步更新这里。
// - CUSTOM_DIRECT/CUSTOM_PROXY 是本脚本新增分组的名称，可自由修改。
// =========================
const GROUPS = {
    CUSTOM_DIRECT: "自定义直连",
    CUSTOM_PROXY: "自定义出国",
    SELECT: "选择代理",
    MANUAL: "手动选择",
    STATIC_RESOURCES: "静态资源"
};

// =========================
// 可自定义区域（EXTRA_RULES）
// 作用:
// - 保留旧版 EXTRA_RULES 直连前置能力；
// - 这些规则会始终插入 rules 列表最前面。
//
// 规则格式:
// - 推荐完整格式: "规则类型,匹配值,策略"
//   例如: "DOMAIN-SUFFIX,example.com,DIRECT"
// - 也可以使用省略策略的格式: "规则类型,匹配值"
//   例如: "DOMAIN-SUFFIX,example.com"
//   省略策略时，本脚本会自动补上 "DIRECT"。
//
// 支持的规则类型示例（按 Clash/Mihomo 规则语法）:
// - DOMAIN,example.com
// - DOMAIN-SUFFIX,example.com
// - DOMAIN-KEYWORD,example
// - IP-CIDR,1.2.3.0/24
// - IP-CIDR6,2001:db8::/32
// - GEOIP,CN
// - GEOSITE,GOOGLE
//
// 注意事项:
// - 本脚本不会校验规则语法是否正确，写错将导致规则无效。
// - 若需要 no-resolve 等额外参数，请写成完整格式:
//   "IP-CIDR,1.2.3.0/24,DIRECT,no-resolve"
// =========================
const EXTRA_RULES = [
    // "DOMAIN-SUFFIX,cn.bing.com,DIRECT",
    // "DOMAIN-SUFFIX,gov.cn,DIRECT",
    // "DOMAIN-SUFFIX,cool-code.com,DIRECT",
    // "DOMAIN-SUFFIX,coolstudio.tech,DIRECT",
    // "DOMAIN-SUFFIX,xgblack.com,DIRECT",
    // "DOMAIN-SUFFIX,xgblack.cn,DIRECT",
    // "DOMAIN-SUFFIX,xgblack.cool,DIRECT"
];

// =========================
// 可自定义区域（EXTRA_TAIL_RULES）
// 作用:
// - 这些规则会插入 rules 列表最末尾（所有规则之后）。
//
// 规则格式:
// - 推荐完整格式: "规则类型,匹配值,策略"
//   例如: "DOMAIN-SUFFIX,example.com,DIRECT"
// - 也可以使用省略策略的格式: "规则类型,匹配值"
//   例如: "DOMAIN-SUFFIX,example.com"
//   省略策略时，本脚本会自动补上 "DIRECT"。
//
// 注意事项:
// - 末尾规则优先级最低，适合放兜底类规则。
// - 仍然会执行去重，避免重复插入。
// =========================
const EXTRA_TAIL_RULES = [
    // "DOMAIN-SUFFIX,example-tail.com"
];

// =========================
// 可自定义区域（CUSTOM_DIRECT_RULES）
// 作用:
// - 写入“自定义直连”分组的规则列表；
// - 这些规则会插入到 EXTRA_RULES 之后、原始 rules 之前。
//
// 规则格式:
// - 完整格式: "规则类型,匹配值,自定义直连"
//   例如: "DOMAIN-SUFFIX,example.cn,自定义直连"
// - 省略策略格式: "规则类型,匹配值"
//   例如: "DOMAIN-SUFFIX,example.cn"
//   省略策略时会自动补上 "自定义直连"。
//
// 建议:
// - 这里适合放国内直连域名；
// - 避免与 EXTRA_RULES 重复，否则会被去重。
// =========================
const CUSTOM_DIRECT_RULES = [
    // "DOMAIN-SUFFIX,example.cn"
];

// =========================
// 可自定义区域（CUSTOM_PROXY_RULES）
// 作用:
// - 写入“自定义出国”分组的规则列表；
// - 这些规则会插入到 rules 列表末尾（原始 rules 之后）。
//
// 规则格式:
// - 完整格式: "规则类型,匹配值,自定义出国"
//   例如: "DOMAIN-SUFFIX,example.com,自定义出国"
// - 省略策略格式: "规则类型,匹配值"
//   例如: "DOMAIN-SUFFIX,example.com"
//   省略策略时会自动补上 "自定义出国"。
//
// 建议:
// - 这里适合放需要代理的域名；
// - 若希望优先于原规则生效，请改放到 CUSTOM_DIRECT_RULES，
//   或自行调整插入顺序（见 buildRules）。
// =========================
const CUSTOM_PROXY_RULES = [
    // "DOMAIN-SUFFIX,example.com"
];

// 去重工具: 保持顺序，移除空值与重复项。
function uniqueList(items) {
    const seen = new Set();
    return items.filter(item => {
        if (!item || seen.has(item)) return false;
        seen.add(item);
        return true;
    });
}

// 规则标准化:
// - 若已包含策略（至少 3 段），保持原样；
// - 若省略策略，则补上 targetGroup。
// - 规则为空或非字符串则返回 null。
function normalizeRule(rule, targetGroup) {
    if (typeof rule !== "string") return null;
    const trimmed = rule.trim();
    if (!trimmed) return null;
    const parts = trimmed.split(",");
    if (parts.length >= 3) return trimmed;
    return `${trimmed},${targetGroup}`;
}

// 根据规则列表与默认目标分组生成规则条目。
function buildRuleEntries(rules, targetGroup) {
    return (Array.isArray(rules) ? rules : [])
        .map(rule => normalizeRule(rule, targetGroup))
        .filter(Boolean);
}

// 规则合并策略:
// 1) EXTRA_RULES -> 最前置（直连优先）
// 2) CUSTOM_DIRECT_RULES -> 前置（在 EXTRA_RULES 之后）
// 3) 原始 rules -> 中间
// 4) CUSTOM_PROXY_RULES -> 后置
// 5) EXTRA_TAIL_RULES -> 最末尾
//
// 幂等:
// - 会去重 EXTRA/CUSTOM 规则，避免重复插入。
function buildRules(rules) {
    const extraRules = buildRuleEntries(EXTRA_RULES, "DIRECT");
    const prependRules = buildRuleEntries(CUSTOM_DIRECT_RULES, GROUPS.CUSTOM_DIRECT);
    const appendRules = buildRuleEntries(CUSTOM_PROXY_RULES, GROUPS.CUSTOM_PROXY);
    const tailRules = buildRuleEntries(EXTRA_TAIL_RULES, "DIRECT");
    const allCustomRules = uniqueList([...extraRules, ...prependRules, ...appendRules, ...tailRules]);
    const extraRuleSet = new Set(allCustomRules);
    const currentRules = Array.isArray(rules) ? rules.slice() : [];
    const filteredRules = currentRules.filter(rule => !extraRuleSet.has(rule));
    return [...extraRules, ...prependRules, ...filteredRules, ...appendRules, ...tailRules];
}

// 构建自定义分组:
// - 自定义直连: 可选 DIRECT/选择代理/手动选择
// - 自定义出国: 可选 DIRECT/选择代理/所有现有分组/自定义直连
function buildCustomGroups(baseGroupNames) {
    const directProxies = uniqueList([
        "DIRECT",
        GROUPS.SELECT,
        GROUPS.MANUAL
    ]);
    const proxyProxies = uniqueList([
        "DIRECT",
        GROUPS.SELECT,
        ...baseGroupNames,
        GROUPS.CUSTOM_DIRECT
    ]);

    return [
        {
            "name": GROUPS.CUSTOM_DIRECT,
            "type": "select",
            "proxies": directProxies
        },
        {
            "name": GROUPS.CUSTOM_PROXY,
            "type": "select",
            "proxies": proxyProxies
        }
    ];
}

// 插入分组位置:
// - 默认插入到 “静态资源” 分组之后；
// - 如果找不到 “静态资源”，则追加到末尾。
function buildProxyGroups(proxyGroups) {
    const groups = Array.isArray(proxyGroups) ? proxyGroups.slice() : [];
    const filteredGroups = groups.filter(group => {
        if (!group || !group.name) return false;
        return group.name !== GROUPS.CUSTOM_DIRECT && group.name !== GROUPS.CUSTOM_PROXY;
    });
    const baseGroupNames = filteredGroups.map(group => group.name);
    const customGroups = buildCustomGroups(baseGroupNames);
    const insertIndex = filteredGroups.findIndex(group => group.name === GROUPS.STATIC_RESOURCES);
    const insertAt = insertIndex === -1 ? filteredGroups.length : insertIndex + 1;
    filteredGroups.splice(insertAt, 0, ...customGroups);
    return filteredGroups;
}

function main(config) {
    const resultConfig = Object.assign({}, config);
    resultConfig["proxy-groups"] = buildProxyGroups(config && config["proxy-groups"]);
    resultConfig.rules = buildRules(config && config.rules);
    return resultConfig;
}
