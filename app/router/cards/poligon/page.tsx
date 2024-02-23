'use client'
import { User } from '@/app/classes/user'
import React, { useEffect, useState } from 'react'
import { updateUserList } from '@/app/factory/factory_user'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from '../../components/dialog/ConfirmDialog'
import { api_UserList_getAll, api_User_delete } from '@/app/api/user_api'
import { Usertable } from './usertable'

const UsersPage = () => {

    const [userList, setUserList] = useState<Array<User>>([]);

    useEffect(() => {
        async function fetchData() {
            const data = await api_UserList_getAll();
            setUserList(data);
        }
        fetchData();
    }, []);

    // ====== HTML =================================================================
    return (
        <div>
            <button>GET</button>
            <div className="mt-4">
                <table className="table table-pin-rows ">
                    <thead>
                        <tr >
                            <th>Login</th>

                        </tr>
                    </thead>
                    <tbody className="table-auto overflow-scroll" >
                        {userList.map((user, index) => {
                            return (
                                <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointer">
                                    <td>{user.login}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersPage 