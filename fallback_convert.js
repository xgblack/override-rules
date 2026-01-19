/*
兜底覆写脚本：在 convert.js 与 post_convert.js 之后执行。
用途：当订阅为空或手动选择分组节点不足时，追加仅 DIRECT 的兜底分组。
*/

const FALLBACK_GROUP = "兜底分组";
const MANUAL_GROUP = "手动选择";
const DIRECT_NAME = "DIRECT";
const FALLBACK_ICON = "https://gcore.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png";

function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}

function countManualGroupNodes(manualGroup, proxyCount) {
    if (!manualGroup) return 0;
    if (manualGroup["include-all"]) return proxyCount;
    const proxies = normalizeArray(manualGroup.proxies).filter(Boolean);
    return proxies.length;
}

function shouldApplyFallback(config) {
    const proxies = normalizeArray(config && config.proxies);
    const proxyCount = proxies.length;
    if (proxyCount === 0) return true;

    const groups = normalizeArray(config && config["proxy-groups"]);
    const manualGroup = groups.find(group => group && group.name === MANUAL_GROUP);
    if (!manualGroup) return true;

    const manualCount = countManualGroupNodes(manualGroup, proxyCount);
    return manualCount <= 1;
}

function upsertFallbackGroup(proxyGroups) {
    const groups = normalizeArray(proxyGroups).slice();
    const fallbackGroup = {
        "name": FALLBACK_GROUP,
        "icon": FALLBACK_ICON,
        "type": "select",
        "proxies": [DIRECT_NAME]
    };
    const index = groups.findIndex(group => group && group.name === FALLBACK_GROUP);
    if (index >= 0) {
        groups[index] = Object.assign({}, groups[index], fallbackGroup);
        return groups;
    }
    groups.unshift(fallbackGroup);
    return groups;
}

function main(config) {
    const resultConfig = Object.assign({}, config);
    if (!shouldApplyFallback(config)) return resultConfig;

    resultConfig["proxy-groups"] = upsertFallbackGroup(config && config["proxy-groups"]);
    return resultConfig;
}
