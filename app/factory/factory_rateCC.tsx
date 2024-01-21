// '==========================================================================================================================================
// '*********************** RateCC Factory ***************************************************************************************************
// '==========================================================================================================================================

import { Type_RateCC, Rate_Mode } from "../classes/enums";
import { Queue } from "../classes/queue";
import { RateBlock } from "../classes/rateBlock";
import { RateCC } from "../classes/rateCC";
import { RatePart } from "../classes/ratePart";
import { User } from "../classes/user";
import { getActiveUser } from "../global";
import { key_w1, key_o1, key_t1, key_t2, key_t3, key_t4, key_k1, key_k2, key_k3, key_s1, key_s2, key_s3, key_s4 } from "../globalKeys";
import { CreateNewEmptyRatePart } from "./factory_ratePart";

export function CreateNewEmptyRateCC(coach:User) {

    let rateCC = new RateCC();

    rateCC.coach = coach;
    rateCC.dateRate = new Date().toLocaleDateString('en-CA');

    rateCC.wiedzaBlock.ratePart.push(CreateNewEmptyRatePart(key_w1));
    rateCC.obslugaBlock.ratePart.push(CreateNewEmptyRatePart(key_o1));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t1));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t2));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t3));
    rateCC.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t4));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePart(key_k1));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePart(key_k2));
    rateCC.komunikacjaBlock.ratePart.push(CreateNewEmptyRatePart(key_k3));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s1));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s2));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s3));
    rateCC.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s4));

    rateCC.ratePart.push(...rateCC.wiedzaBlock.ratePart)
    rateCC.ratePart.push(...rateCC.komunikacjaBlock.ratePart)
    rateCC.ratePart.push(...rateCC.obslugaBlock.ratePart)
    rateCC.ratePart.push(...rateCC.standardBlock.ratePart)
    rateCC.ratePart.push(...rateCC.technikaBlock.ratePart)
    return rateCC;

}

export function getRateCC_Rate(rateCC:RateCC): number {

    let rate: number = 0;

    rateCC.ratePart.forEach(e => {
        rate = rate + e.ocena;
    });

    rate = rate + (rateCC.extraScore / 100);
    rate = rate > 1 ? 1 : rate < 0 ? 0 : rate;

    return rate;
}

export function getRateCC_RateAs100(rateCC:RateCC): number {

    const rate = getRateCC_Rate(rateCC) * 100;
    return Math.round(rate);
}

