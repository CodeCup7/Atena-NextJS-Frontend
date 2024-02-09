// '===============================================================
// '*********************** FinalScore CLASS **********************
// '===============================================================

import { getNoteCC_Rate } from "../factory/factory_noteCC";
import { Feedback } from "./feedback";
import { NoteCC } from "./noteCC";
import { RateCC } from "./rateCC";
import { RateM } from "./rateM";
import { Test } from "./test";

export class FinalScore {

    public startDate: string = ""
    public endDate: string = ""
    public noteList: Array<NoteCC> = [];
    public rateCCList: Array<RateCC> = [];
    public mysteryList: Array<RateCC> = [];
    public rateMList: Array<RateM> = [];
    public testList: Array<Test> = [];
    public feedbackList: Array<Feedback> = [];

    public finalScore = 0;

}

