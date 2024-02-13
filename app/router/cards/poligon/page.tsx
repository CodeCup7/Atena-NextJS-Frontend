'use client'
import { api_Notification_add } from "@/app/api/notification_api";
import { api_rateCC_getById } from "@/app/api/rateCC_api";
import { Notification, Notification_Mode, Notification_Type } from "@/app/classes/notification";
import { RateCC } from "@/app/classes/rates/rateCC";

export const Test = () => {

    

    

    async function send() {

        const r:RateCC = await api_rateCC_getById(1)
        console.log(r)
    }

    return (
        <div>
            <button onClick={send}>SEND</button>
        </div>
    );
};

export default Test;
