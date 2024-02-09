// '===============================================================
// '******************** Filtr Test CLASS *************************
// '===============================================================

import { Feedback_type } from "../feedback";
import { User } from "../user";

export class FiltrFeedback {

    public id: number = 0;
    public dateFeedbackStart: string = "";
    public dateFeedbackEnd: string = "";
    public feedback: Feedback_type = Feedback_type.ALL_;

    public userCol: Array<User> = [];
}
