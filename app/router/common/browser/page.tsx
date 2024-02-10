'use client'
import { api_NoteCC_getDate, api_NoteCC_search } from '@/app/api/noteCC_api';
import { api_RateCC_search } from '@/app/api/rateCC_api';
import { api_RateM_search } from '@/app/api/rateM_api';
import { getActiveUser } from '@/app/auth';
import { StatusLabels, TypeLabels } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/rates/noteCC';
import { RateCC } from '@/app/classes/rates/rateCC';
import { RateM } from '@/app/classes/rates/rateM';
import { SearchCriteria } from '@/app/classes/filtrs/searchCriteria';
import { Role, User } from '@/app/classes/user';
import { getNoteCC_RateAs100 } from '@/app/factory/factory_noteCC';
import { getRateCC_RateAs100 } from '@/app/factory/factory_rateCC';
import { getRateM_RateAs100 } from '@/app/factory/factory_rateM';
import { updateUserList } from '@/app/factory/factory_user';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { api_Test_search } from '@/app/api/test_api';
import { api_Feedback_search } from '@/app/api/feedback_api';
import { Feedback, FeedbackLabels } from '@/app/classes/feedback';
import { Test, TestLabels } from '@/app/classes/test';
import { FiltrFeedback } from '@/app/classes/filtrs/feedback_filtr';
import { FiltrNoteCC } from '@/app/classes/filtrs/noteCC_Filtr';
import { FiltrRateCC } from '@/app/classes/filtrs/rateCC_filtr';
import { FiltrRateM } from '@/app/classes/filtrs/rateM_filtr';
import { FiltrTest } from '@/app/classes/filtrs/test_filtr';
import { createSearchCriteriaByFiltrFeedback, createSearchCriteriaByFiltrNoteCC, createSearchCriteriaByFiltrRateCC, createSearchCriteriaByFiltrRateM, createSearchCriteriaByFiltrTest } from '@/app/factory/factory_searchCriteria';

