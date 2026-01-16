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
    FALLBACK: "故障转移",
    STATIC_RESOURCES: "静态资源"
};

const CUSTOM_GROUP_ICON = "https://gcore.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/select.png";

const AD_GROUP = "广告拦截";
const AD_RULE_PROVIDERS = new Set(["ADBlock", "AdditionalFilter"]);
const AD_RULES = new Set([
    "RULE-SET,ADBlock,广告拦截",
    "RULE-SET,AdditionalFilter,广告拦截"
]);

// =========================
// 可自定义区域（规则集规则文件）
// 说明:
// - 规则内容已迁移到 ruleset/*.list 文件中，文件只保留“规则类型,匹配值”。
// - 你只需要维护 ruleset 目录下的列表文件，不再维护脚本数组。
// - 规则集通过 rule-providers + RULE-SET 引用，策略由 RULE-SET 指定。
// =========================
const CUSTOM_RULESET_BASE_URL = "https://gh.xgblack.cool/https://raw.githubusercontent.com/xgblack/override-rules/refs/heads/dev/ruleset/";
const CUSTOM_RULESETS = {
    EXTRA_HEAD: { name: "ExtraHead", file: "ExtraHead.list", policy: "DIRECT" },
    CUSTOM_DIRECT: { name: "CustomDirect", file: "CustomDirect.list", policy: GROUPS.CUSTOM_DIRECT },
    CUSTOM_PROXY: { name: "CustomProxy", file: "CustomProxy.list", policy: GROUPS.CUSTOM_PROXY },
    EXTRA_TAIL: { name: "ExtraTail", file: "ExtraTail.list", policy: "DIRECT" }
};

// 去重工具: 保持顺序，移除空值与重复项。
function uniqueList(items) {
    const seen = new Set();
    return items.filter(item => {
        if (!item || seen.has(item)) return false;
        seen.add(item);
        return true;
    });
}

// 规则合并策略:
// 1) ExtraHead -> 最前置（DIRECT）
// 2) CustomDirect -> 前置（自定义直连）
// 3) CustomProxy -> 前置（自定义出国）
// 4) 原始 rules -> 中间
// 5) ExtraTail -> 最末尾（DIRECT）
//
// 幂等:
// - 会移除已存在的自定义 RULE-SET，避免重复插入。
function buildRules(rules) {
    const ruleSetRules = [
        CUSTOM_RULESETS.EXTRA_HEAD,
        CUSTOM_RULESETS.CUSTOM_DIRECT,
        CUSTOM_RULESETS.CUSTOM_PROXY,
        CUSTOM_RULESETS.EXTRA_TAIL
    ].map(item => `RULE-SET,${item.name},${item.policy}`);
    const ruleSetRuleSet = new Set(ruleSetRules);
    const currentRules = Array.isArray(rules) ? rules.slice() : [];
    const filteredRules = currentRules
        .filter(rule => !AD_RULES.has(rule))
        .filter(rule => !ruleSetRuleSet.has(rule));
    return [
        ruleSetRules[0],
        ruleSetRules[1],
        ruleSetRules[2],
        ...filteredRules,
        ruleSetRules[3]
    ];
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
    const proxyProxies = buildAiStyleProxyProxies(baseGroupNames);
    const fallbackProxyProxies = uniqueList([
        "DIRECT",
        GROUPS.SELECT,
        ...baseGroupNames,
        GROUPS.CUSTOM_DIRECT
    ]);
    const finalProxyProxies = proxyProxies.length > 1 ? proxyProxies : fallbackProxyProxies;

    return [
        {
            "name": GROUPS.CUSTOM_DIRECT,
            "icon": CUSTOM_GROUP_ICON,
            "type": "select",
            "proxies": directProxies
        },
        {
            "name": GROUPS.CUSTOM_PROXY,
            "icon": CUSTOM_GROUP_ICON,
            "type": "select",
            "proxies": finalProxyProxies
        }
    ];
}

// 参考 AI 分组实现逻辑构建“自定义出国”可选代理列表。
function buildAiStyleProxyProxies(baseGroupNames) {
    const lowCostGroup = "低倍率节点";
    const landingGroup = "落地节点";
    const hasSelect = baseGroupNames.includes(GROUPS.SELECT);
    const hasManual = baseGroupNames.includes(GROUPS.MANUAL);
    const hasLowCost = baseGroupNames.includes(lowCostGroup);
    const countryGroups = baseGroupNames.filter(name => {
        if (!name || !name.endsWith("节点")) return false;
        return name !== lowCostGroup && name !== landingGroup;
    });

    return uniqueList([
        hasSelect ? GROUPS.SELECT : null,
        ...countryGroups,
        hasLowCost ? lowCostGroup : null,
        hasManual ? GROUPS.MANUAL : null,
        "DIRECT"
    ]);
}

// 插入分组位置:
// - 默认插入到 “静态资源” 分组之后；
// - 如果找不到 “静态资源”，则插入到 “故障转移” 之后；
// - 如果仍找不到，则插入到 “手动选择” 之后；
// - 最后仍找不到才追加到末尾。
function buildProxyGroups(proxyGroups) {
    const groups = cleanProxyGroups(proxyGroups);
    const filteredGroups = groups.filter(group => {
        if (!group || !group.name) return false;
        return group.name !== GROUPS.CUSTOM_DIRECT && group.name !== GROUPS.CUSTOM_PROXY;
    });
    const baseGroupNames = filteredGroups.map(group => group.name);
    const customGroups = buildCustomGroups(baseGroupNames);
    const insertTargets = [
        GROUPS.STATIC_RESOURCES,
        GROUPS.FALLBACK,
        GROUPS.MANUAL
    ];
    const insertIndex = insertTargets
        .map(name => filteredGroups.findIndex(group => group.name === name))
        .find(index => index !== -1);
    const insertAt = typeof insertIndex === "number" && insertIndex >= 0
        ? insertIndex + 1
        : filteredGroups.length;
    filteredGroups.splice(insertAt, 0, ...customGroups);
    return filteredGroups;
}

function cleanRuleProviders(ruleProviders) {
    const providers = ruleProviders && typeof ruleProviders === "object" ? ruleProviders : {};
    const result = {};
    for (const [key, value] of Object.entries(providers)) {
        if (!AD_RULE_PROVIDERS.has(key)) {
            result[key] = value;
        }
    }
    return result;
}

function buildCustomRuleProviders() {
    const result = {};
    for (const item of Object.values(CUSTOM_RULESETS)) {
        result[item.name] = {
            type: "http",
            behavior: "classical",
            format: "text",
            interval: 86400,
            url: `${CUSTOM_RULESET_BASE_URL}${item.file}`,
            path: `./ruleset/${item.file}`
        };
    }
    return result;
}

function cleanProxyGroups(proxyGroups) {
    const groups = Array.isArray(proxyGroups) ? proxyGroups : [];
    return groups
        .filter(group => group && group.name && group.name !== AD_GROUP)
        .map(group => {
            if (!Array.isArray(group.proxies)) return group;
            const proxies = group.proxies.filter(name => name !== AD_GROUP);
            if (proxies.length === group.proxies.length) return group;
            return Object.assign({}, group, { proxies });
        });
}

function main(config) {
    const resultConfig = Object.assign({}, config);
    resultConfig["rule-providers"] = Object.assign(
        {},
        cleanRuleProviders(config && config["rule-providers"]),
        buildCustomRuleProviders()
    );
    resultConfig["proxy-groups"] = buildProxyGroups(config && config["proxy-groups"]);
    resultConfig.rules = buildRules(config && config.rules);
    return resultConfig;
}
