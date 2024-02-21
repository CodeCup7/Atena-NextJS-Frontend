'use client'
import { api_Notification_add } from "@/app/api/notification_api";
import { api_rateCC_getById } from "@/app/api/rateCC_api";
import { Notification, Notification_Mode, Notification_Type } from "@/app/classes/notification";
import { RateCC } from "@/app/classes/rates/rateCC";
import { User } from "@/app/classes/user";
import Link from "next/link";

export const Test = () => {

    async function send() {

        const r: RateCC = await api_rateCC_getById(1)
        console.log(JSON.stringify(r))
    }

    return (
        <div>

            <button onClick={send}>Send</button>
        </div>
    );
};

export default Test;
