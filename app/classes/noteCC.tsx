// '===============================================================
// '*********************** NoteCC CLASS ***************************
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
    //public rateM_Col: Array<RateM> = [];
    public mode: Rate_Mode = Rate_Mode.NEW_;

	public getRate(): number {

		let rate: number = 0;

		this.rateCC_Col.forEach(e => {
			rate = rate + e.getRate();
		});

		return rate;
	}
}


// Public Function getScore() As Double

//     Dim rateCC As C_RateCC, rateM As C_RateM
    
//     If rateCC_Col.count > 0 Or rateM_col.count > 0 Then
//         For Each rateCC In rateCC_Col
//             getScore = getScore + rateCC.getRate
//         Next rateCC

//         For Each rateM In rateM_col
//             getScore = getScore + rateM.getRate
//         Next rateM
        
//         getScore = getScore / (rateCC_Col.count + rateM_col.count)
        
//     End If
// End Function