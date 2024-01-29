// '===============================================================
// '******************** Filtr NoteCC CLASS ***********************
// '===============================================================

import { Rate_Mode, Status_Note } from "./enums";
import { RateCC } from "./rateCC";
import { RateM } from "./rateM";
import { User } from "./user";

export class FiltrNoteCC {

    public id: number = 0;
    public status: Status_Note = Status_Note.NO_START;
    public coachDateStart: string = ""
    public coachDateEnd: string = ""
    public appliesDateStart: string = ""
    public appliesDateEnd: string = ""
    public zalecenia: string = ""
    public odwolanie: string = ""

    public userCol: Array<User> = [];
}
