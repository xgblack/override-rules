import { baseRules } from "./constants";

export function buildRules({ quicEnabled }: { quicEnabled: boolean }): string[] {
    const ruleList = [...baseRules];
    if (!quicEnabled) {
        ruleList.unshift("AND,((DST-PORT,443),(NETWORK,UDP)),REJECT");
    }
    return ruleList;
}
