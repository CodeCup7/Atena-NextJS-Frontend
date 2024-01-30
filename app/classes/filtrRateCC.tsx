// '===============================================================
// '******************** Filtr RateCC CLASS ***********************
// '===============================================================

import { Type_RateCC } from "./enums";
import { User } from "./user";

export class FiltrRateCC {

    public id: number = 0;
    public typeRate: Type_RateCC = Type_RateCC.RATTING_;
    public dateRateStart: string = "";
    public dateRateEnd: string = "";
    public dateCallStart: string = "";
    public dateCallEnd: string = "";
    public idCall: string = "";
    public rate: number = 0;
    public queueId: number = 0;

    public userCol: Array<User> = [];
}
