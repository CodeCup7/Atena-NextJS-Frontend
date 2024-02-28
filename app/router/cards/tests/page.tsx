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
import { calculateStartEndDate } from '@/app/global';
import { IconAdd, IconCalendar, IconDownload, IconTest } from '../../components/icons/icons';

const Tests_Page = () => {

    // ====== Hooks =====================================================================================================================================================================================================================
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
                setTest(new Test())

            } catch (error) {
                toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);

    // ====== Akcje =====================================================================================================================================================================================================================
    function downloadDate_Click() {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {

            async function fetchData() {
                try {
                    const { startDate, endDate } = calculateStartEndDate(dateValue + '-01', 0);
                    const testList = await api_Test_getDate(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'));
                    setTestList(testList);

                } catch (error) {
                    toast.error('Błąd pobierania Testsów', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    console.error('Błąd pobierania Testsów:', error);
                }
            }
            fetchData();

        } else {
            toast.error("Wybierz datę!", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }

    function addTests_click(): boolean {

        if (validate()) {

            api_Test_add(test).then((foo => {
                if (foo.isOK === true) {

                    setTestList((prevTestsList) => [...prevTestsList, foo.test]);
                    toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    return true;
                } else {
                    toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                }
            }));

        } else {
            toast.error("Uzupełnij poprawnie wszystkie pola", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
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

    // ====== Obsługa modala =====================================================================================================================================================================================================================
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

    // ====== Funkcje =====================================================================================================================================================================================================================
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
                toast.error('Wystąpił błąd podczas wczytywania pliku Excel:', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
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
                    toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                } else {
                    toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                }
            }));
        } else {
            toast.error("Wybierz plik zawierający testy", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }
    // ====== HTML =====================================================================================================================================================================================================================
    return (
        <div className='container mx-auto w-full border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />

            {/* NAGŁÓWEK */}
            <div className='flex items-center justify-center'>
                <IconTest size={12} className='text-info' />
                <h1 className='text-4xl text-info mb-4 ml-2'>Testy</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* POBIERANIE, DODAWANIE, WCZYTYWANIE */}
            <div className='flex flex-col md:flex-row mt-5 gap-2 justify-center'>

                <div className='flex m-2'>
                    <IconCalendar size={16} className='text-info mr-2' />
                    <input
                        value={dateValue}
                        onChange={e => { setDateValue(e.currentTarget.value); }}
                        type="month"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs" />
                    <button onClick={downloadDate_Click} className="btn btn-outline btn-info mx-2">
                        <IconDownload />
                        Pobierz dane
                    </button>
                </div>

                <div className='flex gap-2'>
                    <button className="btn btn-outline btn-info m-2" onClick={openModal}>
                        <IconAdd />
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
                            <IconAdd />
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