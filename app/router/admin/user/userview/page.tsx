'use client'
import { api_UserList_getAll, api_UserList_getByLogin, api_User_add } from "@/app/api/user_api";
import { Role, User } from "@/app/classes/user";
import { global_userList, updateUserList } from "@/app/factory/factory_user";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "next/navigation";


const UserView = () => {

    const [user, setUser] = useState(new User());
    const [userList, setUserList] = useState<Array<User>>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                setUserList(users);
            } catch (error) {
                console.error('Błąd pobierania użytkowników:', error);
            }
        }
        fetchData();
    }, []); 

    const searchParams = useSearchParams();
    const userData = searchParams.get('userData');

    useEffect(() => {
        if (userData != null) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        }
    }, [userData]);

    async function action() {

        let fillFields;

        if (user.login !== '' && user.nameUser !== '' && user.mail !== '') {
            if (user.role === Role.AGENT_ && (user.bossId === 0 || user.leaderId === 0 || user.coachId === 0)) {
                fillFields = false;
            } else {
                fillFields = true;
            }
        } else {
            fillFields = true;
        }

        if (fillFields === false) {
            toast.error("Nie uzupełniono wszystkich wymaganych pól", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        } else {

            //Sprawdzenie czy login istnieje w bazie
            api_UserList_getByLogin(user.login)
                .then(dbUser => {

                    if (dbUser.login === user.login) {
                        toast.error("Login " + user.login + " istnieje już w systemie", {
                            position: toast.POSITION.TOP_RIGHT,
                            theme: "dark"
                        });
                    } else {
                        if (user.id === 0) { // Dodanie nowego usera
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
                        } else { // Edytowanie usera

                        }

                    }
                })
                .catch(error => {
                    console.error('Błąd pobierania użytkownika:', error);
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
                        {user.id != 0 ? "Edycja / Podgląd " : "Dodawanie "} Użytkownika</h1>
                </div>

            </div>

            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-2 my-7"></hr>
            {/* BODY */}
            <div className='flex items-center justify-center'>
                <div className="flex flex-col w-full items-center justify-center ">

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className={`label-text ${user.login != '' ? '' : 'hidden'}`}>Login</span>
                        </div>
                        <input
                            className="input input-bordered input-info max-w-md w-72"
                            value={user.login}
                            type="text"
                            placeholder="Login"
                            onChange={e => {
                                setUser({ ...user, login: e.target.value })
                            }}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className={`label-text ${user.nameUser != '' ? '' : 'hidden'}`}>Imię i nazwisko</span>
                        </div>
                        <input
                            className="input input-bordered input-info max-w-md gap-y-2 w-72"
                            value={user.nameUser}
                            type="text"
                            placeholder="Imię i nazwisko"
                            onChange={e => {
                                setUser({ ...user, nameUser: e.target.value })
                            }} />
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className={`label-text ${user.role != undefined ? '' : 'hidden'}`}>Rola</span>
                        </div>
                        <select
                            className="select select-info w-72 "
                            defaultValue={'DEFAULT'}
                            value={user.role}
                            onChange={
                                e => {
                                    setUser({ ...user, role: Object.values(Role).find(role => role === e.target.value) || Role.SUPERVISOR_ });
                                }
                            }>
                            <option value="DEFAULT" disabled>Wybierz rolę ...</option>
                            {Object.values(Role).map((role, index) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Jeżlei rola agent to odpal Boss, Coach, Leader */}
                    <div className={`mt-2 ${user.role === Role.AGENT_ ? '' : 'hidden'}`}>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className={`label-text ${user.coachId != 0 ? '' : 'hidden'}`}>Coach</span>
                            </div>
                            <select
                                className="select select-info w-72"
                                defaultValue={'DEFAULT'}
                                value={userList.find(coach => coach.id === user.coachId)?.nameUser}
                                onChange={
                                    e => setUser({ ...user, coachId: parseInt(e.target.value) })
                                }>
                                <option value="DEFAULT" disabled>Coach ...</option>
                                {userList.filter(user => user.role === Role.COACH_ || user.role === Role.ADMIN_).map((user, index) => (
                                    <option key={user.id} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control w-full max-w-xs mt-2">
                            <div className="label">
                                <span className={`label-text ${user.bossId != 0 ? '' : 'hidden'}`}>Kierownik</span>
                            </div>
                            <select
                                className="select select-info w-72"
                                defaultValue={'DEFAULT'}
                                value={userList.find(boss => boss.id === user.bossId)?.nameUser}
                                onChange={
                                    e => setUser({ ...user, bossId: parseInt(e.target.value) })
                                }>
                                <option value="DEFAULT" disabled>Kierownik ...</option>
                                {userList.filter(user => user.role === Role.BOSS_).map((user, index) => (
                                    <option key={index} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </label>

                        <label className="form-control w-full max-w-xs mt-2">
                            <div className="label">
                                <span className={`label-text ${user.leaderId != 0 ? '' : 'hidden'}`}>Leader</span>
                            </div>
                            <select
                                className="select select-info w-72"
                                defaultValue={'DEFAULT'}
                                value={userList.find(leader => leader.id === user.leaderId)?.nameUser}
                                onChange={
                                    e => setUser({ ...user, leaderId: parseInt(e.target.value) })
                                }>
                                <option value="DEFAULT" disabled>Leader ...</option>
                                {userList.filter(user => user.role === Role.LEADER_).map((user, index) => (
                                    <option key={index} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </label>

                    </div>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className="label-text">Czy aktywny</span>
                        </div>
                        <select
                            className="select select-info w-72"
                            value={String(user.available)}
                            onChange={(e) => setUser({ ...user, available: e.target.value === 'true' ? true : false })}>
                            <option value="true">TAK</option>
                            <option value="false">NIE</option>
                        </select>
                    </label>

                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className={`label-text ${user.mail != '' ? '' : 'hidden'}`}>E-Mail</span>
                        </div>
                        <input
                            className="input input-bordered input-info max-w-md w-72"
                            value={user.mail}
                            type="text"
                            placeholder="E-Mail"
                            onChange={e => setUser({ ...user, mail: e.target.value })} />
                    </label>
                    <button
                        onClick={action}
                        className='btn btn-info hover:btn-primary mt-5'>
                        {user.id === 0 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" data-slot="icon" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" data-slot="icon" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>}
                        {user.id != 0 ? "Edytuj" : "Dodaj"}
                    </button>
                </div>
            </div>
        </div >

    );
}

export default UserView