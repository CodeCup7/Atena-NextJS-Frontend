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



}
