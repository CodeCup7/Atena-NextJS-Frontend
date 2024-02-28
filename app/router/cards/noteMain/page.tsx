'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Rate_Mode, StatusLabels, Status_Note } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/rates/noteCC';
import { Get_NoteList_With_NoStartNote } from '@/app/factory/factory_noteCC';
import { RateCC } from '@/app/classes/rates/rateCC';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import { updateUserList } from '@/app/factory/factory_user';
import { User } from '@/app/classes/user';
import { api_NoteCC_deleteNote, api_NoteCC_search } from '@/app/api/noteCC_api';
import { getActiveUser } from '@/app/auth';
import { getRateCC_RateAs100 } from '@/app/factory/factory_rateCC';
import ConfirmDialog from '../../components/dialog/ConfirmDialog';
import { RateM } from '@/app/classes/rates/rateM';
import { getRateM_RateAs100 } from '@/app/factory/factory_rateM';
import { api_rateCC_deleteList, api_rateCC_getAllRateNoNoteByAgent, api_rateCC_updateList } from '@/app/api/rateCC_api';
import { api_rateM_deleteList, api_rateM_getAllRateNoNoteByAgent, api_rateM_updateList } from '@/app/api/rateM_api';
import { calculateStartEndDate } from '@/app/global';
import { FiltrNoteCC } from '@/app/classes/filtrs/noteCC_Filtr';
import { createSearchCriteriaByFiltrNoteCC } from '@/app/factory/factory_searchCriteria';
import { IconAdd, IconCalendar, IconDelete, IconDownload, IconJoinDisc, IconNoteCC, IconNoteMain, IconSearch, IconUpdate } from '../../components/icons/icons';

