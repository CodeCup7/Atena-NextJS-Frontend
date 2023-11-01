// '==================================================================
// '*********************** RateBlock CLASS ************************
// '==================================================================

import { RatePart } from "./ratePart";

export class RateBlock {

    private key: string = "";
    private ratePartCol: Array<RatePart> = [];

    constructor(key_: string) {
        this.$key = key_
    }

    public getRate(): number {

        let rate: number = 0;

        this.ratePartCol.forEach(e => {
            rate = rate + (e.$ocena * (e.$waga / 100))

        });
        return rate;

    }

    public getRateAs100(): number {
        const rate = this.getRate() * 100;
        return Math.round(rate);
    }


    /**
     * Getter $key
     * @return {string}
     */
    public get $key(): string {
        return this.key;
    }

    /**
     * Getter $ratePartCol
     * @return {Array<RatePart> }
     */
    public get $ratePartCol(): Array<RatePart> {
        return this.ratePartCol;
    }

    /**
     * Setter $key
     * @param {string} value
     */
    public set $key(value: string) {
        this.key = value;
    }

    /**
     * Setter $ratePartCol
     * @param {Array<RatePart> } value
     */
    public set $ratePartCol(value: Array<RatePart>) {
        this.ratePartCol = value;
    }


}
