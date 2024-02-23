'use client'
import { User } from '@/app/classes/user';
import { updateUserList } from '@/app/factory/factory_user';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export const Usertable = () => {

        // ====== Hooks =========================================================
        const [userList, setUserList] = useState<Array<User>>([]);
        
        useEffect(() => {
            updateUserTable();
        }, []);
    
        // ====== Funkcje ======================================================
        async function updateUserTable() {
            try {
                const users = await updateUserList();
                setUserList(users);
            } catch (error) {
                console.error('Błąd pobierania użytkowników:', error);
            }
        }

    const ActionIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
    );
    const DetailsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
        </svg>
    );
    const DeleteIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );


    return (
        <div className="mt-4">
            <table className="table table-pin-rows ">
                <thead>
                    <tr >
                        <th>Login</th>
                        <th>Imię i nazwisko</th>
                        <th>Rola</th>
                        <th>Aktywny</th>
                        <th>Coach</th>
                        <th>Kierownik</th>
                        <th>Lider</th>
                        <th>e-mail</th>
                        <th className='flex items-center justify-center'>
                            <ActionIcon />
                            <h1 className='ml-1'>Akcja</h1>
                        </th>
                    </tr>
                </thead>
                <tbody className="table-auto overflow-scroll" >
                    {userList.map((user, index) => {
                        return (
                            <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointer">
                                <td>{user.login}</td>
                                <td>{user.nameUser}</td>
                                <td>{user.role}</td>
                                <td>{user.available ? 'Tak' : 'Nie'}</td>
                                <td>{userList.find(coach => coach.id === user.coachId)?.nameUser || ""}</td>
                                <td>{userList.find(boss => boss.id === user.bossId)?.nameUser || ""}</td>
                                <td>{userList.find(lider => lider.id === user.leaderId)?.nameUser || ""}</td>
                                <td>{user.mail}</td>
                                <td className="dropdown w-max">
                                    <label tabIndex={0} className="btn btn-sm">Akcja</label>
                                    <ul tabIndex={0} className="dropdown dropdown-content z-[50] menu shadow bg-base-100 rounded-box border-2">
                                        <li>
                                            <button className='btn btn-info btn-sm hover:btn-success m-1 items-center justify-center h-10'>
                                                <Link
                                                    className="flex items-center group"
                                                    href={{
                                                        pathname: "/router/admin/user/userview",
                                                        query: { onEdit: true, userData: JSON.stringify(user) }
                                                    }}
                                                    passHref
                                                >
                                                    <DetailsIcon />
                                                    &nbsp;&nbsp;<p>Szczegóły</p>
                                                </Link>
                                            </button>
                                        </li>
                                        <li >
                                            <button
                                                className='btn btn-info btn-sm hover:btn-error m-1 h-10'>
  
                                                <p>Usuń</p>
                                            </button></li>
                                    </ul>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                {/* foot */}
                <tfoot>
                    <tr>
                        <th>Login</th>
                        <th>Imię i nazwisko</th>
                        <th>Rola</th>
                        <th>Aktywny</th>
                        <th>Coach</th>
                        <th>Kierownik</th>
                        <th>Lider</th>
                        <th>e-mail</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
