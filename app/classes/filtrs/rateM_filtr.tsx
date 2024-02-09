// '===============================================================
// '******************** Filtr RateM CLASS ************************
// '===============================================================

import { User } from "../user";

export class FiltrRateM {

    public id: number = 0;
    public dateRateStart: string = "";
    public dateRateEnd: string = "";
    public rateStart: string = '';
    public rateEnd: string = '';

    public userCol: Array<User> = [];
}