const Browser = () => {

    const [isPermit, setIsPermit] = useState(false);
    const [activeUser, setActiveUser] = useState(new User());
    const [userList, setUserList] = useState<Array<User>>([]);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [agentId, setAgentId] = useState(0);

    const [noteCC_List, setNoteCC_List] = useState<Array<NoteCC>>([]);
    const [rateCC_List, setRateCC_List] = useState<Array<RateCC>>([]);
    const [rateM_List, setRateM_List] = useState<Array<RateM>>([]);
    const [test_list, setTest_list] = useState<Array<Test>>([]);
    const [fb_List, setFb_List] = useState<Array<Feedback>>([]);

    const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                const user = await getActiveUser();
                setActiveUser(user);
                setUserList(users);

                const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
                setIsPermit(isPermit);

                // Walidacja roli. Możliwość pobrania tylko swoich danych przez agenta
                if (user.role === Role.AGENT_) {
                    setAgentId(user.id)
                }

            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, []);

    // ==== Obsługa przejścia z wyszukiwarki i wyświetlenia podglądu wyszukanych kryteriów ===
    const searchParams = useSearchParams();
    const fromSearch = searchParams.get('fromSearch');

    useEffect(() => {

        const fetchData = async () => {
            if (fromSearch != null) {
                const criteriaListNoteCC = localStorage.getItem('noteCCList_criteriaList');
                const criteriaListRateCC = localStorage.getItem('rateCCList_criteriaList');
                const criteriaListRateM = localStorage.getItem('rateMList_criteriaList');
                const criteriaListTest = localStorage.getItem('testList_criteriaList');
                const criteriaListFB = localStorage.getItem('feedbackList_criteriaList');

                if (criteriaListNoteCC !== null) {
                    const notelist = await api_NoteCC_search(JSON.parse(criteriaListNoteCC));
                    setNoteCC_List(notelist);
                    localStorage.removeItem('noteCCList_criteriaList');
                } else if (criteriaListRateCC !== null) {
                    const ratelist = await api_RateCC_search(JSON.parse(criteriaListRateCC));
                    setRateCC_List(ratelist);
                    setOpenTab(2)
                    localStorage.removeItem('rateCCList_criteriaList');
                } else if (criteriaListRateM !== null) {
                    const ratelist = await api_RateM_search(JSON.parse(criteriaListRateM));
                    setRateM_List(ratelist);
                    setOpenTab(3)
                    localStorage.removeItem('rateMList_criteriaList');
                } else if (criteriaListTest !== null) {
                    const testlist = await api_Test_search(JSON.parse(criteriaListTest));
                    setTest_list(testlist);
                    setOpenTab(4)
                    localStorage.removeItem('testList_criteriaList');
                } else if (criteriaListFB !== null) {
                    const fblist = await api_Feedback_search(JSON.parse(criteriaListFB));
                    setFb_List(fblist);
                    setOpenTab(5)
                    localStorage.removeItem('feedbackList_criteriaList');
                }
            }
        };
        fetchData();
    }, [fromSearch]);

    // ==== Pobranie danych bezpośrednio w przeglądarce ===
    async function downloadDate_Click() {

        if (dateStart !== '' && dateEnd !== '' && dateStart <= dateEnd) {

            const filtrNoteCC = new FiltrNoteCC();
            const filtrRateCC = new FiltrRateCC();
            const filtrRateM = new FiltrRateM();
            const filtrTest = new FiltrTest();
            const filtrFeedback = new FiltrFeedback();

            filtrNoteCC.appliesDateStart = dateStart
            filtrNoteCC.appliesDateEnd = dateEnd
            if (agentId !== 0) {
                filtrNoteCC.userCol.push(userList.find(user => user.id === agentId) || new User())
            }

            filtrRateCC.dateRateStart = dateStart
            filtrRateCC.dateRateEnd = dateEnd
            if (agentId !== 0) {
                filtrRateCC.userCol.push(userList.find(user => user.id === agentId) || new User())
            }

            filtrRateM.dateRateStart = dateStart
            filtrRateM.dateRateEnd = dateEnd
            if (agentId !== 0) {
                filtrRateM.userCol.push(userList.find(user => user.id === agentId) || new User())
            }

            filtrTest.dateTestStart = dateStart
            filtrTest.dateTestEnd = dateEnd
            if (agentId !== 0) {
                filtrTest.userCol.push(userList.find(user => user.id === agentId) || new User())
            }

            filtrFeedback.dateFeedbackStart = dateStart
            filtrFeedback.dateFeedbackEnd = dateEnd
            if (agentId !== 0) {
                filtrFeedback.userCol.push(userList.find(user => user.id === agentId) || new User())
            }

            const criteriaNoteCCList = createSearchCriteriaByFiltrNoteCC(filtrNoteCC);
            const criteriaRateCCList = createSearchCriteriaByFiltrRateCC(filtrRateCC);
            const criteriaRateMList = createSearchCriteriaByFiltrRateM(filtrRateM);
            const criteriaTestList = createSearchCriteriaByFiltrTest(filtrTest);
            const criteriaFbList = createSearchCriteriaByFiltrFeedback(filtrFeedback);

            const noteList = await api_NoteCC_search(criteriaNoteCCList);
            const rateCCList = await api_RateCC_search(criteriaRateCCList);
            const rateMList = await api_RateM_search(criteriaRateMList);
            const testList = await api_Test_search(criteriaTestList);
            const fblist = await api_Feedback_search(criteriaFbList);

            setNoteCC_List(noteList);
            setRateCC_List(rateCCList);
            setRateM_List(rateMList);
            setTest_list(testList);
            setFb_List(fblist);

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
                            disabled={!isPermit}
                            value={agentId}
                            onChange={e => {
                                setAgentId(parseInt(e.target.value))
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
                        data-toggle="tab" href="#link1" role="tablist" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <p className='ml-2'>Coachingi</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(2);
                        }}
                        data-toggle="tab" href="#link2" role="tablist" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
                        </svg>
                        <p className='ml-2'>Rozmowy</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 3 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(3);
                        }}
                        data-toggle="tab" href="#link3" role="tablist" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>


                        <p className='ml-2'>Maile</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 4 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(4);
                        }}
                        data-toggle="tab" href="#link4" role="tablist" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>

                        <p className='ml-2'>Testy</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(5);
                        }}
                        data-toggle="tab" href="#link5" role="tablist" >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                        </svg>
                        <p className='mx-2'>Pochwały i Skargi</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                        </svg>
                    </a>
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
                                    <th>Agent</th>
                                    <th>Typ</th>
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
                                            <td>{rateCC.agent.nameUser}</td>
                                            <td>{TypeLabels[rateCC.typeRate]}</td>
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
                {/* RateM TAB */}
                <div className={openTab === 3 ? "block" : "hidden"} id="link1">
                    <div className='flex items-center justify-center'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Data Oceny</th>
                                    <th>Coach</th>
                                    <th>Agent</th>
                                    <th>Ocena</th>
                                </tr>
                            </thead>
                            <tbody className="table-auto overflow-scroll w-full">
                                {rateM_List.map((rateM, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                                            <td>{rateM.dateRate}</td>
                                            <td>{rateM.coach.nameUser}</td>
                                            <td>{rateM.agent.nameUser}</td>
                                            <td>{getRateM_RateAs100(rateM)}</td>
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
                    </div>

                </div>
                {/* Test TAB */}
                <div className={openTab === 4 ? "block" : "hidden"} id="link1">
                    <div className='flex items-center justify-center'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Data testu</th>
                                    <th>Agent</th>
                                    <th>Ocena</th>
                                    <th>Próg</th>
                                    <th>Czy zdany</th>
                                </tr>
                            </thead>
                            <tbody className="table-auto overflow-scroll w-full">
                                {test_list.map((test, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                                            <td>{test.dateTest}</td>
                                            <td>{test.agent.nameUser}</td>
                                            <td>{test.score}</td>
                                            <td>{test.levelPass}</td>
                                            <td>{TestLabels[test.testPass]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
                {/* Feedback TAB */}
                <div className={openTab === 5 ? "block" : "hidden"} id="link1">
                    <div className='flex items-center justify-center'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Agent</th>
                                    <th>Feedback</th>
                                </tr>
                            </thead>
                            <tbody className="table-auto overflow-scroll w-full">
                                {fb_List.map((fb, index) => {
                                    return (
                                        <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                                            <td>{fb.dateFeedback}</td>
                                            <td>{fb.agent.nameUser}</td>
                                            <td>{FeedbackLabels[fb.feedback]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Browser;

