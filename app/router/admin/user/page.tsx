'use client'
import { User } from '@/app/classes/user'
import React, { useEffect, useState } from 'react'
import UserDetailsDialog from '../../components/dialog/UserDetailsDialog'
import { global_userList, updateUserList } from '@/app/factory/factory_user'

const UsersPage = () => {

    const [userList, setUserList] = useState<Array<User>>([]);
    const [newUserModal, setOpenNewRateModal] = useState(false);
    const [selectedUser, setUser] = useState(new User)

    useEffect(() => {
        updateUserList();
        setUserList(global_userList);
    }, []);

    return (

        <div className='flex flex-col'>

            <UserDetailsDialog
                open={newUserModal}
                onClose={(isOpen) => setOpenNewRateModal(isOpen)}
                user={selectedUser} // Przekaż wybranego użytkownika
                isEditMode={false} // Ustaw odpowiedni tryb (true dla edycji, false dla podglądu)
                onEdit={false} />

            <button onClick={() => {
                setUser(new User());
                setOpenNewRateModal(true);
            }}

                className='btn btn-info max-w-xs hover:btn-primary'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Dodaj użytkownika
            </button>

            <div className="overflow-x-auto">
                <table className="table table-pin-rows">
                    {/* head */}
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
                            <th className='flex items-center justify-center'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                            </svg>
                                <h1 className='ml-1'>Akcja</h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-auto overflow-scroll w-full" >
                        {userList.map((user, index) => {
                            return (
                                <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointer">
                                    <td>{user.login}</td>
                                    <td>{user.nameUser}</td>
                                    <td>{user.role}</td>
                                    <td>{user.available}</td>
                                    <td>{userList.find(coach => coach.id === user.coachId)?.nameUser || ""}</td>
                                    <td>{userList.find(boss => boss.id === user.bossId)?.nameUser || ""}</td>
                                    <td>{userList.find(lider => lider.id === user.leaderId)?.nameUser || ""}</td>
                                    <td>{user.mail}</td>
                                    <td className="dropdown w-screen">
                                        <label tabIndex={0} className="btn btn-sm">Akcja</label>
                                        <ul tabIndex={0} className="dropdown dropdown-content z-[1] menu shadow bg-base-100 rounded-box border-2">
                                            <li><button
                                                className='btn btn-info btn-sm hover:btn-neutral'
                                                onClick={() => {
                                                    setUser(user)
                                                    setOpenNewRateModal(true);
                                                }}>Szczegóły
                                            </button></li>
                                            <li ><button className='btn btn-info btn-sm hover:btn-error mt-2'>Usuń</button></li>
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

        </div>


    )
}

export default UsersPage 