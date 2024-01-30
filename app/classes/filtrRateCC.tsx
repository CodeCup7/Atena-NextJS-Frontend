// '===============================================================
// '******************** Filtr RateCC CLASS ***********************
// '===============================================================

import { Type_RateCC } from "./enums";
import { User } from "./user";

export class FiltrRateCC {

    public id: number = 0;
    public typeRate: Type_RateCC = Type_RateCC.ALL;
    public dateRateStart: string = "";
    public dateRateEnd: string = "";
    public dateCallStart: string = "";
    public dateCallEnd: string = "";
    public idCall: string = "";
    public rateStart: string = '';
    public rateEnd: string = '';
    public queueId: string = '0';

    public userCol: Array<User> = [];
}
