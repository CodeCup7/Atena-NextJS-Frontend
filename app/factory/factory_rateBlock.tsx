import { RateBlock } from "../classes/rateBlock";

export function getRateBlock(rateBlock: RateBlock): number {

    let rate: number = 0;
    
    rateBlock.$ratePartCol.forEach(e => {
        rate = rate + (e.$ocena * (e.$waga / 100))

    });
    return rate;

}

export function getRateBlockAs100(rateBlock: RateBlock): number {
    const rate = getRateBlock(rateBlock) * 100;
    return Math.round(rate);
}