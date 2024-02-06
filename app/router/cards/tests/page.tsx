'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Role, User } from '@/app/classes/user';
import { getActiveUser } from '@/app/auth';
import { updateUserList } from '@/app/factory/factory_user';
import { format } from 'date-fns';
import { Tests, TestsLabels, TestsPass } from '@/app/classes/tests';
import { api_Tests_add, api_Tests_delete, api_Tests_getDate } from '@/app/api/test_api';

const Tests_Page = () => {

    // ====== Ustawienie i kontrola active usera ==========================================
    const [activeUser, setActiveUser] = useState(new User());
    const [isPermit, setIsPermit] = useState(false);
    const [isPermitAgent, setIsPermitAgent] = useState(false);  
    const [userList, setUserList] = useState<Array<User>>([]);
    const [testsList, setTestsList] = useState<Array<Tests>>([]);
    const [tests, setTests] = useState(new Tests());
    const [rowIndex, setRowIndex] = useState(-1);
    const [rowRateIndex, setRowRateIndex] = useState(-1);
    const [dateValue, setDateValue] = useState('');
    const [agentId, setAgentId] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                const user = await getActiveUser();
                setUserList(users);
                setActiveUser(user);
                setTests(new Tests())

                const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
                setIsPermit(isPermit);

            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);

    // ====== OBSŁUGA PRZYCISKÓW ======================================================
    function downloadDate_Click() {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {

            async function fetchData() {
                try {
                    const parts = dateValue.split('-'); // Rozbijanie daty na części

                    // Tworzenie daty z części daty
                    const year = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1 //Indexowanie zaczyna się od zera

                    const date = new Date(year, month, 1);
                    // Ustawienie daty na pierwszy dzień miesiąca
                    const startDate = new Date(year, month, 1);
                    // Obliczenie daty końcowej - ustawienie na ostatni dzień aktualnego miesiąca
                    const endDate = new Date(year, month + 1, 0);
                    const testsList = await api_Tests_getDate(format(new Date(startDate), 'yyyy-MM-dd'), format(new Date(endDate), 'yyyy-MM-dd'));
                    setTestsList(testsList);

                } catch (error) {
                    console.error('Błąd pobierania Testsów:', error);
                }
            }
            fetchData();

        } else {
            toast.error("Wybierz datę!", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        }
    }

    function addTests_click(): boolean {

        if (validate()) {

            api_Tests_add(tests).then((foo => {
                if (foo.isOK === true) {

                    setTestsList((prevTestsList) => [...prevTestsList, foo.tests]);
                    toast.info(foo.callback, {
                        position: toast.POSITION.TOP_RIGHT, theme: "dark"
                    });
                    return true;
                } else {
                    toast.error(foo.callback, {
                        position: toast.POSITION.TOP_RIGHT, theme: "dark"
                    });
                }
            }));

        } else {
            toast.error("Uzupełnij poprawnie wszystkie pola", {
                position: toast.POSITION.TOP_RIGHT, theme: "dark"
            });
        }
        return false;
    }

    function deleteTests_click(tests_: Tests) {
        api_Tests_delete(tests_).then((foo => {
            if (foo.isOK === true) {
                setTestsList((prevTestsList) => prevTestsList.filter((Tests) => Tests.id !== tests_.id));
                toast.info(foo.callback, {
                    position: toast.POSITION.TOP_RIGHT, theme: "dark"
                });
                return true;
            } else {
                toast.error(foo.callback, {
                    position: toast.POSITION.TOP_RIGHT, theme: "dark"
                });
            }
        }));
    }

    // ====== OBSŁUGA MODALA =========================================================
    const modalRef = useRef<HTMLDialogElement>(null);

    const openModal = () => {
        if (modalRef.current) {
            modalRef.current.showModal();
        }
    };

    const closeModal = () => {
        if (modalRef.current) {
            modalRef.current.close();
        }
    };

    // ====== FUNKCJE ==============================================================
    function validate(): boolean {
        if (tests.agent.id !== 0 && tests.dateTest !== '' && tests.testPass !== TestsPass.ALL_) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className='container mx-auto w-full border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />

            {/* NAGŁÓWEK */}
            <div className='flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-info">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-info">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                </svg>
                <h1 className='text-4xl text-info mb-4 ml-2'>Testy</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* POBIERANIE I DODAWANIE */}
            <div className='flex mt-5'>

                <div className='flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 mx-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                    <input
                        value={dateValue}
                        onChange={e => { setDateValue(e.currentTarget.value); }}
                        type="month"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs" />
                    <button onClick={downloadDate_Click} className="btn btn-outline btn-info mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Pobierz dane
                    </button>
                </div>

                <button className="btn btn-outline btn-info mx-2" onClick={openModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Dodaj pojedyńczy test
                </button>
            </div>

            {/* MODAL */}
            <dialog id="my_modal_1" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <div className="flex flex-col items-center justify-center ml-10">
                        <span className='text-info'>Dodaj pojedyńczy test</span>
                        <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>
                        <div className="flex flex-col mt-5">
                            <span className="label-text">Data</span>
                            <input type="date"
                                className="input input-bordered input-info min-w-fit"
                                defaultValue={tests.dateTest}
                                onChange={e => tests.dateTest = e.target.value} />
                        </div>
                        <div className="flex flex-col mt-2">
                            <span className="label-text">Agent</span>
                            <select
                                className="select select-info w-72"
                                value={tests.agent.id}
                                onChange={e => {
                                    tests.agent = userList.find(user => user.id === parseInt(e.target.value)) || new User()
                                    setAgentId(parseInt(e.target.value))
                                }}>
                                <option value={0} disabled>Wybierz agenta ...</option>
                                {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                                    <option key={user.id} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-outline btn-info mt-5"
                            onClick={() => {
                                if (addTests_click()) {
                                    closeModal
                                }
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Dodaj
                        </button>
                    </div>
                    <div className="modal-action">
                        {/* Close the modal using the closeModal function */}
                        <button className="btn" onClick={closeModal}>
                            Zamknij
                        </button>
                    </div>
                </div>
            </dialog>

            {/* TABELA */}
            <div className='flex sm:flex-col md:flex-row'>

                <div className="table">
                    <table className="table table-pin-rows ">
                        <thead>
                            <tr>
                                <th className=''>id</th>
                                <th className=''>data</th>
                                <th>agent</th>
                                <th>ocena</th>
                                <th>próg</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody className="table-auto overflow-scroll w-full" >
                            {testsList.map((tests, index) => {
                                return (
                                    <tr key={index}
                                        className={`hover:bg-base-300  hover:text-white cursor-pointer ${index === rowIndex ? 'bg-slate-950 text-white' : ''
                                            } cursor-pointer`}>
                                        <td>{tests.id}</td>
                                        <td>{tests.dateTest}</td>
                                        <td>{tests.agent.nameUser}</td>
                                        <td><button className="btn btn-outline btn-warning btn-sm"
                                            onClick={() => {
                                                deleteTests_click(tests)
                                            }}>
                                            Usuń
                                        </button>
                                        </td>
                                    </tr>
                                )})}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Tests_Page