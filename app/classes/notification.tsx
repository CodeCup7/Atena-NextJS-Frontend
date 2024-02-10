// '========================================================
// '*********************** Notification CLASS *****************
// '========================================================
import { User } from "./user";

export enum Notification_Type {
    ALL_ = "ALL_",
    PUSH_ = "PUSH_",
    BACK_ = "BACK_",
}

export const NotificationLabels: Record<Notification_Type, string> = {
    [Notification_Type.ALL_]: "Wszystkie",
    [Notification_Type.PUSH_]: "Wysłany",
    [Notification_Type.BACK_]: "Odebrany",
};

export class Notification {
    public id: number = 0;
    public agent: User = new User();
    public feedback: Notification_Type = Notification_Type.ALL_;
    public text: string = '';
}

