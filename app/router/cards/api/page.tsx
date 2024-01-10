'use client';
import { api_NoteCC_add } from '@/app/api/noteCC_api';
import { api_QueueList_add, api_Queue_add } from '@/app/api/queue_api';
import { api_UserList_add, api_User_add } from '@/app/api/user_api';
import { NoteCC } from '@/app/classes/noteCC';
import { User } from '@/app/classes/user';
import { global_userList, updateUserList } from '@/app/factory/factory_user';

import { useEffect, useState } from "react";

export const Api = () => {

    const [datePick, setDate] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();

            } catch (error) {
                console.error('Błąd pobierania użytkowników:', error);
            }
        }
        fetchData();

    }, []);

    function send1(dateApplies: string) {

        let noteCC = new NoteCC();
        noteCC.appliesDate = dateApplies;
        noteCC.agent = global_userList.find(user =>user.id === 8) || new User();
        noteCC.coach = global_userList.find(user =>user.id === 2) || new User();
        console.log('coach :', noteCC.coach);


        api_NoteCC_add(noteCC);
    }

    return (
        <div className='flex flex-col'>
            <input
                className=''
                type='date'
                onChange={e => setDate(e.target.value)}></input>

            <button className='btn btn-info' onClick={() => send1(datePick)}>SEND NOTE1</button>

        </div>
    )
}

export default Api