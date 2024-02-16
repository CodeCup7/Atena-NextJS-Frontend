// '============================================================
// '*********************** NOTIFICATION CLASS *****************
// '============================================================
import { User } from "./user";

export class Notification {
    public id: number = 0;
    public coach: User = new User();
    public agent: User = new User();
    public type: Notification_Type = Notification_Type.ALL_;
    public mode: Notification_Mode = Notification_Mode.ALL_;
    public text: string = '';
    public previewId: number = 0;
}

export enum Notification_Mode {
    ALL_ = "ALL_",
    PUSH_ = "PUSH_",
    BACK_ = "BACK_",
}
export const NotificationModeLabels: Record<Notification_Mode, string> = {
    [Notification_Mode.ALL_]: "Wszystkie",
    [Notification_Mode.PUSH_]: "Wysłany",
    [Notification_Mode.BACK_]: "Odebrany",
};

export enum Notification_Type {
    ALL_ = "ALL_",
    NOTE_CC_ = "NOTE_CC_",
    RATE_CC_ = "RATE_CC_",
    RATE_CC_M_ = "RATE_CC_M_",
    RATE_CC_C = "RATE_CC_C",
    RATE_M_ = "RATE_M_",
    TEST_ = "TEST_",
    FEEDBACK_ = "FEEDBACK_",
    NOTE_APPEALS_ = "NOTE_APPEALS_"
}

export const NotificationTypeLabels: Record<Notification_Type, string> = {
    [Notification_Type.ALL_]: "Wszystkie",
    [Notification_Type.NOTE_CC_]: "Coaching",
    [Notification_Type.RATE_CC_]: "Karta oceny",
    [Notification_Type.RATE_CC_M_]: "Tajemniczy klient",
    [Notification_Type.RATE_CC_C]: "Bieżący odsłuch",
    [Notification_Type.RATE_M_]: "Karta mail",
    [Notification_Type.TEST_]: "Test",
    [Notification_Type.FEEDBACK_]: "Pochwała / Skarga",
    [Notification_Type.NOTE_APPEALS_]: "Odwołanie od oceny"
};