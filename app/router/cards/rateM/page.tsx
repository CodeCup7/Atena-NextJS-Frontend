'use client'
import { ModeLabels, Rate_Mode, Type_Rate } from '@/app/classes/enums';
import { RateM } from '@/app/classes/rates/rateM';
import { Role, User } from '@/app/classes/user';
import { CreateNewEmptyRateM, getRateM_RateAs100, } from '@/app/factory/factory_rateM';
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { api_rateM_add, api_rateM_downloadAttachment, api_rateM_export, api_rateM_getAttachment, api_rateM_update } from '@/app/api/rateM_api';
import { updateUserList } from '@/app/factory/factory_user';
import { getRateBlock_MaxRate, getRateBlock_Rate, getRateBlock_RateAs100 } from '@/app/factory/factory_rateBlock';
import { getActiveUser } from '@/app/auth';
import { RateM_chart } from '../../components/chart/rateM_chart';
import { RateBlock } from '@/app/classes/rates/rateBlock';
import RatePartComponent from '../components/ratePartComponent';
import { getKeyTitle, key_o, key_s, key_t, key_w } from '@/app/globalKeys';
import RateBlockComponent from '../components/rateBlockComponent';

const RateM_Page = () => {

    // ====== Hooks =====================================================================================================================================================================================================================
    const [isPermit, setIsPermit] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [activeUser, setActiveUser] = useState(new User());
    const [rateM, setRateM] = useState(new RateM());
    const [prewievMode, setPreviewMode] = useState(false);
    const [userList, setUserList] = useState<Array<User>>([]);
    const [extraScore, setExtraScore] = useState(0);
    const [newRateModal, setOpenNewRateModal] = useState(false);
    const [agent, setAgent] = useState(0);

    const rateBlocks: string[] = [getKeyTitle(key_w, Type_Rate.CC_), getKeyTitle(key_o, Type_Rate.CC_), getKeyTitle(key_t, Type_Rate.CC_),
    getKeyTitle(key_s, Type_Rate.CC_),]

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
                const rateM_prev = localStorage.getItem('rateM_prev');

                if (rateM_prev != null) {
                    const previewRateM = JSON.parse(rateM_prev);
                    previewRateM.mode = Rate_Mode.PREVIEW_;

                    // pobranie załącznika do sprawy
                    const attachmentFile: File = await api_rateM_getAttachment(previewRateM.attachmentPath)
                    updateRateM(previewRateM);
                    setAttachment(attachmentFile)

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

    // ====== Hooks RateCC =====================================================================================================================================================================================================================
    const [wiedzaScore, setWiedzaScore] = useState(getRateBlock_RateAs100(rateM.wiedzaBlock));
    const [obsługaScore, setObsługaScore] = useState(getRateBlock_RateAs100(rateM.obslugaBlock));
    const [technikaScore, setTechnikaScore] = useState(getRateBlock_RateAs100(rateM.technikaBlock));
    const [standardScore, setStandardScore] = useState(getRateBlock_RateAs100(rateM.standardBlock));
    const [score, setScore] = useState(getRateM_RateAs100(rateM));

    const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek

    // ====== Ustawienie dodatkowej oceny =====================================================================================================================================================================================================================
    const extraScoreScale = [];
    for (let i = -10; i <= 10; i++) {
        extraScoreScale.push(i);
    }

    // ====== Funkcje =====================================================================================================================================================================================================================
    function updateRateM(rateM: RateM) {
        setRateM(rateM);
        setWiedzaScore(getRateBlock_RateAs100(rateM.wiedzaBlock));
        setObsługaScore(getRateBlock_RateAs100(rateM.obslugaBlock));
        setTechnikaScore(getRateBlock_RateAs100(rateM.technikaBlock));
        setStandardScore(getRateBlock_RateAs100(rateM.standardBlock));
        setScore(getRateM_RateAs100(rateM));
        setExtraScore(rateM.extraScore);
        setAgent(rateM.agent.id);
        rateM.mode === Rate_Mode.PREVIEW_ ? setPreviewMode(true) : setPreviewMode(false);
    }
    function validate(): boolean {
        if (rateM.agent.id !== 0 && attachment !== null) {
            return true;
        } else {
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

    // ====== Załącznik =====================================================================================================================================================================================================================
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [attachment, setAttachment] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setAttachment(event.target.files[0]);
        }
    };

    function download() {
        api_rateM_downloadAttachment(rateM.attachmentPath);
    }

    // ====== Akcje =====================================================================================================================================================================================================================
    function newBtn_Click() {
        setOpenNewRateModal(true);
        localStorage.removeItem('rateM_prev');
        const newRateM = CreateNewEmptyRateM(activeUser);
        updateRateM(newRateM);
    }

    function rateBtn_Click() {

        if (validate()) {
            if (rateM.id === 0 && attachment !== null) {
                api_rateM_add(rateM, attachment).then((foo => {
                    if (foo.isOK === true) {
                        const rate: RateM = foo.rateM; // Aktualizacja oceny o ID z DB
                        rate.mode = Rate_Mode.PREVIEW_;
                        updateRateM(rate)
                        toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    } else {
                        toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    }
                }));
            } else {
                api_rateM_update(rateM, attachment).then((foo => {
                    if (foo.isOK === true) {

                        rateM.mode = Rate_Mode.PREVIEW_;
                        updateRateM(rateM)

                        toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    } else {
                        toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    }
                }));
            }
        } else {
            toast.error("Nie wybrano agenta lub załącznika", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }

    function editBtn_Click() {

        if (isPermit) {
            rateM.mode = Rate_Mode.EDIT_;
            updateRateM(rateM)
            toast.warning("Włączono tryb edycji", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        } else {
            toast.error("Nie masz uprawnień do edytowania", { autoClose: 15000 })
        }
    }

    function tempSave_Click() {
        localStorage.setItem('tempRateM', JSON.stringify(rateM));
        toast.success("Pomyślnie zapisano tymczasowo ocenę", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
    }

    function tempLoad_Click() {
        const checkTemp = localStorage.getItem('tempRateM');
        if (checkTemp !== null) {
            const tempRateM = JSON.parse(checkTemp);
            updateRateM(tempRateM);
        }
    }
    function exportToFile_Click() {
        api_rateM_export(rateM);
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
                                disabled={!isPermit || (isPermit && prewievMode)} onClick={tempSave_Click}>Zapisz</button>
                            <button
                                className="btn btn-outline btn-info btn-sm"
                                disabled={!isPermit || (isPermit && prewievMode)} onClick={tempLoad_Click}>Wczytaj</button>
                            <button
                                className="btn btn-outline btn-info btn-sm" onClick={exportToFile_Click}>Export do pliku</button>
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
                <div className="col-span-9 flex flex-col 2xl:flex-row  h-full gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-center items-center">
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
                    <div className="flex flex-col lg:flex-row gap-4 w-full justify-center items-center" >
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

                            {attachment === null ?
                                <div className='flex gap-2'>
                                    <input type="file" className="file-input file-input-bordered file-input-info w-full max-w-xs"
                                        value={''}
                                        onChange={handleFileChange}
                                        ref={fileInputRef} />
                                </div>
                                :
                                <div className='flex gap-2'>
                                    <input type="text" className="file-input file-input-bordered file-input-info w-full max-w-xs text-center text-xs"
                                        value={attachment.name}
                                        onChange={() => { }} />
                                    <div className="dropdown w-max">
                                        <label tabIndex={0} className="group btn btn-md hover:text-warning">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-6 h-6 hover:text-warning">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>
                                        </label>
                                        <ul tabIndex={0} className="dropdown dropdown-content z-[50] menu shadow bg-base-100 rounded-box border-2">
                                            <li>
                                                <button className='btn btn-info btn-sm hover:btn-success m-1  items-center justify-star h-10 '
                                                    onClick={download}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    <p>Pobierz</p>
                                                </button>
                                            </li>
                                            <li >
                                                <button
                                                    className='btn btn-info btn-sm hover:btn-error m-1 h-10 items-center justify-start'
                                                    onClick={() => {
                                                        setAttachment(null);
                                                    }}
                                                    disabled={prewievMode}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                                    </svg>
                                                    <p>Zmień</p>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                </div>
                            }

                        </div>
                    </div>
                </div>
                <div className="col-span-3 row-span-2 flex 2xl:h-64 h-full justify-center items-center">
                    <RateM_chart value={score} />
                </div>
                <div className="col-span-9 flex flex-col 2xl:flex-row  gap-2 h-full">
                    {/* Rate blocks */}
                    <div className="flex flex-col lg:flex-row gap-4 justify-end items-center sm:justify-center w-full m-2">

                        <div className='flex flex-col 2xl:flex-row gap-2'>
                            <div className="flex flex-col items-center h-20 gap-2 w-48">
                                <RateBlockComponent title={getKeyTitle(key_w, Type_Rate.CC_)} score={wiedzaScore} rateBlock={rateM.wiedzaBlock} />
                            </div>
                            <div className="flex flex-col items-center h-20 gap-2 w-48">
                                <RateBlockComponent title={getKeyTitle(key_o, Type_Rate.CC_)} score={obsługaScore} rateBlock={rateM.obslugaBlock} />
                            </div>
                        </div>
                        <div className="flex flex-col items-center h-20 gap-2 w-48">
                            <RateBlockComponent title={getKeyTitle(key_t, Type_Rate.CC_)} score={technikaScore} rateBlock={rateM.technikaBlock} />
                        </div>
                        <div className='flex flex-col 2xl:flex-row gap-2'>
                            <div className="flex flex-col items-center h-20 gap-2 w-48">
                                <RateBlockComponent title={getKeyTitle(key_s, Type_Rate.CC_)} score={standardScore} rateBlock={rateM.standardBlock} />
                            </div>
                            <div className='flex flex-col border-2 rounded-lg items-center  h-20 gap-2 w-48'>
                                <h6 className='text-center text-sm bg-slate-700 w-full rounded-t'>Dodatkowa punktacja</h6>
                                <label className='text-2xl'>{rateM.extraScore}</label>
                                <div className='bg-info w-full h-full rounded-b'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='col-span-12 mt-2'>
                <div className="tabs justify-center items-center">

                    {rateBlocks.map((title: string, index: number) => (
                        <a
                            key={index}
                            className={`tab tab-bordered sm:tab-sm md:tab-lg text-xs ${openTab === index + 1 ? "tab-active" : ""}`}
                            onClick={e => {
                                e.preventDefault();
                                setOpenTab(index + 1);
                            }}
                            data-toggle="tab"
                            href={`#link${index + 1}`}
                            role="tablist">
                            {title}
                        </a>
                    ))}

                    <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
                    }
                        onClick={e => {
                            e.preventDefault(); setOpenTab(5);
                        }}
                        data-toggle="tab" href="#link6" role="tablist" > Dodatkowa punktacja </a>
                </div>

                {/* <!-- Tab content --> */}
                <div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">

                    {/* # Wiedza TAB */}
                    <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                        {rateM.wiedzaBlock.ratePart.map(part => (
                            <RatePartComponent
                                typeRate={Type_Rate.M_}
                                key={part.key}
                                ratePart={part}
                                prewievMode={prewievMode}
                                updateRatePart={() => updateRateM(rateM)} />))}

                    </div>
                    {/* # Obsługa aplikacji / systemów TAB */}
                    <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                        {rateM.obslugaBlock.ratePart.map(part => (
                            <RatePartComponent
                                typeRate={Type_Rate.M_}
                                key={part.key}
                                ratePart={part}
                                prewievMode={prewievMode}
                                updateRatePart={() => updateRateM(rateM)} />))}
                    </div>

                    {/* # Techniki obsługi TAB */}
                    <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                        {rateM.technikaBlock.ratePart.map(part => (
                            <RatePartComponent
                                typeRate={Type_Rate.M_}
                                key={part.key}
                                ratePart={part}
                                prewievMode={prewievMode}
                                updateRatePart={() => updateRateM(rateM)} />))}

                    </div>
                    {/* # Standard obsługi rozmowy TAB */}
                    <div className={openTab === 4 ? "block" : "hidden"} id="link5">
                        {rateM.standardBlock.ratePart.map(part => (
                            <RatePartComponent
                                typeRate={Type_Rate.M_}
                                key={part.key}
                                ratePart={part}
                                prewievMode={prewievMode}
                                updateRatePart={() => updateRateM(rateM)} />))}
                    </div>

                    {/* # Dodatkowa punktacja TAB */}
                    <div className={openTab === 5 ? "block" : "hidden"} id="link6">

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
                                    onChange={e => rateM.extraScoreTxt = e.target.value} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default RateM_Page


