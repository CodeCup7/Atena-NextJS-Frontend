// '==========================================================================================================================================
// '*********************** Avatar Component *************************************************************************************************
// '==========================================================================================================================================
'use client'
import { getActiveUser } from '@/app/auth';
import { User } from '@/app/classes/user';
import React, { useEffect, useState } from 'react'
const Avatar = () => {

    const [activeUser, setActiveUser] = useState(new User());
    let initials = '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getActiveUser();
                setActiveUser(user);
            } catch (error) {
                console.error('Błąd pobierania aktywnego użytkownika:', error);
            }
        };
        fetchData();
    }, []);

    if (activeUser) {
        initials = activeUser.nameUser.split(" ").map((n) => n[0]).join(".");
    }
    return (
        <div className="stat">
            <div className="stat-figure text-secondary">
                
                <div className="avatar offline">
                    <div className={` ${activeUser.id !== 0 ? "avatar online" : "avatar offline"} placeholder`}> 
                        <div className="bg-neutral text-neutral-content rounded-full w-16">
                            <span className="text-xl">{initials}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="stat-title">Zalogowany:</div>
            <div className="stat-title">{activeUser.id !== 0 ? activeUser.nameUser : "Błąd logowania"}</div>
            {/* <div className="stat-desc text-secondary">{activeUser.role}</div> */}
        </div>
    )
}

export default Avatar