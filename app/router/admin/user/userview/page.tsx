'use client'
import { api_UserList_getByLogin, api_User_add } from "@/app/api/user_api";
import { Role, User } from "@/app/classes/user";
import { global_userList } from "@/app/factory/factory_user";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "next/navigation";;

const UserView = () => {

    const [isAgent, setIsAgent] = useState(false);
    const [user, setUser] = useState(new User());
    const [userList, setUserList] = useState(global_userList);

    const searchParams = useSearchParams();
    const onEditData = searchParams.get('onEdit');
    const userData = searchParams.get('userData');
    const onEdit = onEditData === "true";

    useEffect(() => {
        if (userData != null) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);

            if (parsedUser.id !== 0 && parsedUser.role === Role.AGENT_) {
                setIsAgent(true);
            } else {
                setIsAgent(false); // Ensure to reset if not an agent
            }
        }
    }, [userData]); // Add userData as a dependency

    async function action() {

        let loginExist = false;

        if (user.login != '' && user.nameUser != '' && user.mail != '') {
            if (user.role === Role.AGENT_ && (user.bossId === 0 || user.leaderId === 0 || user.coachId === 0)) {
                
                toast.error("Nie uzupełniono wszystkich wymaganych pól dla roli agenta", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "dark"
                });

            } else {

                //Sprawdzenie czy login istnieje w bazie
                api_UserList_getByLogin(user.login)
                    .then(dbUser => {
                        if (dbUser.login === user.login) {
                            loginExist = true;
                            toast.error("Login " + user.login + " istnieje już w systemie", {
                                position: toast.POSITION.TOP_RIGHT,
                                theme: "dark"
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Błąd pobierania użytkownika:', error);
                    });

                //Dodanie lub edytowanie usera w DB
                if (loginExist === false) {
                    if (onEdit) {

                    } else {

                        api_User_add(user).then((foo => {
                            if (foo.isOK === true) {
                                toast.info(foo.callback, {
                                    position: toast.POSITION.TOP_RIGHT,
                                    theme: "dark"
                                });
                            } else {
                                toast.error(foo.callback, {
                                    position: toast.POSITION.TOP_RIGHT,
                                    theme: "dark"
                                });
                            }
                        }));
                    }
                }

            }
        } else {
            toast.error("Nie uzupełniono wszystkich wymaganych pól", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        }
    }

    return (
        <div className='container mx-auto p-2'>
            <ToastContainer />
            <div className='flex flex-col items-center justify-center'>


                <div className='flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-info">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    <h1 className='text-4xl text-info mb-4 ml-2'>
                        {onEdit ? "Edycja / Podgląd " : "Dodawanie "} Użytkownika</h1>
                </div>

            </div>

            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-2 my-7"></hr>
            {/* BODY */}
            <div className='flex items-center justify-center'>
                <div className="flex flex-col w-full items-center justify-center gap-y-4 ">
                    <input
                        className="input input-bordered input-info max-w-md w-72"
                        defaultValue={onEdit ? user.login : ''}
                        type="text"
                        placeholder="Login"
                        onChange={e => user.login = e.target.value} />
                    <input
                        className="input input-bordered input-info max-w-md gap-y-2 w-72"
                        defaultValue={onEdit ? user.nameUser : ''}
                        type="text"
                        placeholder="Imię i nazwisko"
                        onChange={e => user.nameUser = e.target.value} />
                    <select
                        defaultValue={onEdit && user.id != 0 ? user.role : 'DEFAULT'}
                        className="select select-info w-72 "
                        onChange={
                            e => {
                                
                                user.role = Object.values(Role).find(role => role === e.target.value) || Role.SUPERVISOR_
                                //setIsAgent(user.role === Role.AGENT_);
                                console.log(user)
                            }
                        }>
                        <option value="DEFAULT" disabled>Wybierz rolę ...</option>
                        {Object.values(Role).map((role, index) => (
                            <option key={index} value={role}>{role}</option>
                        ))}
                    </select>
                    {/* Jeżlei rola agent to odpal Boss, Coach, Leader */}
                    <select
                        defaultValue={onEdit ? userList.find(coach => coach.id === user.coachId)?.nameUser : 'DEFAULT'}
                        className={`select select-info w-72 ${isAgent ? '' : 'hidden'}`}
                        onChange={e => user.coachId = parseInt(e.target.value)}>
                        <option value="DEFAULT" disabled>Coach ...</option>
                        {userList.filter(user => user.role === Role.COACH_).map((user, index) => (
                            <option key={index} value={user.id}>{user.nameUser}</option>
                        ))}
                    </select>
                    <select
                        defaultValue={onEdit ? userList.find(boss => boss.id === user.bossId)?.nameUser : 'DEFAULT'}
                        className={`select select-info w-72 ${isAgent ? '' : 'hidden'}`}
                        onChange={e => user.bossId = parseInt(e.target.value)}>
                        <option value="DEFAULT" disabled>Kierownik ...</option>
                        {userList.filter(user => user.role === Role.BOSS_).map((user, index) => (
                            <option key={index} value={user.id}>{user.nameUser}</option>
                        ))}
                    </select>
                    <select
                        defaultValue={onEdit ? userList.find(leader => leader.id === user.leaderId)?.nameUser : 'DEFAULT'}
                        className={`select select-info w-72 ${isAgent ? '' : 'hidden'}`}
                        onChange={e => user.leaderId = parseInt(e.target.value)}>
                        <option value="DEFAULT" disabled>Leader ...</option>
                        {userList.filter(user => user.role === Role.LEADER_).map((user, index) => (
                            <option key={index} value={user.id}>{user.nameUser}</option>
                        ))}
                    </select>
                    <select
                        defaultValue={onEdit && user.id != 0 ? String(user.available) : 'DEFAULT'}
                        className="select select-info w-72 "
                        onChange={(e) => user.available = e.target.value === "true"}>
                        <option value="DEFAULT" disabled>Czy aktywny ...</option>
                        <option value="true">TAK</option>
                        <option value="false">NIE</option>
                    </select>
                    <input
                        className="input input-bordered input-info max-w-md gap-y-2 w-72"
                        defaultValue={onEdit ? user.mail : ''}
                        type="text"
                        placeholder="E-Mail"
                        onChange={e => user.mail = e.target.value} />
                    <button
                        onClick={action}
                        className='btn btn-info hover:btn-primary'>{onEdit ? "Edytuj" : "Dodaj"}</button>
                </div>
            </div>
        </div >

    );
}

export default UserView