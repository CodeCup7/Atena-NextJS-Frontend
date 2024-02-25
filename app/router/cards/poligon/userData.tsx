'use client'
import { api_UserList_getAll } from '@/app/api/user_api'
import React, { useEffect, useState } from 'react'

export const UserData = () => {

    const [userlist, setUserList] = useState([])

    const callAPI = async () => {
        const res = await fetch('http://localhost:8080/api/user/getUserAll');
        setUserList(await res.json());
    };

    useEffect(() => {
        callAPI()
    }, []);

    return (
        <div className="mt-4">
            {userlist}
        </div>
    )
}
