'use client'
import { User } from '@/app/classes/user'
import React, { useContext, useEffect, useState } from 'react'
import { updateUserList } from '@/app/factory/factory_user'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from '../../components/dialog/ConfirmDialog'
import { api_User_delete } from '@/app/api/user_api'
import { IconAction, IconAddUser, IconDelete, IconDetails } from '../../components/icons/icons'

const UsersPage = () => {

    // ====== Hooks =========================================================
    const [userList, setUserList] = useState<Array<User>>([]);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [selectedUser, setUser] = useState(new User());

    useEffect(() => {
        updateUserTable();
    }, []);

    // ====== Funkcje ======================================================
    async function updateUserTable() {
        try {
            const users = await updateUserList();
            setUserList(users);
        } catch (error) {
            toast.error('Błąd pobierania użytkownika:', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            console.error('Błąd pobierania użytkowników:', error);
        }
    }

    // ====== HTML =================================================================
    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <ConfirmDialog open={deleteUserModal}
                onClose={
                    () => setDeleteUserModal(false)
                }
                onConfirm={() => {
                    api_User_delete(selectedUser.id)
                        .then(() => {
                            updateUserTable();
                        })
                }}
                title='Potwierdź decyzję'
                content='Czy napewno chcesz usunąć użytkownika ?' />

            <Link className=" link link-info link-hover text-lg"
                href={{
                    pathname: "/router/admin/user/userview",
                    query: { onEdit: false, userData: JSON.stringify(new User()) }
                }} >
                <button className="btn btn-outline btn-info btn-sm">
                    <IconAddUser />
                    Dodaj użytkownika
                </button>
            </Link>

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
                                <IconAction />
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
                                                        <IconDetails />
                                                        &nbsp;&nbsp;<p>Szczegóły</p>
                                                    </Link>
                                                </button>
                                            </li>
                                            <li >
                                                <button
                                                    className='btn btn-info btn-sm hover:btn-error m-1 h-10'
                                                    onClick={() => {
                                                        setUser(user); // Ustawiamy wybranego użytkownika do potwierdzenia usuwania
                                                        setDeleteUserModal(true);
                                                    }}>
                                                    <IconDelete />
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
        </div>
    )
}

export default UsersPage 