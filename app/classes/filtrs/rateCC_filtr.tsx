// '===============================================================
// '******************** Filtr RateCC CLASS ***********************
// '===============================================================

import { Type_RateCC } from "../enums";
import { NoteCC } from "../rates/noteCC";
import { User } from "../user";

export class FiltrRateCC {

    public id: number = 0;
    public noteCC: NoteCC = new NoteCC();;
    public typeRate: Type_RateCC = Type_RateCC.ALL_;
    public dateRateStart: string = "";
    public dateRateEnd: string = "";
    public dateCallStart: string = "";
    public dateCallEnd: string = "";
    public idCall: string = "";
    public rateStart: string = '0';
    public rateEnd: string = '';
    public queueId: string = '0';

    public userCol: Array<User> = [];
}
