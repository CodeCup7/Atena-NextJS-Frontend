// '==========================================================================================================================================
// '*********************** NoteCC Factory ***************************************************************************************************
// '==========================================================================================================================================
import { Rate_Mode, Status_Note } from "../classes/enums";
import { NoteCC } from "../classes/rates/noteCC";
import { RateCC } from "../classes/rates/rateCC";
import { RateM } from "../classes/rates/rateM";
import { Role, User } from "../classes/user";
import { getRateCC_Rate } from "./factory_rateCC";
import { api_rateCC_getAllRateNoNote } from "../api/rateCC_api";
import { getActiveUser } from "../auth";
import { getRateM_Rate } from "./factory_rateM";
import { api_rateM_getAllRateNoNote } from "../api/rateM_api";
import { Mistake } from "../classes/mistake";
import { RatePart } from "../classes/rates/ratePart";

export function CreateNewEmptyNoteCC(coach: User): NoteCC {

    let noteCC = new NoteCC();
    noteCC.status = Status_Note.NO_START_
    noteCC.coach = coach;

    return noteCC;
}

export function CreateNoteCC(id: number, status: Status_Note, agent: User, coach: User, coachDate: string, appliesDate: string,
    zalecenia: string, odwolanie: string, rateCC_Col: Array<RateCC>, rateM_Col: Array<RateM>, mode: Rate_Mode) {

    let noteCC = new NoteCC();
    noteCC.id = id;
    noteCC.status = status;
    noteCC.agent = agent;
    noteCC.coach = coach;
    noteCC.coachDate = coachDate;
    noteCC.appliesDate = appliesDate;
    noteCC.zalecenia = zalecenia;
    noteCC.odwolanie = odwolanie;
    noteCC.rateCC_Col = rateCC_Col;
    noteCC.rateM_Col = rateM_Col;
    noteCC.mode = mode;

    return noteCC;

}

export function getNoteCC_Rate(noteCC: NoteCC): number {

    let rate: number = 0;

    noteCC.rateCC_Col.forEach(e => {
        rate = rate + getRateCC_Rate(e);
    });
    noteCC.rateM_Col.forEach(e => {
        rate = rate + getRateM_Rate(e);
    });

    rate = rate / (noteCC.rateCC_Col.length + noteCC.rateM_Col.length)
    return rate;
}

export function getNoteCC_RateAs100(noteCC: NoteCC): number {

    const rate = getNoteCC_Rate(noteCC) * 100;
    return Math.round(rate);
}

export async function Get_NoteList_With_NoStartNote(userList: Array<User>, noteList: Array<NoteCC>, appliesDate: string) {

    let foundFlag: boolean = false;
    let noteListWitnNoStart: Array<NoteCC> = new Array();
    let id: number = 0; // KASUJ
    const activeUser = await getActiveUser();
    const rateCCListNoNote = await api_rateCC_getAllRateNoNote();
    const rateMListNoNote = await api_rateM_getAllRateNoNote();


    userList.forEach(user => {

        if (user.role === Role.AGENT_ && user.available === true) {

            foundFlag = false;
            noteList.forEach(noteCC => {

                if (noteCC.agent.id === user.id) {
                    noteCC.mode = Rate_Mode.PREVIEW_;
                    noteListWitnNoStart.push(noteCC);
                    foundFlag = true;
                }
            });

            if (foundFlag === false) {

                let noteCC = CreateNewEmptyNoteCC(activeUser);
                noteCC.mode = Rate_Mode.NEW_;
                noteCC.appliesDate = appliesDate + "-01";
                noteCC.agent = user;

                noteListWitnNoStart.push(noteCC);
                noteCC.coach = activeUser;

                //Dodanie do noteCC rateCC
                rateCCListNoNote.forEach(rateCC => {
                    if (rateCC.agent.id === user.id) {
                        rateCC.mode = Rate_Mode.PREVIEW_;
                        noteCC.rateCC_Col.push(rateCC);
                    }
                })
                //Dodanie do noteCC rateM
                rateMListNoNote.forEach(rateM => {
                    if (rateM.agent.id === user.id) {
                        rateM.mode = Rate_Mode.PREVIEW_;
                        noteCC.rateM_Col.push(rateM);
                    }
                })

            }
        }
    });

    return noteListWitnNoStart;

}

export function getMistakeReport(noteCC: NoteCC) {

    const mistakeList: Mistake[] = []

    noteCC.rateCC_Col.forEach(rateCC => {

        const allRatePart: RatePart[] = []

        allRatePart.push(...rateCC.wiedzaBlock.ratePart)
        allRatePart.push(...rateCC.obslugaBlock.ratePart)
        allRatePart.push(...rateCC.komunikacjaBlock.ratePart)
        allRatePart.push(...rateCC.standardBlock.ratePart)
        allRatePart.push(...rateCC.technikaBlock.ratePart)

        allRatePart.forEach(ratePart => {
            if (ratePart.ocena === 0){
                addMistake(ratePart, mistakeList);
            }
        });
    });

    noteCC.rateM_Col.forEach(rateM => {

        const allRatePart: RatePart[] = []

        allRatePart.push(...rateM.wiedzaBlock.ratePart)
        allRatePart.push(...rateM.obslugaBlock.ratePart)
        allRatePart.push(...rateM.standardBlock.ratePart)
        allRatePart.push(...rateM.technikaBlock.ratePart)

        allRatePart.forEach(ratePart => {
            if (ratePart.ocena === 0){
                addMistake(ratePart, mistakeList);
            }
        });
    });

    return mistakeList;
}

function addMistake(ratePart: RatePart, mistakeList: Mistake[]) {
    const mistake = new Mistake();
    mistake.blockKey = ratePart.key.slice(0, -1);
    mistake.ratePartKey = ratePart.key;
    mistake.score = 0;
    mistakeList.push(mistake);
}

