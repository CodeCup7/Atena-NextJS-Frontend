'use client'
import { Rate_Mode, StatusLabels } from '@/app/classes/enums';
import { CreateNewEmptyNoteCC } from '@/app/factory/factory_noteCC';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Arced } from '../../components/chart/rateCC_chart';

const NoteCC_Page = () => {

    const [noteCC, setNoteCC] = useState(CreateNewEmptyNoteCC());
    const [prewievMode, setPreviewMode] = useState(false);

    const [noteTab, setOpenNoteTab] = React.useState(1);
    const [rateTab, setOpenRateTab] = React.useState(1);



    return (
        <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
            <ToastContainer />

            {/* Nagłówek */}
            <div className='grid grid-cols-12'>
                <div className="col-span-2 navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <button className="btn btn-outline btn-info btn-sm">Zatwierdź</button>
                            <button className="btn btn-outline btn-info btn-sm">Zamknij BEZ</button>
                            <button className="btn btn-outline btn-info btn-sm">Włącz edytowanie</button>
                            <button className="btn btn-outline btn-info btn-sm">Export do xls</button>
                            <button className="btn btn-outline btn-info btn-sm">Export do mail</button>
                        </ul>
                    </div>
                </div>
                <div className="col-span-2">
                    <p className={`justify-center  {rateCC.mode === Rate_Mode.PREVIEW_ as Rate_Mode ? 'text-yellow-600' : rateCC.mode === Rate_Mode.NEW_ as Rate_Mode ? 'text-green-500' : 'text-red-700'}`}>Tryb: {noteCC.mode}</p>
                </div>
                <div className="col-span-4">
                    <h1 className='text-info text-3xl text-center justify-center'># Karta Coucha</h1>
                </div>
                <div className='col-span-4'>
                    <p className='text-right mr-2'>id: {noteCC.id}</p>
                </div>
            </div>

            <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

            <div className='flex sm:flex-col md:flex-row mt-5'>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2 items-center justify-center'>
                        <div>
                            <h1 className='text-center text-4xl'>Informacje</h1>
                            <p className='text-center'>{StatusLabels[noteCC.status]}</p>
                        </div>

                        {/* Wykres */}
                        <div className="col-span-12 md:col-span-2 md:row-span-2 flex justify-center items-center">
                            <div className='mt-5'><Arced value={noteCC.getRate()} /></div>
                        </div>

                        <div className='flex md:flex-col items-center justify-center'>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Coaching za miesiąc</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    type="date"
                                    disabled
                                    defaultValue={noteCC.mode != Rate_Mode.NEW_ as Rate_Mode ? noteCC.appliesDate : new Date().toLocaleDateString('en-CA')} />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Data przeprowadzenia coachingu</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    type="date"
                                    disabled={prewievMode}
                                    defaultValue={noteCC.mode != Rate_Mode.NEW_ as Rate_Mode ? noteCC.coachDate : ""}
                                    onChange={e => noteCC.coachDate = e.target.value}
                                />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Coach</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    value={''}
                                    type="text"
                                />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span>Agent</span>
                                </div>
                                <input
                                    className="input input-bordered input-info max-w-md w-72"
                                    value={''}
                                    type="text"
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col ml-10 '>
                    <div className="tabs">

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (noteTab === 1 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenNoteTab(1);
                            }}
                            data-toggle="tab" href="#link1" role="tablist" > Zalecenia </a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (noteTab === 2 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenNoteTab(2);
                            }}
                            data-toggle="tab" href="#link2" role="tablist" > Dashboard</a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (noteTab === 3 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenNoteTab(3);
                            }}
                            data-toggle="tab" href="#link3" role="tablist" > Odwołanie </a>

                    </div>

                    {/* <!-- Tab content --> */}
                    <div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">

                        {/* # Zalecenia TAB */}
                        <div className={noteTab === 1 ? "block" : "hidden"} id="link1">

                            <div className='flex sm:flex-col md:flex-row gap-4'>
                                <div className='flex flex-col mt-2'>
                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span>Zalecenia (Bieżący Coaching)</span>
                                        </div>
                                        <textarea className="textarea textarea-bordered textarea-lg w-full max-w-7x"
                                        />
                                    </label>
                                </div>

                                <div className='flex flex-col mt-2'>
                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span>Zalecenia (Poprzedni Coaching)</span>
                                        </div>
                                        <textarea className="textarea textarea-bordered textarea-lg w-full max-w-7x"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* # Dashboard TAB */}
                        <div className={noteTab === 2 ? "block" : "hidden"} id="link2">

                        </div>

                        {/* # Odwołanie TAB */}
                        <div className={noteTab === 3 ? "block" : "hidden"} id="link3">
                            <textarea className="textarea textarea-bordered" placeholder="Bio"></textarea>
                        </div>

                    </div>

                    <div className="tabs">

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (rateTab === 1 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenRateTab(1);
                            }}
                            data-toggle="tab" href="#link1" role="tablist" > Rozmowy </a>

                        <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (rateTab === 2 ? " tab-active " : "")
                        }
                            onClick={e => {
                                e.preventDefault(); setOpenRateTab(2);
                            }}
                            data-toggle="tab" href="#link2" role="tablist" > Maile</a>

                    </div>

                    {/* <!-- Tab content --> */}
                    <div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">

                        {/* # Rozmowy TAB */}
                        <div className={rateTab === 1 ? "block" : "hidden"} id="link1">
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
                                    <button className="btn btn-outline btn-info btn-sm">Podgląd</button>
                                </div>
                            </div>
                        </div>

                        {/* # Maile TAB */}
                        <div className={rateTab === 2 ? "block" : "hidden"} id="link2">
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
                                    <button className="btn btn-outline btn-info btn-sm">Podgląd</button>
                                </div>
                            </div>
                        </div>


                    </div>





                </div>
            </div>
        </div>
    )
}

export default NoteCC_Page