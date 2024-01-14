import { Rate_Mode, Status_Note } from "../classes/enums";
import { NoteCC } from "../classes/noteCC";
import { RateCC } from "../classes/rateCC";
import { RateM } from "../classes/rateM";
import { Role, User } from "../classes/user";
import { CreateNewEmptyRateCC } from "./factory_rateCC";
import { getActiveUser } from "../global";
import { api_rateCC_getAllRateNoNote } from "../api/rateCC_api";


export function CreateNewEmptyNoteCC() {

    let noteCC = new NoteCC();
    noteCC.status = Status_Note.NO_START

    return noteCC;
}

export function CreateNoteCC(id: number, status: Status_Note, agent: User, coach: User, coachDate: string, appliesDate: string,
    zalecenia: string, odwolanie: string, rateCC_Col: Array<RateCC>, mode: Rate_Mode) {

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
    noteCC.mode = mode;

    return noteCC;

}

export async function Get_NoteList_With_NoStartNote(userList: Array<User>, noteList: Array<NoteCC>, appliesDate: string) {

    let foundFlag: boolean = false;
    let noteListWitnNoStart: Array<NoteCC> = new Array();
    let id: number = 0; // KASUJ

    const rateListNoNote = await api_rateCC_getAllRateNoNote();
    
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

                let noteCC = CreateNewEmptyNoteCC();
                noteCC.mode = Rate_Mode.NEW_;
                noteCC.appliesDate = appliesDate + ".01";
                noteCC.agent = user;

                noteListWitnNoStart.push(noteCC);
                noteCC.coach = getActiveUser();

                //Dodanie do noteCC rateCC
                rateListNoNote.forEach(rateCC => {
                    if(rateCC.agent.id = user.id){
                        noteCC.rateCC_Col.push(rateCC);
                    }
                })

            }
        }
    });

    return noteListWitnNoStart;



    function addRateCCToNoteCC(noteCC: NoteCC): void {

        let rateCC = CreateNewEmptyRateCC();
        rateCC.dateRate = "18.10.2023";
        rateCC.queue.nameQueue = "test";
        rateCC.rate = 100;
        rateCC.dateCall = "19.10.2023";
        rateCC.dateShare = "20.10.2023";

        noteCC.rateCC_Col.push(rateCC);

    }


}