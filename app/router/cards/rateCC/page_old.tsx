'use client'
import { ModeLabels, Rate_Mode, TypeLabels, Type_RateCC } from '@/app/classes/enums';
import { Queue } from '@/app/classes/queue';
import { RateCC } from '@/app/classes/rates/rateCC';
import { Role, User } from '@/app/classes/user';
import { updateQueueList } from '@/app/factory/factory_queue';
import { CreateNewEmptyRateCC, getRateCC_RateAs100, } from '@/app/factory/factory_rateCC';
import { valueOfRatePartCC } from '@/app/global';
import { getWagRateCC, key_k1, key_k2, key_k3, key_o1, key_s1, key_s2, key_s3, key_s4, key_t1, key_t2, key_t3, key_t4, key_w, key_w1 } from '@/app/globalKeys';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { RateCC_chart } from '../../components/chart/rateCC_chart';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { api_rateCC_add, api_rateCC_export, api_rateCC_update } from '@/app/api/rateCC_api';
import { updateUserList } from '@/app/factory/factory_user';
import { getRateBlock_MaxRate, getRateBlock_Rate, getRateBlock_RateAs100 } from '@/app/factory/factory_rateBlock';
import { getActiveUser } from '@/app/auth';
import { useSearchParams } from "next/navigation";
import { RateBlock } from '@/app/classes/rates/rateBlock';

