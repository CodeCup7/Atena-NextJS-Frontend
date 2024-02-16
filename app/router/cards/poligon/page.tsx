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
        console.log(r)
    }

    return (
        <div>

            <Link
                className="flex items-center group link link-info hover:link-success text-lg space-x-2"
                href={{
                    pathname: "/router/admin/user/userview",
                    query: { onEdit: false, userData: JSON.stringify(new User()) }
                }}>
            
                        <p>Dodaj użytkownika</p>
                    </Link>
                </div>
                );
};

                export default Test;
