'use client'
import { api_NoteCC_search } from '@/app/api/noteCC_api';
import { api_rateCC_search } from '@/app/api/rateCC_api';
import { api_rateM_search } from '@/app/api/rateM_api';
import { getActiveUser } from '@/app/auth';
import { StatusLabels, TypeLabels } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/rates/noteCC';
import { RateCC } from '@/app/classes/rates/rateCC';
import { RateM } from '@/app/classes/rates/rateM';
import { Role, User } from '@/app/classes/user';
import { getNoteCC_RateAs100 } from '@/app/factory/factory_noteCC';
import { getRateCC_RateAs100 } from '@/app/factory/factory_rateCC';
import { getRateM_RateAs100 } from '@/app/factory/factory_rateM';
import { updateUserList } from '@/app/factory/factory_user';
import Link from 'next/link';
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
import { IconBrowser, IconDownload, IconFeedbackDown, IconFeedbackUp, IconNoteCC, IconPreview, IconRateCC, IconRateM, IconTest } from '../../components/icons/icons';

const Browser = () => {

    // ====== Hooks =====================================================================================================================================================================================================================
    const [isPermit, setIsPermit] = useState(false);
    const [userList, setUserList] = useState<Array<User>>([]);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [agentId, setAgentId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
                setUserList(users);
                downloadDate();

                const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
                setIsPermit(isPermit);

                // Walidacja roli. Możliwość pobrania tylko swoich danych przez agenta
                if (user.role === Role.AGENT_) {
                    setAgentId(user.id)
                }

            } catch (error) {
                toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" })
                console.log('Błąd pobierania użytkowników', error);
            }
        }
        fetchData();
    }, []);

    async function downloadDate() {

        try {
            setIsLoading(true);
            const criteriaListNoteCC = sessionStorage.getItem('noteCCList_criteriaList');
            const criteriaListRateCC = sessionStorage.getItem('rateCCList_criteriaList');
            const criteriaListRateM = sessionStorage.getItem('rateMList_criteriaList');
            const criteriaListTest = sessionStorage.getItem('testList_criteriaList');
            const criteriaListFB = sessionStorage.getItem('feedbackList_criteriaList');

            if (criteriaListNoteCC !== null) {
                const notelist = await api_NoteCC_search(JSON.parse(criteriaListNoteCC));
                setNoteCC_List(notelist);
            }
            if (criteriaListRateCC !== null) {
                const ratelist = await api_rateCC_search(JSON.parse(criteriaListRateCC));
                setRateCC_List(ratelist);
            }
            if (criteriaListRateM !== null) {
                const ratelist = await api_rateM_search(JSON.parse(criteriaListRateM));
                setRateM_List(ratelist);
            }
            if (criteriaListTest !== null) {
                const testlist = await api_Test_search(JSON.parse(criteriaListTest));
                setTest_list(testlist);
            }
            if (criteriaListFB !== null) {
                const fblist = await api_Feedback_search(JSON.parse(criteriaListFB));
                setFb_List(fblist);
            }
        } catch (error) {
            console.error("Wystąpił błąd podczas pobierania danych:", error);
            toast.error("Wystąpił błąd podczas pobierania danych", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        } finally {
            setIsLoading(false);
        };
    }

    // ==== Pobranie danych bezpośrednio w przeglądarce ===========================================================================================================================================================================================================================
    async function downloadData_Click() {

        if (dateStart !== '' && dateEnd !== '' && dateStart <= dateEnd) {

            const filtrNoteCC = new FiltrNoteCC();
            const filtrRateCC = new FiltrRateCC();
            const filtrRateM = new FiltrRateM();
            const filtrTest = new FiltrTest();
            const filtrFeedback = new FiltrFeedback();

            filtrNoteCC.appliesDateStart = dateStart
            filtrNoteCC.appliesDateEnd = dateEnd
            filtrRateCC.dateRateStart = dateStart
            filtrRateCC.dateRateEnd = dateEnd
            filtrRateM.dateRateStart = dateStart
            filtrRateM.dateRateEnd = dateEnd
            filtrTest.dateTestStart = dateStart
            filtrTest.dateTestEnd = dateEnd
            filtrFeedback.dateFeedbackStart = dateStart
            filtrFeedback.dateFeedbackEnd = dateEnd

            if (agentId !== 0) {
                filtrNoteCC.userCol.push(userList.find(user => user.id === agentId) || new User())
                filtrRateCC.userCol.push(userList.find(user => user.id === agentId) || new User())
                filtrRateM.userCol.push(userList.find(user => user.id === agentId) || new User())
                filtrTest.userCol.push(userList.find(user => user.id === agentId) || new User())
                filtrFeedback.userCol.push(userList.find(user => user.id === agentId) || new User())
            }

            const criteriaNoteCCList = createSearchCriteriaByFiltrNoteCC(filtrNoteCC);
            const criteriaRateCCList = createSearchCriteriaByFiltrRateCC(filtrRateCC);
            const criteriaRateMList = createSearchCriteriaByFiltrRateM(filtrRateM);
            const criteriaTestList = createSearchCriteriaByFiltrTest(filtrTest);
            const criteriaFbList = createSearchCriteriaByFiltrFeedback(filtrFeedback);

            sessionStorage.setItem('noteCCList_criteriaList', JSON.stringify(criteriaNoteCCList));
            sessionStorage.setItem('rateCCList_criteriaList', JSON.stringify(criteriaRateCCList));
            sessionStorage.setItem('rateMList_criteriaList', JSON.stringify(criteriaRateMList));
            sessionStorage.setItem('testList_criteriaList', JSON.stringify(criteriaTestList));
            sessionStorage.setItem('feedbackList_criteriaList', JSON.stringify(criteriaFbList));

            downloadDate();
        } else {
            toast.error("Uzupełnij poprawnie daty", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }

    // ====== HTML =====================================================================================================================================================================================================================
    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2 ' >
            <ToastContainer />
            <div className='flex items-center justify-center'>
                <IconBrowser className='text-info' size={12} />
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
                            disabled={!isPermit || isLoading}
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
                        <button
                            className="btn btn-outline btn-info mx-2"
                            onClick={downloadData_Click}
                            disabled={isLoading}>
                            {isLoading ? <span className="loading loading-ring loading-lg"></span>
                                :
                                <IconDownload />
                            }
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
                        <IconNoteCC />
                        <p className='ml-2'>Coachingi</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(2);
                        }}
                        data-toggle="tab" href="#link2" role="tablist" >
                        <IconRateCC />
                        <p className='ml-2'>Rozmowy</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 3 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(3);
                        }}
                        data-toggle="tab" href="#link3" role="tablist" >
                        <IconRateM />
                        <p className='ml-2'>Maile</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 4 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(4);
                        }}
                        data-toggle="tab" href="#link4" role="tablist" >
                        <IconTest />

                        <p className='ml-2'>Testy</p>
                    </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(5);
                        }}
                        data-toggle="tab" href="#link5" role="tablist" >
                        <IconFeedbackUp />
                        <p className='mx-2'>Pochwały i Skargi</p>
                        <IconFeedbackDown />
                    </a>
                </div>
            </div>

            {isLoading ? (
                <div className='w-full h-full flex flex-col  items-center'>
                    <div className="text-center loading loading-ring w-32"></div>
                </div>
            ) : (
                <div>
                    {/* <!-- Tab content --> */}
                    < div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">

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
                                                                <IconPreview />
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
                                                                <IconPreview />
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
                                                                <IconPreview />
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
            )}
        </div >
    )
}
export default Browser;

