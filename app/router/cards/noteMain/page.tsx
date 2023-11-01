'use client'
import React from 'react'
import Link from 'next/link'
import { Status_Note } from '@/app/classes/enums';
import { NoteCC } from '@/app/classes/noteCC';
import { CreateNewEmptyNoteCC, Get_NoteList_With_NoStartNote } from '@/app/factory/factory_noteCC';
import { RateCC } from '@/app/classes/rateCC';

export const page = () => {

    const [dateValue, setDateValue] = React.useState('');
    const [openTab, setOpenTab] = React.useState(1);
    const [noteList, setNoteList] = React.useState<Array<NoteCC>>([]);
    const [selectedNoteCC, setSelectedNoteCC] = React.useState(new NoteCC);
    const [selectedRateCC, setSelectedRateCC] = React.useState(new RateCC);

    function getCoaching() {

        if (dateValue !== null && dateValue !== undefined && dateValue !== "") {
            setNoteList(Get_NoteList_With_NoStartNote([], dateValue));
            setSelectedNoteCC(CreateNewEmptyNoteCC);
        }
    }

    const handleTableNoteCCRowClick = (noteCC: NoteCC) => {
        setSelectedNoteCC(noteCC);
    };

    const handleTableRateCCRowClick = (rateCC: RateCC) => {
        setSelectedRateCC(rateCC);
    };

    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >

            <div className='flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-info w-12 h-12">
                    <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <h1 className='text-info text-3xl text-center ml-3'> Menu monitoringu</h1>
            </div>
            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            {/* Data */}
            <div className='flex flex-col items-center justify-center mt-1'>
                <div className='flex mt-5'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 mx-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                    <input value={dateValue} onChange={e => { setDateValue(e.currentTarget.value); }} type="month" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    <button onClick={getCoaching} className="btn btn-outline btn-info mx-2">
                        Pobierz dane
                    </button>
                </div>
            </div>

            {/* Coachingi */}
            <div className='flex flex-col xl:flex-row p-2'>

                <div className="overflow-x-auto mr-6 mt-6">
                    <div className='flex items-center justify-start'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-info w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        <h1 className='text-info text-2xl text-center ml-3'> Coachingi</h1>
                    </div>
                    <table className="table min-w-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>
                                    <select className="select select-bordered select-sm w-full max-w-xs">
                                        <option disabled selected>Agent</option>
                                        {noteList.map(({ $agent }) => {
                                            return (
                                                <option>{$agent.$nameUser}</option>
                                            )
                                        })}
                                    </select>
                                </th>
                                <th>
                                    <select className="select select-bordered select-sm w-fit max-w-xs">
                                        <option disabled selected>Status</option>
                                        <option> {Status_Note.NO_START_} </option>
                                        <option> {Status_Note.CLOSE__} </option>
                                        <option> {Status_Note.CLOSE_WITHOUT_} </option>

                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-auto overflow-scroll w-full" >
                            {noteList.map((noteCC) => { //{noteList.map(({$id}) => {
                                return (
                                    <tr className="hover:bg-base-200 cursor-pointer" onClick={() => handleTableNoteCCRowClick(noteCC)}>
                                        <td>{noteCC.$agent.$nameUser}</td>
                                        <td>{Status_Note.NO_START_}</td>
                                        <td>{noteCC.$appliesDate}</td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                    <div className='flex gap-2 mt-2'>
                        <Link className="group link link-accent link-hover text-lg" href="/router/cards/noteCC">
                            <button className="btn btn-outline btn-info btn-sm">Rozpocznij coaching</button>
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
                        <div className={openTab === 1 ? "block" : "hidden"} id="link1">
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
                                        {selectedNoteCC.$rateCC_Col.map((rateCC) => { //{noteList.map(({$id}) => {
                                            return (
                                                <tr className="hover:bg-base-200 cursor-pointer" onClick={() => handleTableRateCCRowClick(rateCC)}>
                                                    <td>{rateCC.$dateCall}</td>
                                                    <td>{rateCC.$queue.$nameQueue}</td>
                                                    <td>{rateCC.$rate}</td>
                                                    <td>{rateCC.$dateRate}</td>
                                                    <td>{rateCC.$dateShare}</td>
                                                    <td>{selectedNoteCC.$id}</td>
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

export default page;