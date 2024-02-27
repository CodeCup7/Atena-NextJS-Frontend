// '==========================================================================================================================================
// '*********************** RateM Factory ***************************************************************************************************
// '==========================================================================================================================================
import { Type_Rate } from "../classes/enums";
import { RateBlock } from "../classes/rates/rateBlock";
import { RateM } from "../classes/rates/rateM";
import { User } from "../classes/user";
import { key_w1, key_o1, key_t1, key_t2, key_t3, key_t4, key_k1, key_k2, key_k3, key_s1, key_s2, key_s3, key_s4 } from "../globalKeys";
import { CreateNewEmptyRatePart } from "./factory_ratePart";

export function CreateNewEmptyRateM(coach: User) {

    let rateM = new RateM();

    rateM.coach = coach;
    rateM.dateRate = new Date().toLocaleDateString('en-CA');

    rateM.wiedzaBlock.ratePart.push(CreateNewEmptyRatePart(key_w1, Type_Rate.M_));
    rateM.obslugaBlock.ratePart.push(CreateNewEmptyRatePart(key_o1, Type_Rate.M_));
    rateM.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t1, Type_Rate.M_));
    rateM.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t2, Type_Rate.M_));
    rateM.technikaBlock.ratePart.push(CreateNewEmptyRatePart(key_t3, Type_Rate.M_));
    rateM.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s1, Type_Rate.M_));
    rateM.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s2, Type_Rate.M_));
    rateM.standardBlock.ratePart.push(CreateNewEmptyRatePart(key_s3, Type_Rate.M_));

    return rateM;

}

export function getRateM_Rate(rateM: RateM): number {

    let rate: number = 0;
    const rateBlockCol = new Array<RateBlock>(rateM.wiedzaBlock, rateM.obslugaBlock, rateM.standardBlock, rateM.technikaBlock);

    rateBlockCol.forEach(block => {
        block.ratePart.forEach(part => {
            rate = rate + part.ocena * (part.waga / 100);
        })
    });

    rate = rate + (rateM.extraScore / 100);
    rate = rate > 1 ? 1 : rate < 0 ? 0 : rate;

    return rate;

}

export function getRateM_RateAs100(rateM: RateM): number {

    const rate = getRateM_Rate(rateM) * 100;
    return Math.round(rate);
}