export const NoteMain = () => {

    // ====== Hooks =====================================================================================================================================================================================================================
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
    const [downloadList, setDownloadList] = useState<Array<NoteCC>>([]);
    const [userList, setUserList] = useState<Array<User>>([]);
    const [isLoading, setIsLoading] = useState(false);

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
                toast.error('Błąd pobierania użytkowników', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
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
        setChoiseRateCC([]);
        setChoiseRateM([]);
    }, [noteList]);

    // ====== Obsługa zaznaczeń ocen =====================================================================================================================================================================================================================
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

    // ====== Funkcje =====================================================================================================================================================================================================================
    function getCoaching(dateValue: string) {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {
            setIsLoading(true); // Ustaw stan ładowania na true
            async function fetchData() {
                try {
                    const { startDate, endDate } = calculateStartEndDate(dateValue + '-01', 0);
                    const noteFilter = new FiltrNoteCC();
                    noteFilter.appliesDateStart = startDate.toString();
                    noteFilter.appliesDateEnd = endDate.toString();

                    const getExistNoteList = await api_NoteCC_search(createSearchCriteriaByFiltrNoteCC(noteFilter));
                    const noteList = await Get_NoteList_With_NoStartNote(userList, getExistNoteList, dateValue);

                    setDownloadList(noteList);
                    setNoteList(noteList);

                } catch (error) {
                    toast.error('Błąd pobierania coachingów', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                    console.error('Błąd pobierania coachingów:', error);
                } finally {
                    setIsLoading(false); // Ustaw stan ładowania na false po zakończeniu operacji
                };
            }
            fetchData();
        }
    }

    const [notePath, setNotePath] = useState('/router/cards/noteCC');
    // Karta coucha aktywna tylko wtedy gdy użytkownik przypisze oceny do coachingu lub gdy coaching jest w trybie podglądu
    useEffect(() => {
        setNotePath(choiseRateCC.length !== 0 || choiseRateM.length !== 0 || selectedNoteCC.mode === Rate_Mode.PREVIEW_ ? '/router/cards/noteCC' : '');
    }, [choiseRateCC.length, selectedNoteCC.mode, choiseRateM.length]);

    // ====== Akcje =====================================================================================================================================================================================================================
    function downloadData_Click() {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {

            getCoaching(dateValue);

        } else {
            toast.error("Wybierz datę!", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }
    function coaching_Click() {

        if (selectedNoteCC.mode === Rate_Mode.NEW_) { // Nowy Coaching
            // Sprawdzenie czy wybrano rozmowy do coachingu
            if (choiseRateCC.length === 0 && choiseRateM.length === 0) {
                toast.error("Nie wybrano żadnych rozmów do coachingu", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
                return false;
            } else {

                selectedNoteCC.appliesDate = dateValue + '-01'
                selectedNoteCC.rateCC_Col = choiseRateCC //Przypisanie wybranych rozmów do coachingu
                selectedNoteCC.rateM_Col = choiseRateM //Przypisanie wybranych maili do coachingu
                localStorage.removeItem('noteCC_prev');
                localStorage.setItem('noteCC_new', JSON.stringify(selectedNoteCC))
                return true;
            }
        } else { // Podgląd coachingu
            localStorage.removeItem('noteCC_new');
            localStorage.setItem('noteCC_prev', JSON.stringify(selectedNoteCC))
            return true;
        }
    }

    function deleteCoaching_Click() {// Usuwanie coachingu - usuwa coaching z bazy i rozwiązuje powiązane z nim oceny ustawiajac pole noteCC_id w DB jako NULL
        setOpenNewRateModal(false);

        api_NoteCC_deleteNote(selectedNoteCC).then((foo => {
            if (foo.isOK === true) {
                getCoaching(dateValue);
                toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            } else {
                toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            }
        }));
    }

    async function rateCCListSync() { // ** Sekcja ** aktualizowania ocen CC w coachingu - pobranie danych

        const list: RateCC[] = await api_rateCC_getAllRateNoNoteByAgent(selectedNoteCC.agent.id); // Pobranie wszytskich rozmów agenta z bazy które nie mają idNote
        list.forEach(rateCC => {
            rateCC.mode = Rate_Mode.LOAD_;
        });

        const updatedNoteCC = { ...selectedNoteCC };
        updatedNoteCC.rateCC_Col = updatedNoteCC.rateCC_Col.filter(rateCC => rateCC.mode !== Rate_Mode.LOAD_); // Filtracja duplikatów na podstawie atrybutu mode
        updatedNoteCC.rateCC_Col = [...updatedNoteCC.rateCC_Col, ...list];
        setSelectedNoteCC(updatedNoteCC);
    }

    async function rateCCListUpdate() { // ** Sekcja ** aktualizowania ocen CC w coachingu - aktualizacja danych

        if (choiseRateCC.length > 0) {
            const noLoadMode = selectedNoteCC.rateCC_Col.filter(rateCC => rateCC.mode !== Rate_Mode.LOAD_);
            const loadMode = selectedNoteCC.rateCC_Col.filter(rateCC => rateCC.mode === Rate_Mode.LOAD_);

            const toDeleteList: RateCC[] = noLoadMode.filter(item => choiseRateCC.indexOf(item) < 0); // Lista spraw do usunięcia idNote z DB
            const toUpdateList: RateCC[] = loadMode.filter(item => choiseRateCC.indexOf(item) > 0); // Lista spraw do zaaktualizowania idNote z DB

            const updateResponse = await api_rateCC_updateList(toUpdateList, selectedNoteCC.id);
            const deleteResponse = await api_rateCC_deleteList(toDeleteList);

            if (updateResponse.isOK && deleteResponse.isOK) {
                setNoteList(new Array<NoteCC>)
                toast.info("Pomyślnie zaktualizowano listę ocen - pobierz ponownie dane", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            }
        } else {
            toast.error("Coaching musi zawierać choć jedną ocenę.", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }


    }

    async function rateMListSync() { // ** Sekcja ** aktualizowania ocen M w coachingu - pobranie danych

        // Pobranie wszytskich rozmów agenta z bazy które nie mają idNote
        const list: RateM[] = await api_rateM_getAllRateNoNoteByAgent(selectedNoteCC.agent.id);
        list.forEach(rateM => {
            rateM.mode = Rate_Mode.LOAD_;
        });

        const updatedNoteCC = { ...selectedNoteCC };
        updatedNoteCC.rateM_Col = updatedNoteCC.rateM_Col.filter(rateM => rateM.mode !== Rate_Mode.LOAD_);// Filtracja duplikatów na podstawie atrybutu mode
        updatedNoteCC.rateM_Col = [...updatedNoteCC.rateM_Col, ...list];
        setSelectedNoteCC(updatedNoteCC);
    }

    async function rateMListUpdate() { // ** Sekcja ** aktualizowania ocen M w coachingu - aktualizacja danych

        if (choiseRateM.length > 0) {

            const noLoadMode = selectedNoteCC.rateM_Col.filter(rateM => rateM.mode !== Rate_Mode.LOAD_);
            const loadMode = selectedNoteCC.rateM_Col.filter(rateM => rateM.mode === Rate_Mode.LOAD_);

            const toDeleteList: RateM[] = noLoadMode.filter(item => choiseRateM.indexOf(item) < 0); // Lista spraw do usunięcia idNote z DB
            const toUpdateList: RateM[] = loadMode.filter(item => choiseRateM.indexOf(item) > 0); // Lista spraw do zaaktualizowania idNote z DB

            const updateResponse = await api_rateM_updateList(toUpdateList, selectedNoteCC.id);
            const deleteResponse = await api_rateM_deleteList(toDeleteList);

            if (updateResponse.isOK && deleteResponse.isOK) {
                setNoteList(new Array<NoteCC>)
                toast.info("Pomyślnie zaktualizowano listę ocen - pobierz ponownie dane", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
            }

        } else {
            toast.error("Coaching musi zawierać choć jedną ocenę.", { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
    }
    // ====== Ikony w tabeli =====================================================================================================================================================================================================================
    const PreviewIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );

    // ====== Filtrowanie listy coachingów =====================================================================================================================================================================================================================
    const [isMy, setSelectedCoach] = useState('false');
    const [filterStatus, setSelectedStatus] = useState(Status_Note.ALL_);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        filterService();
    }, [isMy, filterStatus, searchTerm]);

    function filterService() {
        let filteredList = downloadList;

        if (isMy === 'true') {
            filteredList = filteredList.filter(note => note.agent.coachId === activeUser.id);
        }

        if (filterStatus !== Status_Note.ALL_) {
            filteredList = filteredList.filter(note => note.status === filterStatus);
        }

        if (searchTerm !== '') {
            filteredList = filteredList.filter(note =>
                note.agent.nameUser.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setNoteList(filteredList);
    }

    // ====== HTML =====================================================================================================================================================================================================================
    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
            <ConfirmDialog open={newRateModal} onClose={() => setOpenNewRateModal(false)} onConfirm={() => {
                deleteCoaching_Click
            }}
                title='Potwierdź decyzję' content={'Czy napewno chcesz usunąć coaching agenta ' + selectedNoteCC.agent.nameUser + ' ?'} />
            <div className='flex items-center justify-center'>
                <IconNoteMain size={12} className='text-info' />
                <h1 className='text-info text-3xl text-center ml-3'> Menu monitoringu</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* Data */}
            <div className='flex flex-col items-center justify-center mt-1'>
                <div className='flex mt-5 w-full items-center justify-center'>
                    <IconCalendar size={12} className='text-info mr-2'/>
                        <input
                            className="input input-bordered w-48 max-w-xs"
                            value={dateValue}
                            onChange={e => { setDateValue(e.currentTarget.value); }}
                            type="month" />
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

            {/* Coachingi */}
            <div className='flex flex-col xl:flex-row p-2'>
                <div className="overflow-x-auto mr-6 mt-6 items-center justify-start">
                    <div className='flex items-center justify-start'>
                        <IconNoteCC size={8} className='text-info' />
                        <h1 className='text-info text-2xl text-center ml-3'> Coachingi</h1>
                    </div>
                    <div className="overflow-x-auto h-96">
                        <table className="table table-pin-rows min-w-full ">
                            {/* head */}
                            <thead>
                                <tr >
                                    <td colSpan={3} align='left'>
                                        <label className="input input-bordered flex items-center gap-2 w-full">
                                            <IconSearch />
                                            <input
                                                className="bg-transparent text-white"
                                                type="text"
                                                placeholder="Wyszukaj agenta"
                                                value={searchTerm}
                                                onChange={e => {
                                                    setSearchTerm(e.target.value)
                                                }} />

                                        </label>
                                    </td>

                                </tr>
                                <tr>
                                    <th>
                                        Filtruj
                                    </th>
                                    <th>
                                        <select className="select select-bordered select-sm w-full"
                                            defaultValue={'false'}
                                            onChange={e => {
                                                setSelectedCoach(e.target.value)

                                            }}>
                                            <option value="true">Moi</option>
                                            <option value="false">Wszyscy</option>
                                        </select>
                                    </th>
                                    <th>
                                        <select className="select select-bordered select-sm w-fit"
                                            defaultValue={Status_Note.ALL_}
                                            onChange={e => { setSelectedStatus(e.target.value as Status_Note) }}>
                                            <option value={Status_Note.ALL_}>{StatusLabels[Status_Note.ALL_]}</option>
                                            <option value={Status_Note.NO_START_}> {StatusLabels[Status_Note.NO_START_]} </option>
                                            <option value={Status_Note.CLOSE_}> {StatusLabels[Status_Note.CLOSE_]} </option>
                                            <option value={Status_Note.CLOSE_WITHOUT_}> {StatusLabels[Status_Note.CLOSE_WITHOUT_]} </option>
                                            <option value={Status_Note.APPEAL_}> {StatusLabels[Status_Note.APPEAL_]} </option>
                                        </select>
                                    </th>
                                    <th>

                                    </th>

                                </tr>
                            </thead>
                            <tbody className="table-auto overflow-scroll w-full" >
                                {isLoading ? (
                                    <tr className='w-full'>
                                        <td colSpan={3} align='center'> {/* Ustaw colSpan na liczbę kolumn w Twojej tabeli */}
                                            <div className="text-center loading loading-ring loading-lg"></div>
                                        </td>
                                    </tr>
                                ) : (
                                    noteList.map((noteCC, index) => {
                                        return (
                                            <tr key={index}
                                                onClick={() => {
                                                    setSelectedNoteCC(noteCC);
                                                    setRowIndex(index);
                                                }}
                                                className={`hover:bg-base-300  hover:text-white cursor-pointer ${index === rowIndex ? 'bg-slate-950 text-white' : ''
                                                    } cursor-pointer`}>
                                                <td>{noteCC.agent.nameUser}</td>
                                                <td>{StatusLabels[noteCC.status]}</td>
                                                <td>{noteCC.appliesDate}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>

                        </table>
                    </div>
                    <div className={`flex gap-2 mt-2 disabled: ${selectedNoteCC.id > - 1} `}>

                        <Link className={`group link link-accent link-hover text-lg ${selectedNoteCC.id === - 1 ? 'pointer-events-none' : ''}`}
                            href={{
                                pathname: notePath
                            }}>
                            <button className="btn btn-outline btn-info btn-sm"
                                disabled={selectedNoteCC.id === -1}
                                onClick={coaching_Click}>
                                <PreviewIcon />
                                {selectedNoteCC.id === 0 ? "Rozpocznij coaching" : "Podgląd"}
                            </button>
                        </Link>

                        <button className="btn btn-outline btn-error btn-sm"
                            disabled={selectedNoteCC.status === Status_Note.NO_START_}
                            onClick={deleteCoaching_Click}>
                            <IconDelete />
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
                            data-toggle="tab" href="#link1" role="tablist" > Rozmowy [ {selectedNoteCC.rateCC_Col.length} ]</a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenTab(2);
                            }}
                            data-toggle="tab" href="#link2" role="tablist" > Maile [ {selectedNoteCC.rateM_Col.length} ] </a>

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
                                                    value={choiseRateCC.length === 0 ? 0 : 1}
                                                    onClick={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.checked ? setChoiseRateCC(selectedNoteCC.rateCC_Col) : setChoiseRateCC([])
                                                    }} />
                                            </th>
                                            <th>Data rozmowy</th>
                                            <th>Kolejka</th>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
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
                                                    <td>{rateCC.mode === Rate_Mode.LOAD_ ? '' : selectedNoteCC.id}</td>
                                                    <td>
                                                        <Link className="group link link-info link-hover text-lg"
                                                            href='/router/cards/rateCC'>
                                                            <button className="btn btn-outline btn-info btn-sm"
                                                                onClick={() => {
                                                                    localStorage.removeItem('rateCC_prev');
                                                                    localStorage.setItem('rateCC_prev', JSON.stringify(rateCC));
                                                                }}>
                                                                <PreviewIcon />
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
                                            <IconAdd />
                                            Nowa
                                        </button>
                                    </Link>
                                    <button className="btn btn-outline btn-info btn-sm"
                                        onClick={rateCCListSync}>
                                        <IconJoinDisc />
                                        Dołącz rozłącz
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm"
                                        onClick={rateCCListUpdate}>
                                        <IconUpdate />
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
                                                    value={choiseRateM.length === 0 ? 0 : 1}
                                                    onClick={(e) => {
                                                        const target = e.target as HTMLInputElement;
                                                        target.checked ? setChoiseRateM(selectedNoteCC.rateM_Col) : setChoiseRateM([])
                                                    }} />
                                            </th>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
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
                                                    <td>{rateM.mode === Rate_Mode.LOAD_ ? '' : selectedNoteCC.id}</td>
                                                    <td>
                                                        <Link className="group link link-info link-hover text-lg"
                                                            href='/router/cards/rateM'>
                                                            <button className="btn btn-outline btn-info btn-sm"
                                                                onClick={() => {
                                                                    localStorage.removeItem('rateM_prev');
                                                                    localStorage.setItem('rateM_prev', JSON.stringify(rateM));
                                                                }}>
                                                                <PreviewIcon />
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
                                            <IconAdd />
                                            Nowa
                                        </button>
                                    </Link>
                                    <button className="btn btn-outline btn-info btn-sm"
                                        onClick={rateMListSync}>
                                        <IconJoinDisc />
                                        Dołącz rozłącz
                                    </button>
                                    <button className="btn btn-outline btn-info btn-sm"
                                        onClick={rateMListUpdate}>
                                        <IconUpdate />
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

