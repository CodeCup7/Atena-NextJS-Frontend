'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Role, User } from '@/app/classes/user';
import { getActiveUser } from '@/app/auth';
import { updateUserList } from '@/app/factory/factory_user';
import { format } from 'date-fns';
import { Test, TestLabels, TestPass } from '@/app/classes/test';
import { api_Test_add, api_Test_addAll, api_Test_delete, api_Test_getDate } from '@/app/api/test_api';
import readXlsxFile from 'read-excel-file';
import { prepareTestsList } from '@/app/factory/factory_test';

const Tests_Page = () => {

    // ====== Ustawienie i kontrola active usera ==========================================
    const [activeUser, setActiveUser] = useState(new User());
    const [isPermit, setIsPermit] = useState(false);
    const [isPermitAgent, setIsPermitAgent] = useState(false);
    const [userList, setUserList] = useState<Array<User>>([]);
    const [testList, setTestList] = useState<Array<Test>>([]);
    const [test, setTest] = useState(new Test());
    const [rowIndex, setRowIndex] = useState(-1);
    const [rowRateIndex, setRowRateIndex] = useState(-1);
    const [dateValue, setDateValue] = useState('');
    const [agentId, setAgentId] = useState(0);
    const [data, setData] = useState<string[][]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                const user = await getActiveUser();
                setUserList(users);
                setActiveUser(user);
                setTest(new Test())

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
                    const testList = await api_Test_getDate(format(new Date(startDate), 'yyyy-MM-dd'), format(new Date(endDate), 'yyyy-MM-dd'));
                    setTestList(testList);

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

            api_Test_add(test).then((foo => {
                if (foo.isOK === true) {

                    setTestList((prevTestsList) => [...prevTestsList, foo.test]);
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

    function deleteTests_click(test_: Test) {
        api_Test_delete(test_).then((foo => {
            if (foo.isOK === true) {
                setTestList((prevTestsList) => prevTestsList.filter((Tests) => Tests.id !== test_.id));
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
        if (test.agent.id !== 0 && test.dateTest !== '') {
            return true;
        } else {
            return false;
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            readXlsxFile(file).then((rows) => {
                setData(rows as string[][]); // Rzutowanie typu rows na string[][]
            }).catch((error) => {
                console.error('Wystąpił błąd podczas wczytywania pliku Excel:', error);
            });
        }
    };

    async function loadFile() {

        const testList = prepareTestsList(data, userList);

        if (testList.length > 0) {
            api_Test_addAll(testList).then((foo => {
                if (foo.isOK === true) {
                    setTestList(testList);
                    toast.info(foo.callback, {
                        position: toast.POSITION.TOP_RIGHT, theme: "dark"
                    });
                } else {
                    toast.error(foo.callback, {
                        position: toast.POSITION.TOP_RIGHT, theme: "dark"
                    });
                }
            }));
        } else {
            toast.error("Wybierz plik zawierający testy", {
                position: toast.POSITION.TOP_RIGHT, theme: "dark"
            });
        }
    }

    return (
        <div className='container mx-auto w-full border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />

            {/* NAGŁÓWEK */}
            <div className='flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>

                <h1 className='text-4xl text-info mb-4 ml-2'>Testy</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* POBIERANIE, DODAWANIE, WCZYTYWANIE */}
            <div className='flex flex-col md:flex-row mt-5 gap-2 justify-center'>

                <div className='flex m-2'>
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

                <div className='flex gap-2'>
                    <button className="btn btn-outline btn-info m-2" onClick={openModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Dodaj pojedyńczy test
                    </button>

                    <div className=' flex gap-2 border-2 border-opacity-50 border-info'>
                        <input className="file-input file-input-bordered file-input-info w-full max-w-xs m-2" type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
                        <button className='btn btn-info w-20 m-2' onClick={loadFile}>Wczytaj testy</button>
                    </div>

                </div>
            </div>

            {/* MODAL */}
            <dialog id="my_modal_1" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <div className="flex flex-col items-center justify-center ml-10">
                        <span className='text-info'>Dodaj pojedyńczy test</span>
                        <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

                        <div className="flex flex-col mt-2">
                            <span className="label-text">Agent</span>
                            <select
                                className="select select-info w-72"
                                value={test.agent.id}
                                onChange={e => {
                                    test.agent = userList.find(user => user.id === parseInt(e.target.value)) || new User()
                                    setAgentId(parseInt(e.target.value))
                                }}>
                                <option value={0} disabled>Wybierz agenta ...</option>
                                {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                                    <option key={user.id} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex gap-2'>
                            <div className="flex flex-col mt-5">
                                <span className="label-text">Data</span>
                                <input type="date"
                                    className="input input-bordered input-info min-w-fit"
                                    defaultValue={test.dateTest}
                                    onChange={e => test.dateTest = e.target.value} />
                            </div>
                            <div className="flex flex-col mt-5">
                                <span className="label-text">Wynik</span>
                                <input type="number"
                                    className="input input-bordered input-info w-20"
                                    defaultValue={test.score}
                                    onChange={e => test.score = parseInt(e.target.value)} />
                            </div>
                            <div className="flex flex-col mt-5">
                                <span className="label-text">Próg</span>
                                <input type="number"
                                    className="input input-bordered input-info w-20"
                                    defaultValue={test.levelPass}
                                    onChange={e => test.levelPass = parseInt(e.target.value)} />
                            </div>
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
                                <th className=''>Imię i nazwisko</th>
                                <th className=''>Wynik</th>
                                <th>Próg</th>
                                <th>Data zaliczenia</th>
                                <th>Status</th>
                                <th>Akcja</th>
                            </tr>
                        </thead>
                        <tbody className="table-auto overflow-scroll w-full" >
                            {testList.map((tests, index) => {
                                return (
                                    <tr key={index}
                                        className={`hover:bg-base-300  hover:text-white cursor-pointer ${index === rowIndex ? 'bg-slate-950 text-white' : ''
                                            } cursor-pointer`}>
                                        <td>{tests.agent.nameUser}</td>
                                        <td>{tests.score}</td>
                                        <td>{tests.levelPass}</td>
                                        <td>{tests.dateTest}</td>
                                        <td>{TestLabels[tests.testPass]}</td>
                                        <td><button className="btn btn-outline btn-warning btn-sm"
                                            onClick={() => {
                                                deleteTests_click(tests)
                                            }}>
                                            Usuń
                                        </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Tests_Page