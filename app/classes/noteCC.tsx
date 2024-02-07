// '===============================================================
// '*********************** NoteCC CLASS **************************
// '===============================================================

import { Rate_Mode, Status_Note } from "./enums";
import { RateCC } from "./rateCC";
import { RateM } from "./rateM";
import { User } from "./user";

export class NoteCC {

    public id: number = 0;
    public status: Status_Note = Status_Note.NO_START;
    public agent: User = new User();
    public coach: User = new User();
    public coachDate: string = ""
    public appliesDate: string = ""
    public zalecenia: string = ""
    public odwolanie: string = ""

    public rateCC_Col: Array<RateCC> = [];
    public rateM_Col: Array<RateM> = [];
    public mode: Rate_Mode = Rate_Mode.NEW_;


}
