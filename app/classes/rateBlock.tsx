// '==================================================================
// '*********************** RateBlock CLASS ************************
// '==================================================================

import { RatePart } from "./ratePart";


export class RateBlock {

    public id: number = 0;
    public key: string = "";
    public ratePart: Array<RatePart> = [];

    constructor(key_: string) {
        this.key = key_
    }

    public getRate(): number {

        let rate: number = 0;

        this.ratePart.forEach(e => {
            rate = rate + (e.ocena * (e.waga / 100))

        });
        return rate;

    }

    public getRateAs100(): number {
        const rate = this.getRate() * 100;
        return Math.round(rate);
    }

}
