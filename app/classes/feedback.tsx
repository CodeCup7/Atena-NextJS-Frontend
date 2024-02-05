// '========================================================
// '*********************** Feedback CLASS *****************
// '========================================================
import { User } from "./user";

export enum Feedback_type {
    ALL_ = "Wszystkie",
    POSITIVE_ = "Pochwała",
    NEGATIVE_ = "Skarga",
}

export const FeedbackLabels: Record<Feedback_type, string> = {
    [Feedback_type.ALL_]: "Wszystkie",
    [Feedback_type.POSITIVE_]: "Pochwała",
    [Feedback_type.NEGATIVE_]: "Skarga",
};

export class Feedback {
    public id: number = 0;
    public agent: User = new User();
    public dateFeedback: string = "";
    public feedback: Feedback_type = Feedback_type.ALL_;
    
}

