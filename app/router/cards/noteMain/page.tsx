'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Rate_Mode, StatusLabels, Status_Note } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/noteCC';
import { Get_NoteList_With_NoStartNote } from '@/app/factory/factory_noteCC';
import { RateCC } from '@/app/classes/rateCC';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import { updateUserList } from '@/app/factory/factory_user';
import { User } from '@/app/classes/user';
import { api_NoteCC_deleteNote, api_NoteCC_getDate } from '@/app/api/noteCC_api';
import { getActiveUser } from '@/app/auth';
import { getRateCC_Rate, getRateCC_RateAs100 } from '@/app/factory/factory_rateCC';
import { format } from 'date-fns';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { RateM } from '@/app/classes/rateM';
import { getRateM_RateAs100 } from '@/app/factory/factory_rateM';

export const NoteMain = () => {

    const [activeUser, setActiveUser] = useState(new User());

    const [rowIndex, setRowIndex] = useState(-1);
    const [rowRateIndex, setRowRateIndex] = useState(-1);
    const [newRateModal, setOpenNewRateModal] = useState(false);

    const [dateValue, setDateValue] = useState('');
    const [openTab, setOpenTab] = useState(1);

    const [selectedNoteCC, setSelectedNoteCC] = useState(new NoteCC);
    const [selectedRateCC, setSelectedRateCC] = useState(new RateCC);
    const [selectedRateM, setSelectedRateM] = useState(new RateM);

    const [noteList, setNoteList] = useState<Array<NoteCC>>([]);
    const [downloadList, setDowloadList] = useState<Array<NoteCC>>([]);

    const [userList, setUserList] = useState<Array<User>>([]);

    const [agentFilter, setAgentFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                const user = await getActiveUser();
                setUserList(users);
                setActiveUser(user);

                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().slice(0, 7); // YYYY-MM
                setDateValue(formattedDate);

            } catch (error) {
                console.error('Błąd pobierania użytkowników:', error);
            }
        }
        fetchData();

    }, []);

    useEffect(() => {
        const emptyNoteCC = new NoteCC();
        const emptyRateCC = new RateCC();
        const emptyRateM = new RateM();
        emptyNoteCC.id = -1;
        emptyRateCC.id = -1;
        emptyRateM.id = -1;
        setSelectedNoteCC(emptyNoteCC);
        setSelectedRateCC(emptyRateCC);
        setSelectedRateM(emptyRateM);
        setRowRateIndex(-1);
        setRowIndex(-1);
    }, [noteList]);

    const [choiseRateCC, setChoiseRateCC] = useState<Array<RateCC>>([]);
    const [choiseRateM, setChoiseRateM] = useState<Array<RateM>>([]);

    function checkboxRateCCHandler(rateCC: RateCC) {

        const isSelected = choiseRateCC.find(r => r.id === rateCC.id)

        if (isSelected) {
            const updatedChoiseRateCC = choiseRateCC.filter((r) => r.id !== rateCC.id);
            setChoiseRateCC(updatedChoiseRateCC);
        } else {
            setChoiseRateCC((prevChoiseRateCC) => [...prevChoiseRateCC, rateCC]);
        }
    }
    function checkboxRateMHandler(rateM: RateM) {

        const isSelected = choiseRateM.find(r => r.id === rateM.id)

        if (isSelected) {
            const updatedChoiseRateM = choiseRateM.filter((r) => r.id !== rateM.id);
            setChoiseRateM(updatedChoiseRateM);
        } else {
            setChoiseRateM((prevChoiseRateM) => [...prevChoiseRateM, rateM]);
        }
    }

    // ====== FUNKCJE ==========================================
    function getCoaching(dateValue: string) {

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
                    const getExistNoteList = await api_NoteCC_getDate(format(new Date(startDate), 'yyyy-MM-dd'), format(new Date(endDate), 'yyyy-MM-dd'));
                    const noteList = await Get_NoteList_With_NoStartNote(userList, getExistNoteList, dateValue);

                    setNoteList(noteList);

                } catch (error) {
                    console.error('Błąd pobierania użytkowników:', error);
                }
            }
            fetchData();
        }
    }

    function filterService() {

        if (agentFilter === 'ALL' && statusFilter === 'ALL') {// Filtr wszystko
            setNoteList(downloadList)
        } else if (agentFilter === 'MY' && statusFilter === 'ALL') { // Filtr dla MOICH i wszytskich statusów
            setNoteList(downloadList.filter(note => note.agent.coachId === activeUser.id));
        } else if (agentFilter === 'MY' && statusFilter != 'ALL') { // Filtr dla MOICH i wybranego statusu)
            setNoteList(downloadList.filter(note => note.agent.coachId === activeUser.id && note.status === statusFilter));
        } else if (agentFilter === 'ALL' && statusFilter != 'ALL') { // Filtr dla wszystkich i wybranego statusu
            setNoteList(downloadList.filter(note => note.status === statusFilter));
        }
    }

    const [notePath, setNotePath] = useState('/router/cards/noteCC');

    // Karta coucha aktywna tylko wtedy gdy użytkownik przypisze oceny do coachingu lub gdy coaching jest w trybie podglądu
    useEffect(() => {
        setNotePath(choiseRateCC.length !== 0 || selectedNoteCC.mode === Rate_Mode.PREVIEW_ ? '/router/cards/noteCC' : '');
    }, [choiseRateCC.length, selectedNoteCC.mode]);


    // ====== OBSŁUGA PRZYCISKÓW ======================================================
    function downloadDate_Click() {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {
            getCoaching(dateValue);
        } else {
            toast.error("Wybierz datę!", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        }
    }
    function coaching_Click() {

        if (selectedNoteCC.mode === Rate_Mode.NEW_) { // Nowy Coaching
            //Sprawdzenie czy wybrano rozmowy do coachingu
            if (choiseRateCC.length === 0) {
                toast.error("Nie wybrano żadnych rozmów do coachingu", {
                    position: toast.POSITION.TOP_RIGHT,
                    theme: "dark"
                });
                return false;
            } else {
                selectedNoteCC.rateCC_Col = choiseRateCC //Przypisanie wybrnaych rozmów do coachingu
                selectedNoteCC.rateM_Col = choiseRateM //Przypisanie wybrnaych maili do coachingu
                localStorage.removeItem('noteCC_prev');
                localStorage.setItem('noteCC_new', JSON.stringify(selectedNoteCC))
                return true;
            }
        } else { //Podgląd coachingu
            localStorage.removeItem('noteCC_new');
            localStorage.setItem('noteCC_prev', JSON.stringify(selectedNoteCC))
            return true;
        }
    }

    //Usuwanie coachingu - usuwa coaching z bazy i rozwiązuje powiązane z nim oceny ustawiajac pole noteCC_id w DB jako NULL
    function deleteCoaching_Click() {
        setOpenNewRateModal(false);

        api_NoteCC_deleteNote(selectedNoteCC).then((foo => {
            if (foo.isOK === true) {
                getCoaching(dateValue);
                toast.info(foo.callback, {
                    position: toast.POSITION.TOP_RIGHT, theme: "dark"
                });
            } else {
                toast.error(foo.callback, {
                    position: toast.POSITION.TOP_RIGHT, theme: "dark"
                });
            }
        }));
    }

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <ConfirmDialog open={newRateModal} onClose={() => setOpenNewRateModal(false)} onConfirm={() => {
                deleteCoaching_Click
            }}
                title='Potwierdź decyzję' content={'Czy napewno chcesz usunąć coaching agenta ' + selectedNoteCC.agent.nameUser + ' ?'} />
            <div className='flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-info w-12 h-12">
                    <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <h1 className='text-info text-3xl text-center ml-3'> Menu monitoringu</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* Data */}
            <div className='flex flex-col items-center justify-center mt-1'>
                <div className='flex mt-5'>
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
            </div>

            {/* Coachingi */}
            <div className='flex flex-col xl:flex-row p-2'>

                <div className="overflow-x-auto mr-6 mt-6">
                    <div className='flex items-center justify-start'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-info w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        <h1 className='text-info text-2xl text-center ml-3'> Coachingi</h1>
                    </div>

                    <table className="table min-w-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>
                                    <select className="select select-bordered select-sm w-full max-w-xs"
                                        defaultValue={'ALL'}
                                        onChange={e => {
                                            setAgentFilter(e.target.value)
                                        }}>
                                        <option value="MY">Moi</option>
                                        <option value="ALL">Wszyscy</option>
                                    </select>
                                </th>
                                <th>
                                    <select className="select select-bordered select-sm w-fit max-w-xs"
                                        defaultValue={'DEFAULT'}
                                        onChange={e => { setStatusFilter(e.target.value) }}>
                                        <option value="DEFAULT">Wszystkie</option>
                                        <option> {StatusLabels[Status_Note.NO_START_]} </option>
                                        <option> {StatusLabels[Status_Note.CLOSE_]} </option>
                                        <option> {StatusLabels[Status_Note.CLOSE_WITHOUT_]} </option>
                                    </select>
                                </th>
                                <th>
                                    <button className='btn' onClick={filterService}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                        </svg>
                                        Filtruj
                                    </button>
                                </th>

                            </tr>
                        </thead>
                        <tbody className="table-auto overflow-scroll w-full" >
                            {noteList.map((noteCC, index) => {
                                return (
                                    <tr key={index}
                                        onClick={() => {
                                            setSelectedNoteCC(noteCC);
                                            setRowIndex(index)
                                        }}
                                        className={`hover:bg-base-300  hover:text-white cursor-pointer ${index === rowIndex ? 'bg-slate-950 text-white' : ''
                                            } cursor-pointer`}>

                                        <td>{noteCC.agent.nameUser}</td>
                                        <td>{StatusLabels[noteCC.status]}</td>
                                        <td>{noteCC.appliesDate}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>

                    <div className={`flex gap-2 mt-2 disabled: ${selectedNoteCC.id > - 1} `}>

                        <Link className={`group link link-accent link-hover text-lg ${selectedNoteCC.id === - 1 ? 'pointer-events-none' : ''}`}
                            href={{
                                pathname: notePath
                            }}>
                            <button className="btn btn-outline btn-info btn-sm"
                                disabled={selectedNoteCC.id === -1}
                                onClick={coaching_Click}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>
                                {selectedNoteCC.id === 0 ? "Rozpocznij coaching" : "Podgląd"}
                            </button>
                        </Link>

                        <button className="btn btn-outline btn-error btn-sm"
                            disabled={selectedNoteCC.status === Status_Note.NO_START_}
                            onClick={deleteCoaching_Click}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Usuń
                        </button>
                    </div>

                </div>

                {/* Oceny */}
                <div className='mt-2 ml-14'>
                    <div className="tabs justify-start items-center">

                        <a className={"tab tab-bordered tab- sm:tab-sm md:tab-lg text-xs" + (openTab === 1 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenTab(1);
                            }}
                            data-toggle="tab" href="#link1" role="tablist" > Rozmowy </a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenTab(2);
                            }}
                            data-toggle="tab" href="#link2" role="tablist" > Maile </a>

                    </div>

                    {/* <!-- Tab content --> */}
                    <div className="flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">
                        {/* # Rozmowy TAB */}
                        <div className={openTab === 1 ? 'block' : 'hidden'} id="link1">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    onClick={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.checked ? setChoiseRateCC(selectedNoteCC.rateCC_Col) : setChoiseRateCC([])
                                                    }} />
                                            </th>
                                            <th>Data rozmowy</th>
                                            <th>Kolejka</th>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
                                            <th>Data udost.</th>
                                            <th>Coaching id.</th>
                                            <th>Szczegóły</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto overflow-scroll w-full">
                                        {selectedNoteCC.rateCC_Col.map((rateCC, index) => {
                                            return (
                                                <tr key={index}
                                                    onClick={() => {
                                                        setSelectedRateCC(rateCC);
                                                        setRowRateIndex(index)
                                                        checkboxRateCCHandler(rateCC) // Obsługa zaznaczenia checkboxa
                                                    }}
                                                    className="hover:bg-base-300  hover:text-white cursor-pointe">
                                                    <td>
                                                        <input type="checkbox" className="checkbox checkbox-info"
                                                            checked={choiseRateCC.some((r) => r.id === rateCC.id)}
                                                            onChange={() => { }}
                                                        />
                                                    </td>
                                                    <td>{rateCC.dateCall}</td>
                                                    <td>{rateCC.queue.nameQueue}</td>
                                                    <td>{getRateCC_RateAs100(rateCC)}</td>
                                                    <td>{rateCC.dateRate}</td>
                                                    <td>{rateCC.dateShare}</td>
                                                    <td>{selectedNoteCC.id}</td>
                                                    <td>
                                                        <Link className="group link link-info link-hover text-lg"
                                                            href='/router/cards/rateCC'>
                                                            <button className="btn btn-outline btn-info btn-sm"
                                                                onClick={() => {
                                                                    localStorage.removeItem('rateCC_prev');
                                                                    localStorage.setItem('rateCC_prev', JSON.stringify(rateCC));
                                                                }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                </svg>
                                                                Podgląd
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                <div className='flex gap-2 mt-2'>

                                    <Link className="group link link-info link-hover text-lg"
                                        href="/router/cards/rateCC"
                                        onClick={() => {
                                            localStorage.removeItem('rateCC_prev');
                                        }}>
                                        <button className="group btn btn-outline btn-info btn-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:stroke-blue-50">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Nowa
                                        </button>
                                    </Link>

                                    <button className="btn btn-outline btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                        </svg>
                                        Udost. Rozmowy
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                        </svg>
                                        Dołącz rozłącz
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        Aktualizuj
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* # Maile TAB */}
                        <div className={openTab === 2 ? "block" : "hidden"} id="link2">

                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    onClick={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.checked ? setChoiseRateM(selectedNoteCC.rateM_Col) : setChoiseRateM([])
                                                    }} />
                                            </th>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
                                            <th>Data udost.</th>
                                            <th>Coaching id.</th>
                                            <th>Szczegóły</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto overflow-scroll w-full">
                                        {selectedNoteCC.rateM_Col.map((rateM, index) => {
                                            return (
                                                <tr key={index}
                                                    onClick={() => {
                                                        setSelectedRateM(rateM);
                                                        setRowRateIndex(index)
                                                        checkboxRateMHandler(rateM) // Obsługa zaznaczenia checkboxa
                                                    }}
                                                    className="hover:bg-base-300  hover:text-white cursor-pointe">
                                                    <td>
                                                        <input type="checkbox" className="checkbox checkbox-info"
                                                            checked={choiseRateM.some((r) => r.id === rateM.id)}
                                                            onChange={() => { }}
                                                        />
                                                    </td>
                                                    <td>{getRateM_RateAs100(rateM)}</td>
                                                    <td>{rateM.dateRate}</td>
                                                    <td>{rateM.dateShare}</td>
                                                    <td>{selectedNoteCC.id}</td>
                                                    <td>
                                                        <Link className="group link link-info link-hover text-lg"
                                                            href='/router/cards/rateM'>
                                                            <button className="btn btn-outline btn-info btn-sm"
                                                                onClick={() => {
                                                                    localStorage.removeItem('rateM_prev');
                                                                    localStorage.setItem('rateM_prev', JSON.stringify(rateM));
                                                                }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                </svg>
                                                                Podgląd
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                <div className='flex gap-2 mt-2'>

                                    <Link className="group link link-info link-hover text-lg"
                                        href="/router/cards/rateM"
                                        onClick={() => {
                                            localStorage.removeItem('rateM_prev');
                                        }}>
                                        <button className="group btn btn-outline btn-info btn-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:stroke-blue-50">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Nowa
                                        </button>
                                    </Link>

                                    <button className="btn btn-outline btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                        </svg>
                                        Udost. Rozmowy
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                                        </svg>
                                        Dołącz rozłącz
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                        Aktualizuj
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div >
    )
}

export default NoteMain;

