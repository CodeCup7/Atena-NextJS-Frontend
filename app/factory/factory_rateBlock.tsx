// '==========================================================================================================================================
// '*********************** RateBlock Factory ************************************************************************************************
// '==========================================================================================================================================

import { RateBlock } from "../classes/rateBlock";

export function getRateBlock_Rate(rateBlock: RateBlock): number {

    let rate: number = 0;

    rateBlock.ratePart.forEach(e => {
        rate = rate + (e.ocena * (e.waga / 100))

    });
    return rate;

}

export function getRateBlock_RateAs100(rateBlock: RateBlock): number {
    const rate = getRateBlock_Rate(rateBlock) * 100;
    return Math.round(rate);
}