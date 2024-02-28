'use client'
import { api_UserList_getByLogin, api_User_add, api_User_update } from "@/app/api/user_api";
import { Role, User } from "@/app/classes/user";
import { updateUserList } from "@/app/factory/factory_user";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "next/navigation";
import { IconAdd, IconAddUser, IconEdit } from "@/app/router/components/icons/icons";

const UserView = () => {

    // ====== Hooks =========================================================
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedCoach, setSelectedCoach] = useState(0);
    const [selectedBoss, setSelectedBoss] = useState(0);
    const [selectedLeader, setSelectedLeader] = useState(0);

    const [user, setUser] = useState(new User());
    const [userList, setUserList] = useState<Array<User>>([]);
    const [editUser, setEditUser] = useState(new User());

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                setUserList(users);
            } catch (error) {
                toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                console.error('Błąd pobierania użytkowników:', error);
            }
        }
        fetchData();
    }, []);

    // ====== SearchParametr ======================================================
    const searchParams = useSearchParams();
    const userData = searchParams.get('userData');

    useEffect(() => {
        if (userData != null) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setEditUser(parsedUser);
            setSelectedRole(parsedUser.role);

            if (parsedUser.coachId !== undefined) {
                setSelectedCoach(parsedUser.coachId);
                setSelectedBoss(parsedUser.bossId);
                setSelectedLeader(parsedUser.leaderId);
            }
        }
    }, [userData]);

    // ====== Akcje ====================================================== 
    async function action() {

        let fillFields = false;

        if (user.login.length !== 0 && user.nameUser.length != 0 && user.mail.length !== 0 && user.role !== undefined) {
            fillFields = true;

            if (user.role === Role.AGENT_) {

                if (user.bossId !== 0 && user.leaderId !== 0 && user.coachId !== 0) {
                    fillFields = true;
                } else {
                    fillFields = false;
                }
            }
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

                    let existLogin = false;

                    //Sprawdz login tylko wtedy gdy jest nowy user lub edytowany user któremu zmienia się login
                    if (editUser.id === 0 || ((user.login !== editUser.login) && editUser.id !== 0)) {
                        existLogin = dbUser.login === user.login
                    }

                    if (existLogin === true) {

                        toast.error("Login " + user.login + " istnieje już w systemie", {
                            position: toast.POSITION.TOP_RIGHT, theme: "dark"
                        });
                    } else {
                        if (editUser.id === 0) { // Dodanie nowego usera
                            api_User_add(user).then((foo => {
                                if (foo.isOK === true) {
                                    toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                                } else {
                                    toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                                }
                            }));
                        } else { // Edytowanie usera

                            api_User_update(user).then((foo => {
                                if (foo.isOK === true) {
                                    toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                                } else {
                                    toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                                }
                            }));
                        }
                    }
                })
                .catch(error => {
                    toast.error('Błąd pobierania użytkownika:', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    console.error('Błąd pobierania użytkownika:', error);
                });
        }
    }

    return (
        <div className='container mx-auto p-2'>
            <ToastContainer />
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-center'>
                    <IconAddUser size={12} className="text-info" />
                    <h1 className='text-4xl text-info mb-4 ml-2'>
                        {user.id != 0 ? "Edycja / Podgląd " : "Dodawanie "} Użytkownika</h1>
                </div>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-2 my-7"></hr>
            {/* BODY */}
            <div className='flex items-start justify-center'>
                <div className="flex flex-col col-span-6 w-full items-end justify-end ">

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
                        {user.id === 0 ? <IconEdit /> : <IconAdd />}
                        {user.id != 0 ? "Edytuj" : "Dodaj"}
                    </button>
                </div>

                <div className="flex flex-col col-span-6 w-full items-start justify-start ">
                    <label className="form-control w-full max-w-xs mt-2">
                        <div className="label">
                            <span className={`label-text ${user.role != undefined ? '' : 'hidden'}`}>Rola</span>
                        </div>
                        <select
                            className="select select-info w-72 "
                            value={selectedRole}
                            onChange={e => {
                                setSelectedRole(e.target.value)
                                setUser({ ...user, role: Object.values(Role).find(role => role === e.target.value) || Role.SUPERVISOR_ });

                            }}>
                            <option value={''} disabled>Wybierz rolę ...</option>
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
                                value={selectedCoach}
                                onChange={e => {
                                    setUser({ ...user, coachId: parseInt(e.target.value) });
                                    setSelectedCoach(parseInt(e.target.value));
                                }}>
                                <option value={0} disabled>Coach ...</option>
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
                                value={selectedBoss}
                                onChange={e => {
                                    setUser({ ...user, bossId: parseInt(e.target.value) });
                                    setSelectedBoss(parseInt(e.target.value));
                                }}>
                                <option value={0} disabled>Kierownik ...</option>
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
                                value={selectedLeader}
                                onChange={e => {
                                    setUser({ ...user, leaderId: parseInt(e.target.value) });
                                    setSelectedLeader(parseInt(e.target.value));
                                }}>
                                <option value={0} disabled>Leader ...</option>
                                {userList.filter(user => user.role === Role.LEADER_).map((user, index) => (
                                    <option key={index} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default UserView