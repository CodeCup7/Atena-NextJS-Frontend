'use client'
import React, { } from 'react'
import { UserData } from './userData'


const UsersPage = () => {

    const callAPI = async () => {
        const res = await fetch('http://localhost:8080/api/user/getUserAll');
        const data = await res.json();

    };

    // ====== HTML =================================================================
    return (
        <div>
             <button onClick={callAPI}>Make API call</button>
        </div>
    )
}

export default UsersPage 