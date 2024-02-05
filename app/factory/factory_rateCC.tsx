// '==========================================================================================================================================
// '*********************** RateCC Factory ***************************************************************************************************
// '==========================================================================================================================================

import { Type_RateCC } from "../classes/enums";
import { RateBlock } from "../classes/rateBlock";
import { RateCC } from "../classes/rateCC";
import { User } from "../classes/user";
import { key_w1, key_o1, key_t1, key_t2, key_t3, key_t4, key_k1, key_k2, key_k3, key_s1, key_s2, key_s3, key_s4 } from "../globalKeys";
import { CreateNewEmptyRatePartCC } from "./factory_ratePart";

export function CreateNewEmptyRateCC(coach: User, type: Type_RateCC) {

    let rateCC = new RateCC();

    rateCC.coach = coach;
    rateCC.dateRate = new Date().toLocaleDateString('en-CA');
    rateCC.typeRate = type;
    
    rateCC.wiedzaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_w1));
    rateCC.obslugaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_o1));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_t1));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_t2));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_t3));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_t4));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_k1));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_k2));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePartCC(key_k3));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePartCC(key_s1));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePartCC(key_s2));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePartCC(key_s3));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePartCC(key_s4));

    return rateCC;

}

export function getRateCC_Rate(rateCC: RateCC): number {

    let rate: number = 0;
    const rateBlockCol = new Array<RateBlock>(rateCC.wiedzaBlock, rateCC.obslugaBlock, rateCC.komunikacjaBlock, rateCC.standardBlock, rateCC.technikaBlock);

    rateBlockCol.forEach(block => {
        block.ratePart.forEach(part => {
            rate = rate + part.ocena * (part.waga / 100);
        })
    });

    rate = rate + (rateCC.extraScore / 100);
    rate = rate > 1 ? 1 : rate < 0 ? 0 : rate;

    return rate;

}

export function getRateCC_RateAs100(rateCC: RateCC): number {

    const rate = getRateCC_Rate(rateCC) * 100;
    return Math.round(rate);
}

