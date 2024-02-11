'use client'
import { api_Notification_add } from "@/app/api/notification_api";
import { Notification, Notification_Mode, Notification_Type } from "@/app/classes/notification";

export const Test = () => {



    async function send() {
        const noti = new Notification();
        noti.agent.id = 9
        noti.mode = Notification_Mode.PUSH_
        noti.type = Notification_Type.RATE_CC_;
        const response = await api_Notification_add(noti)
    }

    return (
        <div>
            <button onClick={send}>SEND</button>
        </div>
    );
};

export default Test;
