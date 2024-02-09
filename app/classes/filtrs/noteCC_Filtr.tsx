// '===============================================================
// '******************** Filtr NoteCC CLASS ***********************
// '===============================================================

import { Status_Note } from "../enums";
import { User } from "../user";

export class FiltrNoteCC {

    public id: number = 0;
    public status: Status_Note = Status_Note.ALL_;
    public coachDateStart: string = "";
    public coachDateEnd: string = "";
    public appliesDateStart: string = "";
    public appliesDateEnd: string = "";
    public zalecenia: string = "";
    public odwolanie: string = "";
    public allOdwolania: boolean = false;

    public userCol: Array<User> = [];
}
