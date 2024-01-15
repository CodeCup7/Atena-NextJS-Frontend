'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatusLabels, Status_Note } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/noteCC';
import { Get_NoteList_With_NoStartNote } from '@/app/factory/factory_noteCC';
import { RateCC } from '@/app/classes/rateCC';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from 'react-toastify';
import { getActiveUser } from '@/app/global';
import { global_userList, updateUserList } from '@/app/factory/factory_user';
import { User } from '@/app/classes/user';
import { api_NoteCC_getDate } from '@/app/api/noteCC_api';

export const NoteMain = () => {

    const [rowIndex, setRowIndex] = useState(-1);

    const [dateValue, setDateValue] = useState('');
    const [openTab, setOpenTab] = useState(1);

    const [selectedNoteCC, setSelectedNoteCC] = useState(new NoteCC);
    const [selectedRateCC, setSelectedRateCC] = useState(new RateCC);

    const [noteList, setNoteList] = useState<Array<NoteCC>>([]);
    const [downloadList, setDowloadList] = useState<Array<NoteCC>>([]);

    const [userList, setUserList] = useState<Array<User>>([]);

    const [agentFilter, setAgentFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await updateUserList();
                setUserList(users);

            } catch (error) {
                console.error('Błąd pobierania użytkowników:', error);
            }
        }
        fetchData();

    }, []);

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 7); // YYYY-MM
        setDateValue(formattedDate);
    }, []);

    useEffect(() => {
        const empyNote = new NoteCC();
        empyNote.id = -1;
        setSelectedNoteCC(empyNote);
        setRowIndex(-1);
    }, [noteList]);

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

                    setUserList(global_userList);

                    const getExistNoteList = await api_NoteCC_getDate(startDate.toLocaleDateString(), endDate.toLocaleDateString());
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
            setNoteList(downloadList.filter(note => note.agent.coachId === getActiveUser().id));
        } else if (agentFilter === 'MY' && statusFilter != 'ALL') { // Filtr dla MOICH i wybranego statusu)
            setNoteList(downloadList.filter(note => note.agent.coachId === getActiveUser().id && note.status === statusFilter));
        } else if (agentFilter === 'ALL' && statusFilter != 'ALL') { // Filtr dla wszystkich i wybranego statusu
            setNoteList(downloadList.filter(note => note.status === statusFilter));
        }
    }

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />
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
                        Pobierz dane+
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
                                        <option> {StatusLabels[Status_Note.NO_START]} </option>
                                        <option> {StatusLabels[Status_Note.CLOSE]} </option>
                                        <option> {StatusLabels[Status_Note.CLOSE_WITHOUT]} </option>
                                    </select>
                                </th>
                                <th>
                                    <button className='btn' onClick={filterService}>Filtruj</button>
                                </th>

                            </tr>
                        </thead>
                        <tbody className="table-auto overflow-scroll w-full" >
                            {noteList.map((noteCC, index) => {
                                return (
                                    <tr key={index}
                                        onClick={() => {
                                            setSelectedNoteCC(noteCC);
                                            console.log('ID :', noteCC.id);
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
                                pathname: "/router/cards/noteCC",
                                query: {noteCCDate: JSON.stringify(selectedNoteCC) }
                                
                            }}>
                            <button className="btn btn-outline btn-info btn-sm" disabled={selectedNoteCC.id === -1}>
                                {selectedNoteCC.id > 0 ? 'Podgląd' : 'Rozpocznij coaching'}
                                </button>
                        </Link>

                        <button className="btn btn-outline btn-error btn-sm">Usuń</button>
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
                                            <th>Data rozmowy</th>
                                            <th>Kolejka</th>
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
                                            <th>Data udost.</th>
                                            <th>Coaching id.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-auto overflow-scroll w-full">
                                        {selectedNoteCC.rateCC_Col.map((rateCC, index) => {
                                            return (
                                                <tr key={index} className="hover:bg-base-200 cursor-pointer">
                                                    <td>{rateCC.dateCall}</td>
                                                    <td>{rateCC.queue.nameQueue}</td>
                                                    <td>{rateCC.rate}</td>
                                                    <td>{rateCC.dateRate}</td>
                                                    <td>{rateCC.dateShare}</td>
                                                    <td>{selectedNoteCC.id}</td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                <div className='flex gap-2 mt-2'>
                                    <button className="btn btn-outline btn-info btn-sm">Nowa</button>
                                    <button className="btn btn-outline btn-info btn-sm">Podgląd</button>
                                    <button className="btn btn-outline btn-info btn-sm">Udost. Rozmowy</button>
                                    <button className="btn btn-outline btn-info btn-sm">Dołącz rozłącz</button>
                                    <button className="btn btn-outline btn-info btn-sm">Aktualizuj</button>
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
                                            <th>Ocena</th>
                                            <th>Data Oceny</th>
                                            <th>Data udost.</th>
                                            <th>Coaching id.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* row 1 */}
                                        <tr className="bg-base-200">
                                            <td>Cy Ganderton</td>
                                            <td>Quality Control Specialist</td>
                                            <td>Blue</td>
                                        </tr>
                                        {/* row 2 */}
                                        <tr>
                                            <td>Hart Hagerty</td>
                                            <td>Desktop Support Technician</td>
                                            <td>Purple</td>
                                        </tr>
                                        {/* row 3 */}
                                        <tr>
                                            <td>Brice Swyre</td>
                                            <td>Tax Accountant</td>
                                            <td>Red</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='flex gap-2 mt-2'>
                                    <button className="btn btn-outline btn-info btn-sm">Nowa</button>
                                    <button className="btn btn-outline btn-info btn-sm">Podgląd</button>
                                    <button className="btn btn-outline btn-info btn-sm">Udost. maile</button>
                                    <button className="btn btn-outline btn-info btn-sm">Dołącz rozłącz</button>
                                    <button className="btn btn-outline btn-info btn-sm">Aktualizuj</button>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default NoteMain;

