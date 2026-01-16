/*
后置覆写脚本：在 convert.js 生成结果上追加规则，避免直接修改 convert.js。
用途：将指定直连规则插入 rules 列表最前面，并保持幂等。
*/

const EXTRA_RULES = [
    "DOMAIN-SUFFIX,cn.bing.com,DIRECT",
    "DOMAIN-SUFFIX,gov.cn,DIRECT",
    "DOMAIN-SUFFIX,cool-code.com,DIRECT",
    "DOMAIN-SUFFIX,coolstudio.tech,DIRECT",
    "DOMAIN-SUFFIX,xgblack.com,DIRECT",
    "DOMAIN-SUFFIX,xgblack.cn,DIRECT",
    "DOMAIN-SUFFIX,xgblack.cool,DIRECT"
];

const EXTRA_RULE_SET = new Set(EXTRA_RULES);

function buildRules(rules) {
    const currentRules = Array.isArray(rules) ? rules.slice() : [];
    const filteredRules = currentRules.filter(rule => !EXTRA_RULE_SET.has(rule));
    return [...EXTRA_RULES, ...filteredRules];
}

function main(config) {
    const resultConfig = Object.assign({}, config);
    resultConfig.rules = buildRules(config && config.rules);
    return resultConfig;
}
