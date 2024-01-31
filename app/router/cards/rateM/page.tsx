'use client'
import { ModeLabels, Rate_Mode, TypeLabels } from '@/app/classes/enums';
import { Queue } from '@/app/classes/queue';
import { RateM } from '@/app/classes/rateM';
import { Role, User } from '@/app/classes/user';
import { updateQueueList } from '@/app/factory/factory_queue';
import { CreateNewEmptyRateM, getRateM_RateAs100, } from '@/app/factory/factory_rateM';
import { valueOfRatePartCC } from '@/app/global';
import { getWagRateM, key_k1, key_k2, key_k3, key_o1, key_s1, key_s2, key_s3, key_s4, key_t1, key_t2, key_t3, key_t4, key_w, key_w1 } from '@/app/globalKeys';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { api_rateM_add, api_rateM_update } from '@/app/api/rateM_api';
import { updateUserList } from '@/app/factory/factory_user';
import { getRateBlock_RateAs100 } from '@/app/factory/factory_rateBlock';
import { getActiveUser } from '@/app/auth';
import { RateM_chart } from '../../components/chart/rateM_chart';

const RateM_Page = () => {

    // ====== Ustawienie i kontrola active usera ==========================================
    const [isPermit, setIsPermit] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [activeUser, setActiveUser] = useState(new User());
    const [rateM, setRateM] = useState(new RateM());
    const [prewievMode, setPreviewMode] = useState(false);
    const [userList, setUserList] = useState<Array<User>>([]);
    const [queueList, setQueueList] = useState<Array<Queue>>([]);
    const [agent, setAgent] = useState(0);
    const [extraScore, setExtraScore] = useState(0);
    const [newRateModal, setOpenNewRateModal] = useState(false);

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
                console.log(isPermit)

                const rateM_prev = localStorage.getItem('rateM_prev');

                if (rateM_prev != null) {
                    const previewRateM = JSON.parse(rateM_prev);
                    previewRateM.mode = Rate_Mode.PREVIEW_;
                    updateRateM(previewRateM);
                } else {
                    const newRateM = CreateNewEmptyRateM(user);
                    updateRateM(newRateM);
                }

            } catch (error) {
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, [refresh]);

    // RateM hooks
    const [wiedzaScore, setWiedzaScore] = useState(getRateBlock_RateAs100(rateM.wiedzaBlock));
    const [obsługaScore, setObsługaScore] = useState(getRateBlock_RateAs100(rateM.obslugaBlock));
    const [technikaScore, setTechnikaScore] = useState(getRateBlock_RateAs100(rateM.technikaBlock));
    const [standardScore, setStandardScore] = useState(getRateBlock_RateAs100(rateM.standardBlock));
    const [komunikacjaScore, setKomunikacjaScore] = useState(getRateBlock_RateAs100(rateM.komunikacjaBlock));
    const [score, setScore] = useState(getRateM_RateAs100(rateM));

    const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek

    // ====== Ustawienie dodatkowej oceny ==========================================
    const extraScoreScale = [];
    for (let i = -10; i <= 10; i++) {
        extraScoreScale.push(i);
    }

    // ====== FUNKCJE ==========================================
    function updateRateM(rateM: RateM) {
        setRateM(rateM);
        setWiedzaScore(getRateBlock_RateAs100(rateM.wiedzaBlock));
        setObsługaScore(getRateBlock_RateAs100(rateM.obslugaBlock));
        setTechnikaScore(getRateBlock_RateAs100(rateM.technikaBlock));
        setStandardScore(getRateBlock_RateAs100(rateM.standardBlock));
        setKomunikacjaScore(getRateBlock_RateAs100(rateM.komunikacjaBlock));
        setScore(getRateM_RateAs100(rateM));
        setAgent(rateM.agent.id)
        setExtraScore(rateM.extraScore)
        rateM.mode === Rate_Mode.PREVIEW_ ? setPreviewMode(true) : setPreviewMode(false);
    }
    function validate(): boolean {
        if (rateM.agent.id !== 0 && rateM.attachmentPath !== '')
            return true;
        else {
            return false;
        }
    }

    function newBtn_Click() {
        setOpenNewRateModal(true);
        localStorage.removeItem('rateM_prev');
        const newRateM = CreateNewEmptyRateM(activeUser);
        updateRateM(newRateM);
    }

    // ====== OBSŁUGA PRZYCISKÓW ======================================================
    function rateBtn_Click() {

        if (validate()) {
            if (rateM.id === 0) {
                api_rateM_add(rateM).then((foo => {
                    if (foo.isOK === true) {
                        const rate: RateM = foo.rateM; // Aktualizacja oceny o ID z DB
                        rate.mode = Rate_Mode.PREVIEW_;
                        updateRateM(rate)

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
                api_rateM_update(rateM).then((foo => {
                    if (foo.isOK === true) {

                        rateM.mode = Rate_Mode.PREVIEW_;
                        updateRateM(rateM)

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
            toast.error("Nie uzupełniono wszystkich wymaganych pól", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        }
    }

    function editBtn_Click() {

        if (isPermit) {
            rateM.mode = Rate_Mode.EDIT_;
            updateRateM(rateM)
            toast.warning("Włączono tryb edycji", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        } else {
            toast.error("Nie masz uprawnień do edytowania", { autoClose: 15000 })
        }
    }

    // ====================================================================================================================================================================================================
    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <ConfirmDialog open={newRateModal} onClose={() => setOpenNewRateModal(false)} onConfirm={() => {
                window.location.reload();
                setRefresh(!refresh)
            }}
                title='Potwierdź decyzję' content='Czy napewno chcesz otworzyć nową ocenę ?' />
            {/* Nagłówek */}
            <div className='grid grid-cols-12 items-center'>
                <div className="col-span-2 navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <button
                                disabled={!isPermit}
                                className="btn btn-outline btn-info btn-sm"
                                onClick={newBtn_Click}>
                                Nowa
                            </button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && !prewievMode)} onClick={editBtn_Click}>Włącz edytowanie</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)} onClick={rateBtn_Click}>{rateM.mode === Rate_Mode.EDIT_ ? 'Aktualizuj' : 'Oceń'}</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)}>Zapisz</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)}>Wczytaj</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)}>Spr. Pisownie</button>
                            <button
                                className="btn btn-outline btn-info btn-sm">Export do xls</button>
                        </ul>
                    </div>
                </div>
                <div className="col-span-2">
                    <p className={`justify-center  {rateCC.mode === Rate_Mode.PREVIEW_ as Rate_Mode ? 'text-yellow-600' : rateCC.mode === Rate_Mode.NEW_ as Rate_Mode ? 'text-green-500' : 'text-red-700'}`}>Tryb: {ModeLabels[rateM.mode]}</p>
                </div>
                <div className="col-span-4">
                    <div className='flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>

                        <h1 className='text-info text-3xl text-center ml-3'>Karta mail</h1>
                    </div>
                </div>
                <div className='col-span-4'>
                    <p className='text-right mr-2'>id: {rateM.id}</p>
                </div>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* Main */}
            <div className='grid grid-cols-12 grid-rows-2 mt-4 justify-center items-center'>

                {/* Podstawowe informacje */}
                <div className="col-span-9 flex flex-col 2xl:flex-row border-2 gap-2 h-full">
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-end items-center sm:justify-center ">
                        <div className="flex flex-col">
                            <span className="label-text">Data oceny</span>
                            <input type="date"
                                className="input input-bordered input-info min-w-fit"
                                disabled
                                defaultValue={rateM.dateRate} />
                        </div>
                        <div className="flex flex-col">
                            <span className="label-text">Agent</span>
                            <select
                                className="select select-info w-72"
                                disabled={prewievMode}
                                value={rateM.agent.id}
                                onChange={e => {
                                    rateM.agent = userList.find(user => user.id === parseInt(e.target.value)) || new User()
                                    updateRateM(rateM)
                                }}>
                                <option value={0} disabled>Wybierz agenta ...</option>
                                {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                                    <option key={user.id} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-start items-center sm:justify-center " >
                        <div className="flex flex-col">
                            <span className="label-text">Coach</span>
                            <input
                                className="input input-bordered input-info max-w-md gap-y-2 w-64"
                                value={rateM.coach.nameUser}
                                disabled
                                type="text" />
                        </div>
                        <div className="flex flex-col">
                            <span className="label-text">Załącznik</span>
                            <div className='flex gap-2'>
                                <input
                                    className="input input-bordered input-info max-w-md gap-y-2 w-52"
                                    value={rateM.attachmentPath}
                                    disabled
                                    type="text" />
                                <button className='btn btn-info'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                                    </svg>

                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-span-3 row-span-2 flex 2xl:h-64 border-2 h-full justify-center items-center">
                    <RateM_chart value={score} />
                </div>
                <div className="col-span-9 flex flex-col 2xl:flex-row border-2 gap-2 h-full">
                    {/* Rate blocks */}
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-end items-center sm:justify-center ">
                        <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                            <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Wiedza</h6>
                            <label className='text-2xl'>{wiedzaScore} %</label>
                            <div className='bg-info w-full h-full rounded-b'></div>
                        </div>
                        <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                            <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Obsługa aplikacji / systemów</h6>
                            <label className='text-2xl'>{obsługaScore} %</label>
                            <div className='bg-info w-full h-full rounded-b'></div>
                        </div>
                        <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                            <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Techniki obsługi</h6>
                            <label className='text-2xl'>{technikaScore} %</label>
                            <div className='bg-info w-full h-full rounded-b'></div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-end items-center sm:justify-center ">
                        <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                            <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'> Standard obsługi rozmowy</h6>
                            <label className='text-2xl'>{standardScore} %</label>
                            <div className='bg-info w-full h-full rounded-b'></div>
                        </div>
                        <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                            <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Dodatkowa punktacja</h6>
                            <label className='text-2xl'>{rateM.extraScore}</label>
                            <div className='bg-info w-full h-full rounded-b'></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-span-12 mt-2'>
                <div className="tabs justify-center items-center">

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 1 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(1);
                        }}
                        data-toggle="tab" href="#link1" role="tablist" > Wiedza </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(2);
                        }}
                        data-toggle="tab" href="#link2" role="tablist" > Obsługa aplikacji / systemów </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 3 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(3);
                        }}
                        data-toggle="tab" href="#link3" role="tablist" > Techniki obsługi </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 4 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(5);
                        }}
                        data-toggle="tab" href="#link5" role="tablist" > Standard obsługi rozmowy </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(6);
                        }}
                        data-toggle="tab" href="#link6" role="tablist" > Dodatkowa punktacja </a>
                </div>

                {/* <!-- Tab content --> */}
                <div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">

                    {/* # Wiedza TAB */}
                    <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                        <h5 className='text-center my-3 text-green-500'>znajomość produktów/usług świadczonych przez PP oraz aktów prawnych / przepisów / wytycznych</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_w1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.wiedzaBlock.ratePart.find(ratePart => ratePart.key === key_w1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.wiedzaBlock.ratePart.find(part => part.key === key_w1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.wiedzaBlock.ratePart.find(part => part.key === key_w1 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Konsultant przeprowadza rozmowę zgodnie z obowiązującymi źródłami wiedzy (rozporządzeniami, regulaminami,  instrukcjami, bazą wiedzy, aktualnościami, informacjami na stronach internetowych) adekwatnie do sytuacji Klienta.
                                        Konsultant odpowiada na pytania Klienta udzielając prawidłowych informacji w zakresie produktów/usług/procedur. Jeżeli Konsultant podczas rozmowy sam naprawi swój błąd - ocena  zostanie zaznaczona - 1, jeśli naprawa błędu następuje w wyniku ingerencji Klienta - ocena  zostanie zaznaczona na 0.</p>
                                </div>
                            </div>


                        </div>

                    </div>
                    {/* # Obsługa aplikacji / systemów TAB */}
                    <div className={openTab === 2 ? "block" : "hidden"} id="link2">

                        <h5 className='text-center my-3 text-green-500'>umiejętność korzystania z aplikacji / systemów oraz właściwe wprowadzanie danych pozyskanych podczas rozmowy</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_o1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.obslugaBlock.ratePart.find(part => part.key === key_o1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.obslugaBlock.ratePart.find(ratePart => ratePart.key === key_o1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.obslugaBlock.ratePart.find(part => part.key === key_o1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.obslugaBlock.ratePart.find(part => part.key === key_o1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.obslugaBlock.ratePart.find(part => part.key === key_o1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.obslugaBlock.ratePart.find(part => part.key === key_o1 ? part.uwagi = e.target.value : "")} />
                            </div>


                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Umiejętne posługiwanie się dostępnymi programami/aplikacjami/stronami www, znalezienie potrzebnych i poprawnych informacji, wyszukanie w aktach prawnych konkretnych artykułów, paragrafów, pokierowanie Klienta po stronie www.
                                        Poprawna rejestracja w systemie/aplikacji: zgłoszeń, zleceń, żądań, notatek, awarii, interwencji Klientów.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* # Techniki obsługi TAB */}
                    <div className={openTab === 3 ? "block" : "hidden"} id="link3">

                        {/* T1 */}
                        <h5 className='text-center my-3 text-green-500'>rozpoznawanie potrzeb</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_t1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.technikaBlock.ratePart.find(part => part.key === key_t1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.technikaBlock.ratePart.find(ratePart => ratePart.key === key_t1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.technikaBlock.ratePart.find(part => part.key === key_t1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.technikaBlock.ratePart.find(part => part.key === key_t1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>
                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>
                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.technikaBlock.ratePart.find(part => part.key === key_t1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.technikaBlock.ratePart.find(part => part.key === key_t1 ? part.uwagi = e.target.value : "")} />

                            </div>
                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Zadawanie  pytań celem zidentyfikowania potrzeb Klienta.
                                        W przypadku niejasności, stosowania przez Klienta niezrozumiałych stwierdzeń, komunikatów, itp. - stosowanie parafrazy (potwierdzenie zrozumienia/powtórzenie tego co powiedział Klient), pozyskanie istotnych i  adekwatnych do sprawy Klienta informacji mających wpływ na realizację usługi. Dopasowanie oferty,
                                        przekazanie kluczowych informacji dla całości sprawy Klienta. Zaproponowanie rozwiązania zgodnego z procedurami w PP i CC. Przedstawianie zalet i korzyści produktów/usług.</p>
                                </div>
                            </div>
                        </div>

                        {/* T2 */}
                        <h5 className='text-center my-3 text-green-500'>praca z objekcjami</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_t2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.technikaBlock.ratePart.find(part => part.key === key_t2)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.technikaBlock.ratePart.find(ratePart => ratePart.key === key_t2);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.technikaBlock.ratePart.find(part => part.key === key_t2)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.technikaBlock.ratePart.find(part => part.key === key_t2 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.technikaBlock.ratePart.find(part => part.key === key_t2)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.technikaBlock.ratePart.find(part => part.key === key_t2 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Rozwianie wątpliwości - właściwa argumentacja dostosowana do potrzeb i typu Klienta. Konsultant przedstawia się jako profesjonalista.
                                        Nie używa sformułowań o zabarwieniu negatywnym nie stosuje zwrotów budzących niepewność oraz podważających jego kompetencje
                                        (np. niestety, nie pomogę, nie wiem, nie da się, nie mogę, nie mamy możliwości, musi Pan/Pani,  moim zdaniem, podejrzewam, z doświadczenia wiem, mogę tylko,
                                        nie jestem w stanie, obawiam się, myślę że, prawdopodobnie, ewentualnie mogę, w ostateczności, w razie czego, tylko...,  być może).  </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* # Standard obsługi rozmowy TAB */}
                    <div className={openTab === 5 ? "block" : "hidden"} id="link5">

                        {/* S1 */}
                        <h5 className='text-center my-3 text-green-500'>powitanie i zakończenie rozmowy</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_s1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.standardBlock.ratePart.find(part => part.key === key_s1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.standardBlock.ratePart.find(ratePart => ratePart.key === key_s1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s1 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Powitanie i pożegnanie zgodnie ze standardem CC. Konsultant zobowiązany jest wyraźnie podać imię i nazwisko oraz wyrazić chęć pomocy.
                                        W zakończeniu -  wyrażenie chęci pomocy w innej niż omówiona/podsumowana sprawa (elastyczne stosowanie sformułowania Czy mogę jeszcze w czymś pomóc?),
                                        podziękowanie za rozmowę oraz  miły akcent, np. do usłyszenia, miłego dnia, zapraszam ponownie.</p>
                                </div>
                            </div>
                        </div>

                        {/* S2 */}
                        <h5 className='text-center my-3 text-green-500'>znajomość procesu kampanii</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_s2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.standardBlock.ratePart.find(part => part.key === key_s2)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.standardBlock.ratePart.find(ratePart => ratePart.key === key_s2);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s2)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s2 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s2)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s2 ? part.uwagi = e.target.value : "")} />
                            </div>
                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Rozmowa zgodna ze skryptem - dla kampanii gdzie został wdrożony skrypt rozmowy lub  z procesem kampanii, kolejność/stałość valueów dla poszczególnych kampanii.
                                        Prawidłowa weryfikacja Klientów. Zasadność rejestracji zgłoszeń, zleceń, żądań, notatek, awarii, interwencji Klientów. Potwierdzenie istotnych ustaleń. </p>
                                </div>
                            </div>
                        </div>

                        {/* S3 */}
                        <h5 className='text-center my-3 text-green-500'>język wypowiedzi</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_s3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.standardBlock.ratePart.find(part => part.key === key_s3)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.standardBlock.ratePart.find(ratePart => ratePart.key === key_s3);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s3)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s3 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s3)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s3 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Konsultant posługuje się poprawną polszczyzną. Brak błędów językowych (np.: włańczać, bede, proszę Panią, te pismo, te upoważnienie, se napisze).
                                        Konsultant nie stosuje niestosownych, potocznych słów/zwrotów (np.: fajnie, ok, od ręki, super, wie Pan co, system na mnie wymusza, wyskoczyły mi pytania, aplikacja wyrzuciła mi informacje,
                                        niech Pan powie, tu widzę, zaraz, w takim razie, jakaś/jakiś). Konsultant nie stosuje żargonu pocztowego lub określeń technicznych (np.: IVR, tracking, KRRiT, WER, KUE, RS, UP, FUP,PP, PH).
                                        Konsultant nie stosuje zdrobnień (np.: chwileczkę, pieniążki, sekundkę, paczuszka, fakturka). Konsultant nie spoufala się z Klientem, stosuje ale nienadużywa zwrotów grzecznościowych.
                                        Konsultant udziela informacji w pierwszej osobie.   </p>
                                </div>
                            </div>
                        </div>

                        {/* S4 */}
                        <h5 className='text-center my-3 text-green-500'>brak wtrętów językowych</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateM(key_s4)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateM.standardBlock.ratePart.find(part => part.key === key_s4)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateM.standardBlock.ratePart.find(ratePart => ratePart.key === key_s4);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateM(rateM);
                                            }}>
                                            {valueOfRatePartCC().map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Nieprawidłowości</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s4)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s4 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.standardBlock.ratePart.find(part => part.key === key_s4)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s4 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Brak wtrętów językowych (np. yyy, eee, mhm, aha, prawda, dobrze, tutaj, tak, yhy, no tak, znaczy się, no, proszę mi powiedzieć, właśnie).
                                        Brak zbędnych powtórzeń tych samych słów.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* # Dodatkowa punktacja TAB */}
                    <div className={openTab === 6 ? "block" : "hidden"} id="link6">
                        {/* --- */}
                        <h5 className='text-center my-3 text-green-500'>dodatkowa punktacja</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            value={extraScore}
                                            onChange={e => {
                                                rateM.extraScore = parseInt(e.target.value)
                                                updateRateM(rateM);
                                            }}>
                                            {extraScoreScale.map((value, index) => (
                                                <option key={index} value={value}>{value}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='md:col-span-10 2xl:col-span-9 gap-5 p-2 h-full'>
                                <label className="label">
                                    <span className="label-text">Opis</span>
                                </label>
                                <textarea defaultValue={rateM.mode != Rate_Mode.NEW_ as Rate_Mode ? rateM.extraScoreTxt : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateM.standardBlock.ratePart.find(part => part.key === key_s4 ? rateM.extraScoreTxt = e.target.value : "")} />
                            </div>



                        </div>



                    </div>
                </div>
            </div>

        </div>
    )
}

export default RateM_Page


