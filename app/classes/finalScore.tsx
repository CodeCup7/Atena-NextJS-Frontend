// '===============================================================
// '*********************** FINALSCORE CLASS **********************
// '===============================================================
import { getNoteCC_Rate } from "../factory/factory_noteCC";
import { Feedback } from "./feedback";
import { NoteCC } from "./rates/noteCC";
import { RateCC } from "./rates/rateCC";
import { RateM } from "./rates/rateM";
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

