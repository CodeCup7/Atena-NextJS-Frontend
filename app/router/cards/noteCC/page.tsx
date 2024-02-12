'use client'
import { ModeLabels, Rate_Mode, StatusLabels, Status_Note } from '@/app/classes/enums';
import { CreateNewEmptyNoteCC, getNoteCC_Rate, getNoteCC_RateAs100 } from '@/app/factory/factory_noteCC';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Role, User } from '@/app/classes/user';
import { NoteCC } from '@/app/classes/rates/noteCC';
import { getActiveUser } from '@/app/auth';
import { getRateCC_RateAs100 } from '@/app/factory/factory_rateCC';
import { NoteCC_Chart } from '../../components/chart/noteCC_chart';
import { api_NoteCC_add, api_NoteCC_update } from '@/app/api/noteCC_api';
import { RateCC } from '@/app/classes/rates/rateCC';
import Link from 'next/link';
import { format } from 'date-fns';

const NoteCC_Page = () => {

    // ====== Ustawienie i kontrola active usera ==========================================
    const [activeUser, setActiveUser] = useState(new User());
    const [isPermit, setIsPermit] = useState(false);
    const [isPermitAgent, setIsPermitAgent] = useState(false);

    const [noteCC, setNoteCC] = useState(CreateNewEmptyNoteCC(activeUser));
    const [prewievMode, setPreviewMode] = useState(false);

    const [noteTab, setOpenNoteTab] = React.useState(1);
    const [rateTab, setOpenRateTab] = React.useState(1);
    const [prevNoteHide, setPrevNoteHide] = React.useState(true);
    const [score, setScore] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getActiveUser();
                setActiveUser(user);
                const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
                setIsPermit(isPermit);

                const noteCC_prev = localStorage.getItem('noteCC_prev');
                const noteCC_new = localStorage.getItem('noteCC_new');

                if (noteCC_prev != null) {
                    const note: NoteCC = JSON.parse(noteCC_prev);
                    note.mode = Rate_Mode.PREVIEW_;

                    const isPermitAgent: boolean = user.role === Role.AGENT_ && note.agent.id === user.id; // Sprawdzenie czy agent ma uprawnienia do karty (swojej)
                    setIsPermitAgent(isPermitAgent)

                    updateNoteCC(note)
                } else if (noteCC_new != null) {
                    const note: NoteCC = JSON.parse(noteCC_new);
                    note.mode = Rate_Mode.NEW_;
                    updateNoteCC(note)
                } else {
                    console.log('Bład ustawienia NoteCC')
                }

            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);

    // ====== FUNKCJE ==========================================
    function updateNoteCC(noteCC: NoteCC) {
        setNoteCC(noteCC);
        setScore(getNoteCC_RateAs100(noteCC))
        noteCC.mode === Rate_Mode.PREVIEW_ ? setPreviewMode(true) : setPreviewMode(false);
    }

    function validate(): boolean {
        if (noteCC.coachDate != "")
            return true;
        else {
            return false;
        }
    }

    // ====== OBSŁUGA PRZYCISKÓW ======================================================
    function rateBtn_Click() {

        if (validate()) {
            if (noteCC.id === 0) {
                api_NoteCC_add(noteCC).then((foo => {
                    if (foo.isOK === true) {

                        const note: NoteCC = foo.noteCC; // Aktualizacja oceny o ID z DB
                        note.mode = Rate_Mode.PREVIEW_;
                        updateNoteCC(note)

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
                api_NoteCC_update(noteCC).then((foo => {
                    if (foo.isOK === true) {

                        noteCC.mode = Rate_Mode.PREVIEW_;
                        updateNoteCC(noteCC)

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
        } else {
            toast.error("Wybierz date coachingu", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        }
    }

    function editBtn_Click() {

        if (isPermit) {
            noteCC.mode = Rate_Mode.EDIT_;
            updateNoteCC(noteCC)
            toast.warning("Włączono tryb edycji", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        } else {
            toast.error("Nie masz uprawnień do edytowania", { autoClose: 15000 })
        }
    }
    function odwolanie_click() {

        if (isPermitAgent) {

            noteCC.status = Status_Note.APPEAL_;

            api_NoteCC_update(noteCC).then((foo => {
                if (foo.isOK === true) {

                    noteCC.mode = Rate_Mode.PREVIEW_;
                    updateNoteCC(noteCC)

                    toast.info("Odwołanie zostało poprawnie zamieszczone", {
                        position: toast.POSITION.TOP_RIGHT, theme: "dark"
                    });
                } else {
                    toast.error("Błąd wysyłania odwołania", {
                        position: toast.POSITION.TOP_RIGHT, theme: "dark"
                    });
                }
            }));
        }
    }

    console.log(noteCC)

    return (
        <div className='container mx-auto w-full border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            {/* Nagłówek */}
            <div className='grid grid-cols-12'>
                <div className="col-span-2 navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)}
                                onClick={e => {
                                    noteCC.status = Status_Note.CLOSE_
                                    rateBtn_Click();
                                }}>
                                {noteCC.mode === Rate_Mode.EDIT_ ? 'Aktualizuj' : 'Zatwierdź'}
                            </button>
                            <button className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)}
                                onClick={e => {
                                    noteCC.status = Status_Note.CLOSE_WITHOUT_
                                    rateBtn_Click();
                                }}>
                                Zamknij BEZ</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && !prewievMode)} onClick={editBtn_Click} >Włącz edytowanie</button>
                            <button className="btn btn-outline btn-info btn-sm">Export do xls</button>
                            <button className="btn btn-outline btn-info btn-sm">Export do mail</button>
                        </ul>
                    </div>
                </div>
                <div className="col-span-2">
                    <p className={`justify-center  {rateCC.mode === Rate_Mode.PREVIEW_ as Rate_Mode ? 'text-yellow-600' : rateCC.mode === Rate_Mode.NEW_ as Rate_Mode ? 'text-green-500' : 'text-red-700'}`}>Tryb: {ModeLabels[noteCC.mode]}</p>
                </div>
                <div className="col-span-4">
                    <h1 className='text-info text-3xl text-center justify-center'># Karta Coucha</h1>
                </div>
                <div className='col-span-4'>
                    <p className='text-right mr-2'>{noteCC.id > 0 ? "id:" + noteCC.id : ''}</p>
                </div>
            </div>

            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            <div className='flex sm:flex-col md:flex-row mt-5'>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2 items-center justify-center'>
                        <div>
                            <h1 className='text-center text-4xl'>Informacje</h1>
                            <p className='text-center'>{StatusLabels[noteCC.status]}</p>
                        </div>

                        {/* Wykres */}
                        <div className="col-span-12 md:col-span-2 md:row-span-2 flex justify-center items-center">
                            <div className='mt-5'><NoteCC_Chart value={score} /></div>
                        </div>

                        <div className='flex flex-col items-center justify-center'>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Coaching za miesiąc</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    type="month"
                                    disabled
                                    defaultValue={noteCC.appliesDate} />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Data przeprowadzenia coachingu</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    type="date"
                                    disabled={prewievMode}
                                    defaultValue={noteCC.coachDate}
                                    onChange={e => {
                                        noteCC.coachDate = e.target.value;
                                    }} />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Coach</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    disabled
                                    defaultValue={noteCC.coach.nameUser}
                                    type="text"
                                />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Agent</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    disabled
                                    defaultValue={noteCC.agent.nameUser}
                                    type="text"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Zakładki - Main DIV */}
                <div className='flex flex-col ml-10 w-full'>
                    <div className="tabs">

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (noteTab === 1 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenNoteTab(1);
                            }}
                            data-toggle="tab" href="#link1" role="tablist" > Zalecenia </a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (noteTab === 2 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenNoteTab(2);
                            }}
                            data-toggle="tab" href="#link2" role="tablist" > Odwołanie</a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (noteTab === 3 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenNoteTab(3);
                            }}
                            data-toggle="tab" href="#link3" role="tablist" > Dashboard </a>

                    </div>

                    {/* <!-- Tab content --> */}
                    <div className=" flex flex-col break-words mb-6 tab-content tab-space ">

                        {/* # Zalecenia TAB */}
                        <div className={noteTab === 1 ? "block" : "hidden"} id="link1">
                            <div className='flex flex-col mt-2'>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span>Zalecenia (Bieżący Coaching)</span>
                                    </div>
                                    <textarea className="textarea textarea-bordered textarea-lg w-full"
                                        disabled={!isPermit || (isPermit && prewievMode)}
                                        defaultValue={noteCC.zalecenia}
                                        onChange={e => noteCC.zalecenia = e.target.value}
                                    />
                                </label>
                            </div>

                            <div className='flex flex-col mt-2'>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span>Zalecenia (Poprzedni Coaching)</span>
                                        <button className='btn btn-outline btn-info btn-sm'
                                            onClick={() => setPrevNoteHide(!prevNoteHide)}
                                        >{prevNoteHide === true ? 'Pokaż' : 'Ukryj'}</button>
                                    </div>
                                    <textarea className={`textarea textarea-bordered textarea-lg w-full ${prevNoteHide === true ? 'hidden' : ''}`}
                                        disabled
                                    />
                                </label>
                            </div>
                        </div>

                        {/* # Odwołanie TAB */}
                        <div className={noteTab === 2 ? "block" : "hidden"} id="link2">
                            <div className='flex flex-col mt-2 justify-center items-center'>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span>Odwołanie agenta</span>
                                    </div>
                                    <div className='flex flex-row mt-2 justify-center items-center' >
                                        <textarea className="textarea textarea-bordered textarea-lg w-full"
                                            disabled={!isPermitAgent || noteCC.status === Status_Note.APPEAL_}
                                            defaultValue={noteCC.odwolanie}
                                            onChange={e => noteCC.odwolanie = e.target.value} />
                                        <button className='btn btn-outline btn-info btn-sm m-2'
                                            disabled={!isPermitAgent || noteCC.status === Status_Note.APPEAL_}
                                            onClick={odwolanie_click}>
                                            Wyślij odwołanie</button>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* # Dashboard TAB */}
                        <div className={noteTab === 3 ? "block" : "hidden"} id="link3">

                        </div>

                    </div>

                    <div className="tabs">

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (rateTab === 1 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenRateTab(1);
                            }}
                            data-toggle="tab" href="#link1" role="tablist" > Rozmowy </a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (rateTab === 2 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenRateTab(2);
                            }}
                            data-toggle="tab" href="#link2" role="tablist" > Maile</a>

                    </div>

                    {/* <!-- Tab content --> */}
                    <div className=" flex flex-col md:w-96 lg:w-full  break-words mb-6 tab-content tab-space">

                        {/* # Rozmowy TAB */}
                        <div className={rateTab === 1 ? "block" : "hidden"} id="link1">
                            <div className="overflow-x-auto">

                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>Data rozmowy</th>
                                            <th>Kolejka</th>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
                                            <th>Data udost.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto overflow-scroll w-full">
                                        {noteCC.rateCC_Col.map((rateCC, index) => {
                                            return (
                                                <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                                                    <td>{rateCC.queue.nameQueue}</td>
                                                    <td>{getRateCC_RateAs100(rateCC)}</td>
                                                    <td>{rateCC.dateRate}</td>
                                                    <td>{rateCC.dateShare}</td>
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
                                            )})}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* # Maile TAB */}
                        <div className={rateTab === 2 ? "block" : "hidden"} id="link2">
                            <div className="overflow-x-auto">
                                <table className="table">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
                                            <th>Data udost.</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div className='flex gap-2 mt-2'>
                                    <button className="btn btn-outline btn-info btn-sm">Podgląd</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteCC_Page
