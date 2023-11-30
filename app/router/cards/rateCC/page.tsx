'use client'
import { Rate_Mode, Type_RateCC } from '@/app/classes/enums';
import { Queue } from '@/app/classes/queue';
import { RateCC } from '@/app/classes/rateCC';
import { Role, User } from '@/app/classes/user';
import { queueList } from '@/app/factory/factory_queue';
import { CreateNewEmptyRateCC, } from '@/app/factory/factory_rateCC';
import { userList_ } from '@/app/factory/factory_user';
import { getActiveUserRole, setActiveUser, valueOfRatePartCC } from '@/app/global';
import { getWagRateCC, key_k1, key_k2, key_k3, key_o1, key_s1, key_s2, key_s3, key_s4, key_t1, key_t2, key_t3, key_t4, key_w, key_w1 } from '@/app/globalKeys';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Arced } from '../../components/chart/rateCC_chart';
import { useSearchParams } from 'next/navigation';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { selectedRateCC } from '../test/page';
import { api_rateCC_add } from '@/app/api/rateCC_api';

const RateCC_Page = () => {

    // ====== Ustawienie i kontrola aktywnej oceny =========================================
    const searchParams = useSearchParams();
    const onPrev_ = searchParams.get('onPrev'); //wyszukanie czy przesłano do komponentu props EDIT
    const [prewievMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (onPrev_ != null) {
            updateRateCC(selectedRateCC);
            setPreviewMode(true)
        }
    }, [])

    // RateCC hooks
    const [rateCC, setRateCC] = useState(onPrev_ === null ? CreateNewEmptyRateCC() : selectedRateCC);
    const [wiedzaScore, setWiedzaScore] = useState(rateCC.wiedzaBlock.getRateAs100());
    const [obsługaScore, setObsługaScore] = useState(rateCC.obslugaBlock.getRateAs100());
    const [technikaScore, setTechnikaScore] = useState(rateCC.technikaBlock.getRateAs100());
    const [standardScore, setStandardScore] = useState(rateCC.standardBlock.getRateAs100());
    const [komunikacjaScore, setKomunikacjaScore] = useState(rateCC.komunikacjaBlock.getRateAs100());
    const [score, setScore] = useState(rateCC.getRateAs100());

    // ====== Ustawienie i kontrola active usera ==========================================
    let isPermit: boolean = false;
    setActiveUser();
    if (getActiveUserRole() === Role.ADMIN_) {
        isPermit = true;
    }

    // ====== Ustawienie dodatkowej oceny i tytułu stony ==========================================
    const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek

    const extraScoreScale = [];
    for (let i = -10; i <= 10; i++) {
        extraScoreScale.push(i);
    }
    let cardName = "";
    if (rateCC.typeRate = Type_RateCC.RATTING_) {
        cardName = 'Karta Oceny';
    } else if (rateCC.typeRate = Type_RateCC.CURRENT_) {
        cardName = 'Bieżący odsłuch';
    } else if (rateCC.typeRate = Type_RateCC.MYSTERY_) {
        cardName = 'Tajemniczy Klient';
    }

    // ====== Funkcje ==========================================

    // Update wartości
    function updateRateCC(rateCC: RateCC) {
        setRateCC(rateCC);
        setWiedzaScore(rateCC.wiedzaBlock.getRateAs100());
        setObsługaScore(rateCC.obslugaBlock.getRateAs100());
        setTechnikaScore(rateCC.technikaBlock.getRateAs100());
        setStandardScore(rateCC.standardBlock.getRateAs100());
        setKomunikacjaScore(rateCC.komunikacjaBlock.getRateAs100());
        setScore(rateCC.getRateAs100());
    }

    // ======  Funkcje obsługujące przyciski ==========================================
    function rateBtn_Click() {

        if (validate()) {
            rateCC.mode = Rate_Mode.PREVIEW_;
            setPreviewMode(true)
       
            const response = api_rateCC_add(rateCC);

            toast.update(response, {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        } else {
            toast.error("Nie uzupełniono wszystkich wymaganych pól", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        }
    }

    function editBtn_Click() {

        if (isPermit) {
            rateCC.mode = Rate_Mode.EDIT_;
            setPreviewMode(false)
            toast.warning("Włączono tryb edycji", {
                position: toast.POSITION.TOP_RIGHT,
                theme: "dark"
            });
        } else {
            toast.error("Nie masz uprawnień do edytowania", { autoClose: 15000 })
        }
    }

    // Pozostałe funkcje
    function validate(): boolean {

        if (rateCC.agent.id != 0 && rateCC.queue.id != 0 && rateCC.dateCall != "" && rateCC.idCall != "")
            return true;
        else {
            return false;
        }
    }

    const [newRateModal, setOpenNewRateModal] = useState(false);

    function newBtn_Click() {
        setOpenNewRateModal(true);
    }
    function handlenNewRateOkClick(refresh:boolean) {

        // W przypadku przejścia ze stony z parametrem onPrev szukamy tego parametru i go usuwamy
        const currentURL = new URL(window.location.href);// Pobieramy aktualny URL
        const newSearchParams = new URLSearchParams(currentURL.search); // Tworzymy nowy obiekt URLSearchParams na podstawie aktualnego URL
        newSearchParams.delete('onPrev');// Usuwamy niechciany parametr (np. "key")
        const newURL = currentURL.origin + currentURL.pathname + '?' + newSearchParams.toString();// Aktualizujemy adres URL bez niechcianego parametru
        window.history.replaceState(null, '', newURL);// Ustawiamy nowy adres URL
        if(refresh){
            window.location.reload();
        }
    }

    // Kontrola odświeżenia strony. 
    useEffect(() => {
        if (window.performance) {
            handlenNewRateOkClick(false);
        }
      }, []);

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <ConfirmDialog open={newRateModal} onClose={() => setOpenNewRateModal(true)} onConfirm={() => handlenNewRateOkClick(true)} title='Potwierdź decyzję' content='Czy napewno chcesz otworzyć nową ocenę ?' />
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
                                disabled={!isPermit || (isPermit && !prewievMode)} onClick={editBtn_Click} >Włącz edytowanie</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit && !prewievMode} onClick={rateBtn_Click}>Oceń</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit}>Zapisz</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit}>Wczytaj</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit}>Spr. Pisownie</button>
                            <button
                                className="btn btn-outline btn-info btn-sm">
                                Export do xls</button>
                        </ul>
                    </div>
                </div>
                <div className="col-span-2">
                    <p className={`justify-center  {rateCC.mode === Rate_Mode.PREVIEW_ as Rate_Mode ? 'text-yellow-600' : rateCC.mode === Rate_Mode.NEW_ as Rate_Mode ? 'text-green-500' : 'text-red-700'}`}>Tryb: {rateCC.mode}</p>
                </div>
                <div className="col-span-4">
                    <h1 className='text-info text-3xl text-center justify-center'>{cardName}</h1>
                </div>
                <div className='col-span-4'>
                    <p className='text-right mr-2'>id: {rateCC.id}</p>
                </div>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* Main */}
            <div className='grid md:grid-cols-12 md:grid-rows-2 gap-x-2 gap-y-2 mt-5 justify-center items-center'>

                {/* Podstawowe informacje */}
                <div className="col-span-10 grid md:grid-cols-2 2xl:grid-cols-4 gap-2">

                    <div className="flex md:flex-col gap-2 items-center justify-center" >
                        <input type="date"
                            className="input input-bordered input-info min-w-fit"
                            disabled={prewievMode}
                            defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.dateRate : new Date().toLocaleDateString('en-CA')} />
                        <input
                            type="date"
                            className="input input-bordered input-info min-w-fit"
                            disabled={prewievMode}
                            defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.dateCall : ""}
                            onChange={e => rateCC.dateCall = e.target.value}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-y-2">

                        <select

                            defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.agent.id : 'DEFAULT'}
                            className="select select-info w-72"
                            disabled={prewievMode}
                            onChange={
                                e => rateCC.agent = userList_.find(user => user.id = parseInt(e.target.value)) || new User()
                            }>
                            <option value="DEFAULT" disabled>Wybierz agenta ...</option>
                            {userList_.filter((user,) => user.role === Role.AGENT_).map((user, index) => (
                                <option key={index} value={user.id}>{user.nameUser}</option>
                            ))}

                        </select>

                        <select
                            defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.queue.id : 'DEFAULT'}
                            className="select select-info  w-72 "
                            disabled={prewievMode}
                            onChange={e => rateCC.queue = queueList.find(queue => queue.id = parseInt(e.target.value)) || new Queue()}>
                            <option value="DEFAULT" disabled>Wybierz kolejkę ...</option>
                            {queueList.map((e, index) => (
                                <option key={index} value={e.id}>{e.nameQueue} </option>
                            ))}
                        </select>

                    </div>

                    <div className="flex flex-col w-full items-center justify-center gap-y-2">
                        <input
                            className="input input-bordered input-info max-w-md gap-y-2 w-72"
                            defaultValue={rateCC.mode === Rate_Mode.PREVIEW_ as Rate_Mode ? rateCC.idCall : ""}
                            disabled={prewievMode}
                            type="text"
                            placeholder="ID Rozmowy"
                            onChange={e => rateCC.idCall = e.target.value} />
                        <input
                            className="input input-bordered input-info max-w-md gap-y-2 w-72"
                            defaultValue={rateCC.coach.nameUser}
                            disabled
                            type="text"
                            placeholder="Coach" />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-y-2">
                        <textarea
                            placeholder="Temat"
                            disabled={prewievMode}
                            defaultValue={rateCC.topic}
                            className="textarea textarea-info max-w-md gap-y-2 w-full h-full"
                            onChange={e => rateCC.topic = e.target.value} />
                    </div>
                </div>
                {/* Wykres */}
                <div className="col-span-12 md:col-span-2 md:row-span-2 flex justify-center items-center">
                    <div className='sm:my-5 md:mt-0 mx:ml-4 '><Arced value={score} /></div>
                </div>
                {/* Rate blocks */}
                <div className='col-span-10 grid md:grid-cols-3 2xl:grid-cols-6 gap-2 '>

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
                    <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Komunikatywność</h6>
                        <label className='text-2xl'>{komunikacjaScore} %</label>
                        <div className='bg-info w-full h-full rounded-b'></div>
                    </div>
                    <div className='flex flex-col border-info border-2 rounded-lg items-center w-full h-20 gap-2 '>
                        <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'> Standard obsługi rozmowy</h6>
                        <label className='text-2xl'>{standardScore} %</label>
                        <div className='bg-info w-full h-full rounded-b'></div>
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_w1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1 ? part.ocena = parseInt(e.target.value) : 0);
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
                                <textarea defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.wiedzaBlock.ratePart.find(part => part.key === key_w1)?.nieprawidlowosci : ""}
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_o1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.obslugaBlock.ratePart.find(part => part.key === key_o1 ? part.ocena = parseInt(e.target.value) : 0);
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_t1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t1)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.technikaBlock.ratePart.find(part => part.key === key_t1 ? part.ocena = parseInt(e.target.value) : 0);
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_t2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t2)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.technikaBlock.ratePart.find(part => part.key === key_t2 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    <p className='text-sm text-justify'>Rozwianie wątpliwości - właściwa argumentacja dostosowana do potrzeb i typu Klienta. Konsultant przedstawia się jako profesjonalista.
                                        Nie używa sformułowań o zabarwieniu negatywnym nie stosuje zwrotów budzących niepewność oraz podważających jego kompetencje
                                        (np. niestety, nie pomogę, nie wiem, nie da się, nie mogę, nie mamy możliwości, musi Pan/Pani,  moim zdaniem, podejrzewam, z doświadczenia wiem, mogę tylko,
                                        nie jestem w stanie, obawiam się, myślę że, prawdopodobnie, ewentualnie mogę, w ostateczności, w razie czego, tylko...,  być może).  </p>
                                </div>
                            </div>
                        </div>

                        {/* T3 */}
                        <h5 className='text-center my-3 text-green-500'>dbałość o wizerunek Poczty Polskiej</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_t3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t3)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.technikaBlock.ratePart.find(part => part.key === key_t3 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    <p className='text-sm text-justify'>Rozpoznanie i zrozumienie powodów, dla których Klienci przedstawiają swoje zastrzeżenia w zakresie realizowanych zadań PP.
                                        Kierowanie uwag Klienta na fakty, kszałtowanie pozytywnego  wizerunku. Konsultant nie wypowiada się negatywnie o PP ani o konkurencji.</p>
                                </div>
                            </div>
                        </div>

                        {/* T4 */}
                        <h5 className='text-center my-3 text-green-500'>kontrola rozmowy, właściwe zarządzanie czasem i przebiegiem rozmowy </h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_t4)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.technikaBlock.ratePart.find(part => part.key === key_t4)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.technikaBlock.ratePart.find(part => part.key === key_t4 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    <p className='text-sm text-justify'>Konsultant właściwie zarządza przebiegiem rozmowy.
                                        Konsultant udziela konkretnych, rzeczowych i zrozumiałych informacji - adekwatnych do zapytań Klienta.  Sprawnie porusza się po aplikacjach.
                                        Nie odbiega od tematu rozmowy, trzyma się wątku wypowiedzi, nie wdaje się z Klientem w dyskusję. Informuje Klienta o konieczności zawieszenia rozmowy
                                        (hold) celem  weryfikacji/sprawdzenia informacji jaka miałaby zostać Klientowi przekazana. Dziękuje za cierpliwość, dba o  optymalny czas zawieszenia rozmowy,
                                        informuje Klienta o ew. konieczności jego przedłużenia z podaniem przyczyny.
                                        Konsultant wita się z Klientem zaraz po połączeniu oraz rozłącza się niezwłocznie po zakończeniu rozmowy przez Klienta (gdy przerwa trwa dłużej niż 10 sekund).</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* # Komunikatywność  TAB */}
                    <div className={openTab === 4 ? "block" : "hidden"} id="link4">

                        {/* K1 */}
                        <h5 className='text-center my-3 text-green-500'>forma wypowiedzi</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_k1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k1 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    <p className='text-sm text-justify'>Konsultant mówi głośno, wyraźnie i płynnie.
                                        Konsultant stosuje odpowiednie tempo wypowiedzi. Zbyt szybkie mówienie może powodować trudności zrozumienia komunikatu, zbyt wolne może być denerwujące dla odbiorcy.
                                        Poprawna dykcja. Brak: połykania końcówek, skracania słów, przerw pomiędzy słowami a nawet zdaniami.
                                        Odpowiedni ton głosu, w którym słychać entuzjazm i pozytywne nastawienie. Brak monotonii. W rozmowie akcentowane są najważniejsze kwestie.
                                        Konsultant stosuje odpowiednie pauzy. Brak wypowiedzi „na jednym wdechu”. Brak: przeciągania wyrazów/końcówek, przesadnego akcentowania.</p>
                                </div>
                            </div>
                        </div>

                        {/* K2 */}
                        <h5 className='text-center my-3 text-green-500'>brak negatywnych emocji w rozmowie</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_k2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k2 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    disabled={prewievMode} />
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
                                    <p className='text-sm text-justify'>Konsultant rozmawia uprzejmie, nie przenosi negatywnych odczuć z poprzednich rozmów.
                                        Konsultant nie reaguje śmiechem na zachowanie/problem/ton głosu/sposób mówienia Klienta.
                                        Konsultant jest opanowany – kiedy Klient się irytuje i czegoś nie rozumie, Konsultant nie atakuje Klienta, nie traktuje go „z góry” (np. przecież już to Panu tłumaczyłem, powtarzam po raz kolejny).
                                        Konsultant nie okazuje zdenerwowania, zirytowania, arogancji, znudzenia.
                                        Konsultant nie wypowiada się w sposób ironiczny, sarkastyczny, cyniczny. Konsultant nie daje odczuć Klientowi, że chce jak najszybciej zakończyć rozmowę</p>
                                </div>
                            </div>
                        </div>

                        {/* K3 */}
                        <h5 className='text-center my-3 text-green-500'>aktywne słuchanie</h5>

                        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>

                            {/* WAGA i OCENA */}
                            <div className='md:col-span-2 md:flex md:flex-row gap-5 h-full ' >
                                <div className='flex flex-col xl:flex-row w-full '>

                                    <div className='flex flex-col items-center justify-start w-full mt-5' >
                                        <label className="label">
                                            <span className="label-text text-center xl:text-2xl">Waga</span>
                                        </label>
                                        <label className="label xl:h-16 xl:mt-2">
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_k3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.komunikacjaBlock.ratePart.find(part => part.key === key_k3 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    <p className='text-sm text-justify'>Koncentracja na wypowiedzi Klienta - uważne słuchanie Klienta, nie dopytywanie kilka razy o to samo, nie przerywanie rozmówcy jego wypowiedzi,
                                        nie mówienie równocześnie z Klientem.Dopuszczalne jest przerywanie Klientowi wypowiedzi w sposób kulturalny jeżeli odbiega od tematu rozmowy.
                                        Reakcja ze strony Konsultanta na monolog a także milczenie klienta. Jeżeli Klient przerywa Konsultantowi, należy zawiesić głos. Konsultant nie przekrzykuje Klienta, pozwala dokończyć wypowiedź.</p>
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_s1)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s1)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.standardBlock.ratePart.find(part => part.key === key_s1 ? part.ocena = parseInt(e.target.value) : 0);
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
                                    <p className='text-sm text-justify'>Powitanie i pożegnanie zgodnie ze standardem CC. Konsultant zobowiązany jest wyraźnie podać imię i nazwisko oraz wyrazić chęć pomocy.
                                        W zakończeniu -  wyrażenie chęci pomocy w innej niż omówiona/podsumowana sprawa (elastyczne stosowanie sformułowania "Czy mogę jeszcze w czymś pomóc?"),
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_s2)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s2)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.standardBlock.ratePart.find(part => part.key === key_s2 ? part.ocena = parseInt(e.target.value) : 0);
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_s3)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s3)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.standardBlock.ratePart.find(part => part.key === key_s3 ? part.ocena = parseInt(e.target.value) : 0);
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
                                            <span className="label-text text-center xl:text-4xl">{getWagRateCC(key_s4)}%</span>
                                        </label>
                                    </div>

                                    <div className='flex flex-col items-center justify-start w-full xl:mt-5'>
                                        <label className="label">
                                            <span className="label-text xl:text-2xl">Ocena</span>
                                        </label>
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.standardBlock.ratePart.find(part => part.key === key_s4)?.ocena : "1"}
                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.standardBlock.ratePart.find(part => part.key === key_s4 ? part.ocena = parseInt(e.target.value) : 0);
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
                                        <select defaultValue={rateCC.mode != Rate_Mode.NEW_ as Rate_Mode ? rateCC.extraScore : 0}

                                            className="select select-bordered xl:select-lg text-center m-2"
                                            disabled={prewievMode}
                                            onChange={e => {
                                                rateCC.extraScore = parseInt(e.target.value)
                                                updateRateCC(rateCC);
                                            }}>

                                            {extraScoreScale.map((value, index) => (
                                                <option key={index} value={value}>
                                                    {value}
                                                </option>
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

