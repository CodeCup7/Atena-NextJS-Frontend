'use client'
import { api_NoteCC_getDate, api_NoteCC_search } from '@/app/api/noteCC_api';
import { api_RateCC_search } from '@/app/api/rateCC_api';
import { getActiveUser } from '@/app/auth';
import { StatusLabels } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/noteCC';
import { RateCC } from '@/app/classes/rateCC';
import { SearchCriteria } from '@/app/classes/searchCriteria';
import { Role, User } from '@/app/classes/user';
import { getNoteCC_RateAs100 } from '@/app/factory/factory_noteCC';
import { getRateCC_RateAs100 } from '@/app/factory/factory_rateCC';
import { updateUserList } from '@/app/factory/factory_user';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const Browser = () => {

    // ====== Ustawienie i kontrola active usera ==========================================
    const [isPermit, setIsPermit] = useState(false);
    const [activeUser, setActiveUser] = useState(new User());
    const [userList, setUserList] = useState<Array<User>>([]);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [agent, setAgent] = useState(0);

    // Pobrane dane
    const [noteCC_List, setNoteCC_List] = useState<Array<NoteCC>>([]);
    const [rateCC_List, setRateCC_List] = useState<Array<RateCC>>([]);
    // const [rateM_List, setRateM_List] = useState<Array<RateM>>([]);
    // const [test_list, setTest_list] = useState<Array<User>>([]);
    // const [fb_List, setFb_List] = useState<Array<User>>([]);

    const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek

    // Pobranie danych (użytkownicy, kolejki). Sprawdzenie czy nowa ocena czy podgląd.
    useEffect(() => {

        async function fetchData() {
            try {
                const users = await updateUserList();
                const user = await getActiveUser();
                setActiveUser(user);
                setUserList(users);

                const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
                setIsPermit(isPermit);

            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);


    async function downloadDate_Click() {

        if(dateStart !== '' && dateEnd !== '' && dateStart <= dateEnd){

            const criteriaList: SearchCriteria[] = []

            const dateCriteria = new SearchCriteria();
            dateCriteria.key = 'appliesDate'
            dateCriteria.operation = 'BETWEEN'
            dateCriteria.value = dateStart + " AND " + dateEnd

            criteriaList.push(dateCriteria)

            if(agent !== 0){
                const agentCriteria = new SearchCriteria();
                agentCriteria.key = 'agent'
                agentCriteria.operation = ':'
                agentCriteria.value = agent.toString();
                criteriaList.push(agentCriteria)
            }
            
            const noteList = await api_NoteCC_search(criteriaList);
            setNoteCC_List(noteList);

            dateCriteria.key = 'dateRate'

            const rateList = await api_RateCC_search(criteriaList);
            setRateCC_List(rateList);
        } else {
            toast.error("Uzupełnij poprawnie daty", {
                position: toast.POSITION.TOP_RIGHT, theme: "dark"
            });
        }
    }

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <div className='flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                <h1 className='text-info text-3xl text-center ml-3'> Przeglądarka ocen</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>
            {/* Nagłówek pobierania danych */}
            <div className='flex sm:flex-col lg:flex-row justify-center mt-1'>

                <div className='flex sm:flex-col lg:flex-row mt-5 items-center justify-center'>
                    <div className="flex flex-col ">
                        <span className="label-text">Data od: <span className="label-text text-red-600">*</span></span>
                        <input
                            className="input input-bordered w-full max-w-xs"
                            value={dateStart}
                            onChange={e => { setDateStart(e.currentTarget.value) }}
                            type="date"
                            placeholder="Type here"
                        />
                    </div>

                    <div className="flex flex-col mr-2 ml-4">
                    <span className="label-text">Data do: <span className="label-text text-red-600">*</span></span>
                        <input
                            className="input input-bordered w-full max-w-xs"
                            value={dateEnd}
                            onChange={e => { setDateEnd(e.currentTarget.value) }}
                            type="date"
                            placeholder="Type here"
                        />
                    </div>

                    <div className="flex flex-col mr-2">
                        <span className="label-text">Agent:</span>
                        <select
                            className="select select-info w-72"
                            value={agent}
                            onChange={e => {
                                setAgent(parseInt(e.target.value))
                            }}>
                            <option value={0} disabled>Wybierz agenta ...</option>
                            {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                                <option key={user.id} value={user.id}>{user.nameUser}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end sm:mt-3 ">
                        <button onClick={downloadDate_Click} className="btn btn-outline btn-info mx-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Pobierz dane
                        </button>
                    </div>
                </div>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-3"></hr>
            <div className='col-span-12 mt-2'>
                <div className="tabs justify-center items-center w-full">

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 1 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(1);
                        }}
                        data-toggle="tab" href="#link1" role="tablist" > Coachingi </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(2);
                        }}
                        data-toggle="tab" href="#link2" role="tablist" > Rozmowy </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 3 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(3);
                        }}
                        data-toggle="tab" href="#link3" role="tablist" > E-Mail </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 4 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(4);
                        }}
                        data-toggle="tab" href="#link4" role="tablist" > Testy </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(5);
                        }}
                        data-toggle="tab" href="#link5" role="tablist" > Feedback </a>
                </div>
            </div>
            {/* <!-- Tab content --> */}
            <div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">

                {/* NoteCC TAB */}
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                    <div className='flex items-center justify-center'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Miesiąc</th>
                                    <th>Data coachingu</th>
                                    <th>Ocena</th>
                                    <th>Coach</th>
                                    <th>Agent</th>
                                    <th>Odwołanie</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className="table-auto overflow-scroll w-full">
                                {noteCC_List.map((noteCC, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                                            <td>{noteCC.appliesDate}</td>
                                            <td>{noteCC.coachDate}</td>
                                            <td>{getNoteCC_RateAs100(noteCC)}</td>
                                            <td>{noteCC.coach.nameUser}</td>
                                            <td>{noteCC.agent.nameUser}</td>
                                            <td>{noteCC.odwolanie !== '' ? 'Tak' : 'Nie'}</td>
                                            <td>{StatusLabels[noteCC.status]}</td>
                                            <td>
                                                <Link className="group link link-info link-hover text-lg"
                                                    href='/router/cards/noteCC'>
                                                    <button className="btn btn-outline btn-info btn-sm"
                                                        onClick={() => {
                                                            localStorage.removeItem('noteCC_new');
                                                            localStorage.setItem('noteCC_prev', JSON.stringify(noteCC))
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
                    </div>
                </div>
                {/* RateCC TAB */}
                <div className={openTab === 2 ? "block" : "hidden"} id="link1">
                    <div className='flex items-center justify-center'>
                        <table className="table">

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
                                {rateCC_List.map((rateCC, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                                            <td>{rateCC.dateRate}</td>
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
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link1">
                    <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>
                        E-Mail
                    </div>

                </div>
                <div className={openTab === 4 ? "block" : "hidden"} id="link1">

                </div>
                <div className={openTab === 5 ? "block" : "hidden"} id="link1">
                    <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                        Feadback
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Browser;