const RateCC_Page = () => {

    // ====== Hooks =====================================================================================================================================================================================================================
    const [isPermit, setIsPermit] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [activeUser, setActiveUser] = useState(new User());
    const [rateCC, setRateCC] = useState(new RateCC());
    const [prewievMode, setPreviewMode] = useState(false);
    const [userList, setUserList] = useState<Array<User>>([]);
    const [queueList, setQueueList] = useState<Array<Queue>>([]);
    const [queue, setQueue] = useState(0);
    const [agent, setAgent] = useState(0);
    const [extraScore, setExtraScore] = useState(0);
    const [newRateModal, setOpenNewRateModal] = useState(false);

    const searchParams = useSearchParams();
    const type = searchParams.get('type') as Type_RateCC;

    console.log(rateCC);

    // Pobranie danych (użytkownicy, kolejki). Sprawdzenie czy nowa ocena czy podgląd.
    useEffect(() => {

        async function fetchData() {
            try {
                const users = await updateUserList();
                const queues = await updateQueueList();
                const user = await getActiveUser();
                setActiveUser(user);
                setUserList(users);
                setQueueList(queues);

                const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
                setIsPermit(isPermit);

                const rateCC_prev = localStorage.getItem('rateCC_prev');

                if (rateCC_prev != null) {
                    const previewRateCC = JSON.parse(rateCC_prev);
                    previewRateCC.mode = Rate_Mode.PREVIEW_;
                    updateRateCC(previewRateCC);
                } else {
                    const newRateCC = CreateNewEmptyRateCC(user, type);
                    updateRateCC(newRateCC);
                }

            } catch (error) {
                toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                console.log('Błąd useEffect', error);
            }
        }
        fetchData();
    }, [refresh, type]);

    // ====== Hooks RateCC =====================================================================================================================================================================================================================
    const [wiedzaScore, setWiedzaScore] = useState(getRateBlock_RateAs100(rateCC.wiedzaBlock));
    const [obsługaScore, setObsługaScore] = useState(getRateBlock_RateAs100(rateCC.obslugaBlock));
    const [technikaScore, setTechnikaScore] = useState(getRateBlock_RateAs100(rateCC.technikaBlock));
    const [standardScore, setStandardScore] = useState(getRateBlock_RateAs100(rateCC.standardBlock));
    const [komunikacjaScore, setKomunikacjaScore] = useState(getRateBlock_RateAs100(rateCC.komunikacjaBlock));
    const [score, setScore] = useState(getRateCC_RateAs100(rateCC));

    const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek

    // ====== Ustawienie dodatkowej oceny =====================================================================================================================================================================================================================
    const extraScoreScale = [];
    for (let i = -10; i <= 10; i++) {
        extraScoreScale.push(i);
    }

    // ====== Funkcje =====================================================================================================================================================================================================================
    function updateRateCC(rateCC: RateCC) {
        setRateCC(rateCC);
        setWiedzaScore(getRateBlock_RateAs100(rateCC.wiedzaBlock));
        setObsługaScore(getRateBlock_RateAs100(rateCC.obslugaBlock));
        setTechnikaScore(getRateBlock_RateAs100(rateCC.technikaBlock));
        setStandardScore(getRateBlock_RateAs100(rateCC.standardBlock));
        setKomunikacjaScore(getRateBlock_RateAs100(rateCC.komunikacjaBlock));
        setScore(getRateCC_RateAs100(rateCC));
        setAgent(rateCC.agent.id)
        setQueue(rateCC.queue.id)
        setExtraScore(rateCC.extraScore)
        rateCC.mode === Rate_Mode.PREVIEW_ ? setPreviewMode(true) : setPreviewMode(false);
    }

    function validate(): boolean {
        if (rateCC.agent.id !== 0 && rateCC.queue.id !== 0 && rateCC.dateCall !== "" && rateCC.idCall !== "")
            return true;
        else {
            return false;
        }
    }

    function rateBlockColor(rateBlock: RateBlock, border: boolean) {

        const score = getRateBlock_Rate(rateBlock);
        const maxRate = getRateBlock_MaxRate(rateBlock)

        if (score === maxRate) {
            if (border) {
                return 'border-info'
            } else {
                return 'bg-info'
            }
        } else if (score < maxRate && score > (maxRate * 60 / 100)) {
            if (border) {
                return 'border-warning'
            } else {
                return 'bg-warning'
            }
        } else {
            if (border) {
                return 'border-error'
            } else {
                return 'bg-error'
            }
        }
    }

    // ====== Akcje =====================================================================================================================================================================================================================
    function newBtn_Click() {
        setOpenNewRateModal(true);
        localStorage.removeItem('rateCC_prev');
        const newRateCC = CreateNewEmptyRateCC(activeUser, type);
        updateRateCC(newRateCC);
    }

    function rateBtn_Click() {

        if (validate()) {
            if (rateCC.id === 0) {
                api_rateCC_add(rateCC).then((foo => {
                    if (foo.isOK === true) {
                        const rate: RateCC = foo.rateCC; // Aktualizacja oceny o ID z DB
                        rate.mode = Rate_Mode.PREVIEW_;
                        updateRateCC(rate)

                        toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    } else {
                        toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    }
                }));
            } else {
                api_rateCC_update(rateCC).then((foo => {
                    if (foo.isOK === true) {

                        rateCC.mode = Rate_Mode.PREVIEW_;
                        updateRateCC(rateCC)

                        toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    } else {
                        toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    }
                }));
            }
        } else {
            toast.error("Nie uzupełniono wszystkich wymaganych pól", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }

    function editBtn_Click() {

        if (isPermit) {
            rateCC.mode = Rate_Mode.EDIT_;
            updateRateCC(rateCC)
            toast.warning("Włączono tryb edycji", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        } else {
            toast.error("Nie masz uprawnień do edytowania", { autoClose: 15000 })
        }
    }

    function tempSave_Click() {
        localStorage.setItem('tempRateCC', JSON.stringify(rateCC));
        toast.success("Pomyślnie zapisano tymczasowo ocenę", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
    }

    function tempLoad_Click() {
        const checkTemp = localStorage.getItem('tempRateCC');
        if (checkTemp !== null) {
            const tempRateCC = JSON.parse(checkTemp);
            updateRateCC(tempRateCC);
        }
    }

    function exportToFile_Click() {
        api_rateCC_export(rateCC);
    }

    // ====== HTML =====================================================================================================================================================================================================================
    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <ConfirmDialog open={newRateModal} onClose={() => setOpenNewRateModal(false)} onConfirm={() => {
                window.location.reload();
                setRefresh(!refresh)
            }}
                title='Potwierdź decyzję' content='Czy napewno chcesz otworzyć nową ocenę ?' />
            {/* Nagłówek */}
            <div className='grid grid-cols-12'>
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
                                disabled={!isPermit || (isPermit && prewievMode)} onClick={rateBtn_Click}>{rateCC.mode === Rate_Mode.EDIT_ ? 'Aktualizuj' : 'Oceń'}</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)} onClick={tempSave_Click}>Zapisz</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)} onClick={tempLoad_Click}>Wczytaj</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)}>Spr. Pisownie</button>
                            <button
                                className="btn btn-outline btn-info btn-sm" onClick={exportToFile_Click}>Export do pliku</button>
                        </ul>
                    </div>
                </div>
                <div className="col-span-2">
                    <p className={`justify-center  {rateCC.mode === Rate_Mode.PREVIEW_ as Rate_Mode ? 'text-yellow-600' : rateCC.mode === Rate_Mode.NEW_ as Rate_Mode ? 'text-green-500' : 'text-red-700'}`}>Tryb: {ModeLabels[rateCC.mode]}</p>
                </div>
                <div className="col-span-4">
                    <h1 className='text-info text-3xl text-center justify-center'>{TypeLabels[rateCC.typeRate]}</h1>
                </div>
                <div className='col-span-4'>
                    <p className='text-right mr-2'>id: {rateCC.id}</p>
                </div>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* Main */}
            <div className='grid md:grid-cols-12 md:grid-rows-2 gap-x-2 mt-4 justify-center items-center'>

                {/* Podstawowe informacje */}
                <div className="col-span-10 grid md:grid-cols-2 2xl:grid-cols-4 gap-2">
                    <div className="flex md:flex-col items-center justify-center" >
                        <div className="flex flex-col">
                            <span className="label-text">Data oceny</span>
                            <input type="date"
                                className="input input-bordered input-info min-w-fit"
                                disabled
                                defaultValue={rateCC.dateRate} />
                        </div>
                        <div className="flex flex-col mt-2">
                            <span className="label-text">Data rozmowy</span>
                            <input
                                type="date"
                                className="input input-bordered input-info min-w-fit"
                                disabled={prewievMode}
                                defaultValue={rateCC.dateCall}
                                onChange={e => rateCC.dateCall = e.target.value}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col mt-2">
                            <span className="label-text">Agent</span>
                            <select
                                className="select select-info w-72"
                                disabled={prewievMode}
                                value={rateCC.agent.id}
                                onChange={e => {
                                    rateCC.agent = userList.find(user => user.id === parseInt(e.target.value)) || new User()
                                    updateRateCC(rateCC)
                                }}>
                                <option value={0} disabled>Wybierz agenta ...</option>
                                {userList.filter(user => user.role === Role.AGENT_).map((user) => (
                                    <option key={user.id} value={user.id}>{user.nameUser}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col mt-2">
                            <span className="label-text">Kolejka</span>
                            <select
                                className="select select-info w-72"
                                disabled={prewievMode}
                                value={rateCC.queue.id}
                                onChange={e => {
                                    rateCC.queue = queueList.find(queue => queue.id === parseInt(e.target.value)) || new Queue()
                                    updateRateCC(rateCC)
                                }}>
                                <option value={0} disabled>Wybierz kolejkę ...</option>
                                {queueList.filter(queue => queue.available === true).map((queue) => (
                                    <option key={queue.id} value={queue.id}>{queue.nameQueue}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">

                        <div className="flex flex-col mt-2">
                            <span className="label-text">ID rozmowy</span>
                            <input
                                className="input input-bordered input-info max-w-md gap-y-2 w-72"
                                defaultValue={rateCC.idCall}
                                disabled={prewievMode}
                                type="text"
                                onChange={e => rateCC.idCall = e.target.value} />
                        </div>

                        <div className="flex flex-col mt-2">
                            <span className="label-text">Coach</span>
                            <input
                                className="input input-bordered input-info max-w-md gap-y-2 w-72"
                                value={rateCC.coach.nameUser}
                                disabled
                                type="text" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="label-text">Temat:</span>
                        <textarea
                            disabled={prewievMode}
                            defaultValue={rateCC.topic}
                            className="textarea textarea-info max-w-md gap-y-2 w-full h-full"
                            onChange={e => rateCC.topic = e.target.value} />
                    </div>
                </div>
                {/* Wykres */}
                <div className="col-span-12 md:col-span-2 md:row-span-2 flex justify-center items-center">
                    <div className='sm:my-5 md:mt-0 mx:ml-4 '><RateCC_chart value={score} /></div>
                </div>
                {/* Rate blocks */}
                <div className='col-span-10 grid md:grid-cols-3 2xl:grid-cols-6 gap-2 '>

                    <div className={`flex flex-col border-2 rounded-lg items-center w-full h-20 gap-2 ${rateBlockColor(rateCC.wiedzaBlock, true)}`}>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Wiedza</h6>
                        <label className='text-2xl'>{wiedzaScore} %</label>
                        <div className={`w-full h-full rounded-b ${rateBlockColor(rateCC.wiedzaBlock, false)}`}></div>
                    </div>
                    <div className={`flex flex-col border-2 rounded-lg items-center w-full h-20 gap-2 ${rateBlockColor(rateCC.obslugaBlock, true)}`}>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Obsługa aplikacji / systemów</h6>
                        <label className='text-2xl'>{obsługaScore} %</label>
                        <div className={`w-full h-full rounded-b ${rateBlockColor(rateCC.obslugaBlock, false)}`}></div>
                    </div>
                    <div className={`flex flex-col border-2 rounded-lg items-center w-full h-20 gap-2 ${rateBlockColor(rateCC.technikaBlock, true)}`}>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Techniki obsługi</h6>
                        <label className='text-2xl'>{technikaScore} %</label>
                        <div className={`w-full h-full rounded-b ${rateBlockColor(rateCC.technikaBlock, false)}`}></div>
                    </div>
                    <div className={`flex flex-col border-2 rounded-lg items-center w-full h-20 gap-2 ${rateBlockColor(rateCC.komunikacjaBlock, true)}`}>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Komunikatywność</h6>
                        <label className='text-2xl'>{komunikacjaScore} %</label>
                        <div className={`w-full h-full rounded-b ${rateBlockColor(rateCC.komunikacjaBlock, false)}`}></div>
                    </div>
                    <div className={`flex flex-col border-2 rounded-lg items-center w-full h-20 gap-2 ${rateBlockColor(rateCC.standardBlock, true)}`}>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'> Standard obsługi rozmowy</h6>
                        <label className='text-2xl'>{standardScore} %</label>
                        <div className={`w-full h-full rounded-b ${rateBlockColor(rateCC.standardBlock, false)}`}></div>
                    </div>
                    <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Dodatkowa punktacja</h6>
                        <label className='text-2xl'>{rateCC.extraScore}</label>
                        <div className='bg-info w-full h-full rounded-b'></div>
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
                            e.preventDefault(); setOpenTab(4);
                        }}
                        data-toggle="tab" href="#link4" role="tablist" > Komunikatywność </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(5);
                        }}
                        data-toggle="tab" href="#link5" role="tablist" > Standard obsługi rozmowy </a>

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 6 ? " tab-active " : "")
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
                        <h5 className='text-center my-3 text-green-500'>znajomość produktów i usług świadczonych oraz aktów prawnych, przepisów, wytycznych</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_w1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.wiedzaBlock.ratePart.find(ratePart => ratePart.key === key_w1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.nieprawidlowosci}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent prowadzi dialog zgodnie z aktualnymi źródłami wiedzy (przepisami, wytycznymi, instrukcjami, bazą informacji, aktualnościami, treściami na stronach internetowych),
                                        dostosowując się do potrzeb Klienta. Agent odpowiada na pytania Klienta udzielając precyzyjnych informacji dotyczących oferowanych produktów/usług/procedur.
                                        W przypadku samodzielnej korekty błędu przez Agenta - oznaczona zostanie ocena - 1, natomiast w przypadku poprawy błędu na skutek interwencji Klienta - ocena zostanie oznaczona jako 0.</p>
                                </div>
                            </div>


                        </div>

                    </div>
                    {/* # Obsługa aplikacji / systemów TAB */}
                    <div className={openTab === 2 ? "block" : "hidden"} id="link2">

                        <h5 className='text-center my-3 text-green-500'>umiejętność korzystania z aplikacji i systemów oraz właściwe wprowadzanie danych pozyskanych podczas rozmowy</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_o1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.obslugaBlock.ratePart.find(ratePart => ratePart.key === key_o1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1 ? part.uwagi = e.target.value : "")} />
                            </div>


                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Sprawne wykorzystanie dostępnych narzędzi i aplikacji, odnajdywanie trafnych informacji w sieci, wyszukiwanie konkretnych przepisów w aktach prawnych,
                                        oraz asystowanie Klientowi w poruszaniu się po stronach internetowych.Precyzyjne zarejestrowanie zgłoszeń, zleceń, wniosków, notatek, incydentów,
                                        oraz reakcja na interwencje Klientów zgodnie z obowiązującymi procedurami.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* # Techniki obsługi TAB */}
                    <div className={openTab === 3 ? "block" : "hidden"} id="link3">

                        {/* T1 */}
                        <h5 className='text-center my-3 text-green-500'>rozpoznawanie potrzeb</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.technikaBlock.ratePart.find(part => part.key === key_t1)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_t1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.technikaBlock.ratePart.find(part => part.key === key_t1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.technikaBlock.ratePart.find(ratePart => ratePart.key === key_t1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>
                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>
                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t1 ? part.uwagi = e.target.value : "")} />

                            </div>
                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Zadawanie pytań w celu ustalenia potrzeb Klienta oraz klarowne wyjaśnianie niejasności, włączając w to stosowanie parafrazy do potwierdzenia zrozumienia jego wypowiedzi.
                                        Pozyskiwanie istotnych informacji związanych z problemem Klienta, które mogą mieć wpływ na efektywną realizację usługi.
                                        Dostosowanie propozycji do indywidualnych potrzeb Klienta, przekazywanie kluczowych informacji dotyczących jego sprawy. Proponowanie rozwiązań zgodnych z procedurami.</p>
                                </div>
                            </div>
                        </div>

                        {/* T2 */}
                        <h5 className='text-center my-3 text-green-500'>praca z objekcjami</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.technikaBlock.ratePart.find(part => part.key === key_t2)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_t2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.technikaBlock.ratePart.find(part => part.key === key_t2)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.technikaBlock.ratePart.find(ratePart => ratePart.key === key_t2);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t2)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t2 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t2)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t2 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className="text-sm text-justify">Prezentowanie się jako profesjonalista poprzez unikanie sformułowań o negatywnym wydźwięku oraz eliminowanie zwrotów,
                                        które mogą budzić niepewność lub podważać kompetencje, takich jak &quot;niestety&quot;, &quot;nie pomogę&quot;, &quot;nie wiem&quot;, &quot;nie da się&quot;, &quot;nie mogę&quot;, &quot;nie mamy możliwości&quot;, &quot;musi Pan/Pani&quot;,
                                        &quot;moim zdaniem&quot;, &quot;podejrzewam&quot;, &quot;z doświadczenia wiem&quot;, &quot;mogę tylko&quot;, &quot;nie jestem w stanie&quot;, &quot;obawiam się&quot;, &quot;myślę że&quot;, &quot;prawdopodobnie&quot;, &quot;ewentualnie mogę&quot;, &quot;w ostateczności&quot;,
                                        &quot;w razie czego&quot;, &quot;tylko...&quot;, być może&quot;.</p>
                                </div>
                            </div>
                        </div>

                        {/* T3 */}
                        <h5 className='text-center my-3 text-green-500'>dbałość o wizerunek firmy</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.technikaBlock.ratePart.find(part => part.key === key_t3)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_t3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.technikaBlock.ratePart.find(part => part.key === key_t3)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.technikaBlock.ratePart.find(ratePart => ratePart.key === key_t3);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t3)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t3 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t3)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t3 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Rozpoznawanie i zrozumienie motywacji, które skłaniają Klientów do wyrażania zastrzeżeń dotyczących realizowanych zadań
                                        w obszarze przetwarzania danych osobowych.Skupianie uwagi Klienta na faktach oraz kształtowanie pozytywnego wizerunku,
                                        przy jednoczesnym unikaniu negatywnych wypowiedzi na temat polityki prywatności lub konkurencji.</p>
                                </div>
                            </div>
                        </div>

                        {/* T4 */}
                        <h5 className='text-center my-3 text-green-500'>kontrola rozmowy, właściwe zarządzanie czasem i przebiegiem rozmowy </h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.technikaBlock.ratePart.find(part => part.key === key_t4)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text  xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_t4)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.technikaBlock.ratePart.find(part => part.key === key_t4)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.technikaBlock.ratePart.find(ratePart => ratePart.key === key_t4);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t4)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t4 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t4)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.technikaBlock.ratePart.find(part => part.key === key_t4 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent odpowiednio kieruje przebiegiem rozmowy, udzielając konkretnej, rzeczowej i zrozumiałej odpowiedzi na pytania Klienta, zgodnie z ich potrzebami.
                                        Sprawnie operuje aplikacjami i nie odchodzi od tematu, trzymając się głównego wątku rozmowy i unikając zbędnych dyskusji. W przypadku konieczności weryfikacji informacji,
                                        informuje Klienta o zawieszeniu rozmowy (hold), tłumacząc powód, i dba o minimalizację czasu oczekiwania. Po podjęciu rozmowy ponownie dziękuje za cierpliwość i informuje
                                        o ewentualnym wydłużeniu przerwy z uzasadnieniem. Konsultant witając się z Klientem po połączeniu i rozłączając się po zakończeniu rozmowy (jeśli przerwa trwa dłużej niż 10 sekund),
                                        dba o profesjonalizm w komunikacji.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* # Komunikatywność  TAB */}
                    <div className={openTab === 4 ? "block" : "hidden"} id="link4">

                        {/* K1 */}
                        <h5 className='text-center my-3 text-green-500'>forma wypowiedzi</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text  xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text  xl:text-4xl">{getWagRateCC(key_k1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.komunikacjaBlock.ratePart.find(ratePart => ratePart.key === key_k1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent mówi głośno, wyraźnie i płynnie.
                                        Agent stosuje odpowiednie tempo wypowiedzi. Zbyt szybkie mówienie może powodować trudności zrozumienia komunikatu, zbyt wolne może być denerwujące dla odbiorcy.
                                        Poprawna dykcja. Brak: połykania końcówek, skracania słów, przerw pomiędzy słowami a nawet zdaniami.
                                        Odpowiedni ton głosu, w którym słychać entuzjazm i pozytywne nastawienie. Brak monotonii. W rozmowie akcentowane są najważniejsze kwestie. Agent stosuje odpowiednie pauzy.
                                        Brak wypowiedzi „na jednym wdechu”. Brak: przeciągania wyrazów/końcówek, przesadnego akcentowania.</p>
                                </div>
                            </div>
                        </div>

                        {/* K2 */}
                        <h5 className='text-center my-3 text-green-500'>brak negatywnych emocji w rozmowie</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_k2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.komunikacjaBlock.ratePart.find(ratePart => ratePart.key === key_k2);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent rozmawia uprzejmie, nie przenosząc negatywnych emocji z poprzednich interakcji.
                                        Nie reaguje śmiechem na zachowanie, problemy, ton głosu lub sposób mówienia Klienta. Jest opanowany nawet w sytuacjach, gdy Klient jest zirytowany lub niezrozumiały.
                                        Nie atakuje Klienta, unika traktowania go z wyższością, jak również nie okazuje zdenerwowania, zirytowania, arogancji czy znudzenia.
                                        Unika wypowiedzi w tonie ironicznym, sarkastycznym czy cynicznym. Nie daje Klientowi wrażenia, że zależy mu na szybkim zakończeniu rozmowy.</p>
                                </div>
                            </div>
                        </div>

                        {/* K3 */}
                        <h5 className='text-center my-3 text-green-500'>aktywne słuchanie</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_k3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.komunikacjaBlock.ratePart.find(ratePart => ratePart.key === key_k3);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent skupia się na wypowiedzi Klienta poprzez uważne słuchanie, unikając wielokrotnego dopytywania o to samo, nie przerywając mu ani nie mówiąc równocześnie.
                                        W przypadku, gdy wypowiedź Klienta jest niespójna lub odchodzi od tematu rozmowy, Agent może w sposób uprzejmy przerwać, ale dba o zachowanie kultury w komunikacji.
                                        Reaguje na monolog Klienta oraz akceptuje milczenie, pozwalając Klientowi dokończyć wypowiedź. Jeśli Klient przerywa Agentowi, ten zawiesza głos, umożliwiając mu dokończenie wypowiedzi. </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* # Standard obsługi rozmowy TAB */}
                    <div className={openTab === 5 ? "block" : "hidden"} id="link5">

                        {/* S1 */}
                        <h5 className='text-center my-3 text-green-500'>powitanie i zakończenie rozmowy</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.standardBlock.ratePart.find(part => part.key === key_s1)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_s1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.standardBlock.ratePart.find(part => part.key === key_s1)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.standardBlock.ratePart.find(ratePart => ratePart.key === key_s1);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s1)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s1 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s1)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s1 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Powitanie zgodnie ze standardem :
                                    &quot;Dzień dobry, tutaj agent Anna Kowalska. W czym mogę pomóc?&quot;
                                        Pożegnanie zgodnie ze standardem:
                                        &quot;Dziękuję za rozmowę, jeśli jeszcze czegoś potrzebujesz, proszę śmiało się zgłosić. Miłego dnia i do usłyszenia!"</p>
                                </div>
                            </div>
                        </div>

                        {/* S2 */}
                        <h5 className='text-center my-3 text-green-500'>znajomość procesu kampanii</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.standardBlock.ratePart.find(part => part.key === key_s2)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_s2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.standardBlock.ratePart.find(part => part.key === key_s2)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.standardBlock.ratePart.find(ratePart => ratePart.key === key_s2);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s2)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s2 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s2)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s2 ? part.uwagi = e.target.value : "")} />
                            </div>
                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>W przypadku kampanii, gdzie został wdrożony skrypt rozmowy lub proces kampanii, istotne jest przestrzeganie określonej kolejności i stałości elementów dla poszczególnych kampanii.
                                        Weryfikacja Klientów odbywa się zgodnie z ustalonymi procedurami, aby potwierdzić ich tożsamość oraz prawo do realizacji żądanych usług.</p>
                                </div>
                            </div>
                        </div>

                        {/* S3 */}
                        <h5 className='text-center my-3 text-green-500'>język wypowiedzi</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.standardBlock.ratePart.find(part => part.key === key_s3)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_s3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.standardBlock.ratePart.find(part => part.key === key_s3)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.standardBlock.ratePart.find(ratePart => ratePart.key === key_s3);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s3)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s3 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s3)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s3 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent posługuje się poprawną polszczyzną, unikając błędów językowych, takich jak &quot;włańczać&quot;, &quot;bede&quot;, &quot;proszę Panią&quot;, &quot;te pismo&quot;, &quot;te upoważnienie&quot;,
                                        &quot;se napisze&quot;. Nie stosuje niestosownych, potocznych słów czy zwrotów, takich jak &quot;fajnie&quot;, &quot;ok&quot;, &quot;od ręki&quot;, &quot;super&quot;, &quot;wie Pan co&quot;, &quot;system na mnie wymusza&quot;, &quot;wyskoczyły mi pytania&quot;,
                                        &quot;aplikacja wyrzuciła mi informacje&quot;, &quot;niech Pan powie&quot;, &quot;tu widzę&quot;, &quot;zaraz&quot;, &quot;w takim razie&quot;, &quot;jakaś/jakiś&quot;. Unika także żargonu  firmowego. Nie używa zdrobnień, jak &quot;chwileczkę&quot;,
                                        &quot;pieniążki&quot;, &quot;sekundkę&quot;, &quot;paczuszka&quot;, &quot;fakturka&quot;. Konsultant utrzymuje profesjonalny dystans w relacji z Klientem, stosując odpowiednie zwroty grzecznościowe w sposób umiarkowany.
                                        Udziela informacji w pierwszej osobie, co zapewnia jasność i bezpośredniość w komunikacji.</p>
                                </div>
                            </div>
                        </div>

                        {/* S4 */}
                        <h5 className='text-center my-3 text-green-500'>brak wtrętów językowych</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.standardBlock.ratePart.find(part => part.key === key_s4)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text xl:text-4xl">{getWagRateCC(key_s4)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select className="select select-bordered xl:select-lg text-center m-2"
                                            value={rateCC.standardBlock.ratePart.find(part => part.key === key_s4)?.ocena}
                                            disabled={prewievMode}
                                            onChange={e => {
                                                const ratePart = rateCC.standardBlock.ratePart.find(ratePart => ratePart.key === key_s4);
                                                if (ratePart) {
                                                    ratePart.ocena = parseInt(e.target.value);
                                                }
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s4)?.nieprawidlowosci : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s4 ? part.nieprawidlowosci = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-5 2xl:col-span-3 gap-5 p-2 h-full '>

                                <label className="label">
                                    <span className="label-text">Uwagi</span>
                                </label>
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s4)?.uwagi : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s4 ? part.uwagi = e.target.value : "")} />
                            </div>

                            <div className='md:col-span-12 2xl:md:col-span-4 gap-5 p-2 items-center justify-center'>
                                <div className='flex flex-col'>
                                    <h5 className='text-center'>Opis wskaźnika</h5>
                                    <hr className='opacity-50 m-1'></hr>
                                    <p className='text-sm text-justify'>Agent unika wtrętów językowych, takich jak "yyy", "eee", "mhm", "aha", "prawda", "dobrze", "tutaj", "tak", "yhy", "no tak", "znaczy się", "no", "proszę mi powiedzieć", "właśnie".
                                        Dodatkowo, unika zbędnych powtórzeń tych samych słów w celu utrzymania płynności i klarowności komunikacji.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* # Dodatkowa punktacja TAB */}
                    <div className={openTab === 6 ? "block" : "hidden"} id="link6">
                        {/* --- */}
                        <h5 className='text-center my-3 text-green-500'>dodatkowa punktacja</h5>

                        <div className={`grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border
                                        ${rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.ocena ?? 0 > 0 ? '' : 'border-red-600'}`}>

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
                                                rateCC.extraScore = parseInt(e.target.value)
                                                updateRateCC(rateCC);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.extraScoreTxt : ""}
                                    className="textarea textarea-bordered h-1/2 w-full"
                                    disabled={prewievMode}
                                    onChange={e => rateCC.standardBlock.ratePart.find(part => part.key === key_s4 ? rateCC.extraScoreTxt = e.target.value : "")} />
                            </div>



                        </div>



                    </div>
                </div>
            </div>

        </div>
    )
}

export default RateCC_Page


