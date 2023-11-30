'use client';
import { api_QueueList_add, api_Queue_add } from '@/app/api/queue_api';
import { api_UserList_add, api_User_add } from '@/app/api/user_api';
import { queueList } from '@/app/factory/factory_queue';
import { userList_ } from '@/app/factory/factory_user'
import React from 'react'

const page = () => {

    function sendUsersList_Click(){
        api_UserList_add();
    }

    function sendQueueList_Click() {
        api_QueueList_add();
    }
    return (
        <div className='flex flex-col'>
            <button className='btn btn-info' onClick={sendUsersList_Click}>Send USER List</button>
            <button className='btn btn-info' onClick={sendQueueList_Click}>Send QUEUE List</button>
        </div>
    )
}

export default page