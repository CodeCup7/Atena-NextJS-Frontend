'use client'
import { getActiveUser } from '@/app/auth';
import { StatusLabels, Status_Note } from '@/app/classes/enums';
import { FiltrNoteCC } from '@/app/classes/filtrNoteCC';
import { Role, User } from '@/app/classes/user';
import { createSearchCriteriaByFiltrNoteCC } from '@/app/factory/factory_searchCriteria';
import { updateUserList } from '@/app/factory/factory_user';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const Search = () => {

  const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek
  const [isPermit, setIsPermit] = useState(false);
  const [activeUser, setActiveUser] = useState(new User());
  const [userList, setUserList] = useState<Array<User>>([]);

  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [agent, setAgent] = useState(0);

  const [filtr, setFiltr] = useState(new FiltrNoteCC())

  useEffect(() => {

    async function fetchData() {
      try {
        const users = await updateUserList();
        const user = await getActiveUser();
        setActiveUser(user);
        setUserList(users);

        const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
        setIsPermit(isPermit);

      } catch (error) {
        console.log('Błąd useEffect', error);
      }
    }
    fetchData();
  }, []);




  function clearCoaching_Click() {

  }

  return (
    <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
      <ToastContainer />
      <div className='flex items-center justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <h1 className='text-info text-3xl text-center ml-3'> Wyszukiwarka</h1>
      </div>
      <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

      <div className='flex justify-center items-center w-full'>
        <div className='flex flex-col col-span-8 mt-10 '>
          <div className="tabs justify-center items-center w-full">

            <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 1 ? " tab-active " : "")
            }
              onClick={e => {
                e.preventDefault(); setOpenTab(1);
              }}
              data-toggle="tab" href="#link1" role="tablist" > Coachingi </a>

            <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
            }
              onClick={e => {
                e.preventDefault(); setOpenTab(2);
              }}
              data-toggle="tab" href="#link2" role="tablist" > Rozmowy </a>

            <a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 3 ? " tab-active " : "")
            }
              onClick={e => {
                e.preventDefault(); setOpenTab(3);
              }}
              data-toggle="tab" href="#link3" role="tablist" > E-Mail </a>
          </div>

          {/* <!-- Tab content --> */}
          <div className=" flex flex-col min-w-0 break-words w-full mb-6 tab-content tab-space">
            {/* NoteCC TAB */}
            <div className={openTab === 1 ? "block" : "hidden"} id="link1">
              <div className='flex flex-col items-center justify-center '>
                <div className='flex flex-col lg:flex-row '>
                  <div className='flex flex-col items-center justify-center'>
                    {/* Szukanie po miesiącu */}
                    <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'> Dotyczy miesiąca</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                      <div className='flex mt-2'>
                        <div className="flex flex-col m-2">
                          <span className="label-text">Data od:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            defaultValue={filtr.appliesDateStart}
                            onChange={e => { filtr.appliesDateStart = e.currentTarget.value + '-01' }}
                            type="month"
                          />
                        </div>
                        <div className="flex flex-col mr-2 ml-4 m-2">
                          <span className="label-text">Data do:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            defaultValue={filtr.appliesDateEnd}
                            onChange={e => {
                              const [year, month] = e.currentTarget.value.split("-");
                              const firstDayOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
                              const firstDayOfNextMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1);
                              const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
                              const lastDay = lastDayOfMonth.getDate();
                              filtr.appliesDateEnd = e.currentTarget.value + '-' + lastDay
                            }}
                            type="month"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Szukanie po dacie przeprowadzenia */}
                    <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'>Data przeprowadzenia</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                      <div className='flex mt-2'>
                        <div className="flex flex-col m-2">
                          <span className="label-text">Data od:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            defaultValue={filtr.coachDateStart}
                            onChange={e => { filtr.coachDateStart = e.currentTarget.value }}
                            type="date"
                          />
                        </div>
                        <div className="flex flex-col mr-2 ml-4 m-2">
                          <span className="label-text">Data do:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            defaultValue={filtr.coachDateEnd}
                            onChange={e => { filtr.coachDateEnd = e.currentTarget.value }}
                            type="date"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className='flex flex-col items-center justify-center h-full lg:ml-10 w-full'>
                    {/* Zalecenia */}
                    <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'>Zalecenia (fraza)</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                      <input
                        className="input input-bordered input-info max-w-md gap-y-2 w-72 m-2"
                        defaultValue={filtr.zalecenia}
                        onChange={e => filtr.zalecenia = e.target.value}
                        type="text" />
                    </div>
                    {/* Odwołanie */}
                    <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'>Odwołanie (fraza)</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                      <input
                        className="input input-bordered input-info max-w-md gap-y-2 w-72 m-2"
                        defaultValue={filtr.odwolanie}
                        onChange={e => filtr.odwolanie = e.target.value}
                        type="text" />
                    </div>

                    {/* ID, Status */}
                    <div className='grid grid-cols-2 grid-rows-2 border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <div className='flex flex-col items-center justify-start'>
                        <h1 className='text-info text-lg text-center ml-3'>ID</h1>
                        <hr className="w-20 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                      </div>
                      <div className='flex flex-col items-center justify-start'>
                        <h1 className='text-info text-lg text-center ml-3'>Stauts</h1>
                        <hr className="w-20 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                      </div>

                      <div className='flex flex-col items-center justify-start'>
                        <input
                          className="input input-bordered input-info max-w-md w-24 m-2"
                          defaultValue={filtr.id}
                          onChange={e => filtr.id = parseInt(e.target.value)}
                          min='0'
                          step='1'
                          type="number" />
                      </div>
                      <div className='flex flex-col items-center justify-start'>
                        <select className="select select-bordered select-sm w-fit max-w-xs h-14"
                          defaultValue={'DEFAULT'}>
                          <option value="DEFAULT">Wszystkie</option>
                          <option> {StatusLabels[Status_Note.NO_START]} </option>
                          <option> {StatusLabels[Status_Note.CLOSE]} </option>
                          <option> {StatusLabels[Status_Note.CLOSE_WITHOUT]} </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Przyciski */}
                <div>
                  <hr className="w-full h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                  <div className='flex gap-2 mt-5'>

                    <Link
                      className="flex items-center group"
                      href={{
                        pathname: "/router/common/browser",
                        query: { fromSearch: true }
                      }}>
                      <button onClick={() => {

                        const fetchData = async () => {
                          const noteCCList = await createSearchCriteriaByFiltrNoteCC(filtr);
                          localStorage.setItem('noteCCList_search', JSON.stringify(noteCCList))
                        };

                        fetchData();

                      }} className="btn btn-outline btn-info mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Szukaj coachingów
                      </button>
                    </Link>
                    <button onClick={clearCoaching_Click} className="btn btn-outline btn-info mx-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Wyczyść filtr
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* RateCC TAB */}
            <div className={openTab === 2 ? "block" : "hidden"} id="link1">
              <div className='flex items-center justify-center'>
                qqqq
              </div>
            </div>
            <div className={openTab === 3 ? "block" : "hidden"} id="link1">
              <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>
                E-Mail
              </div>
            </div>
          </div>
        </div>

        {/* <div className='flex flex-col col-span-4 ml-20 mt-2 border-l-2 border-info border-opacity-50 justify-center items-center border-2'>
          <h1 className='text-info text-lg text-center ml-3'> Lista użytkowników</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Imię i nazwisko</th>
              </tr>
            </thead>
            <tbody className="table-auto overflow-scroll w-full">
              {userList.map((user, index) => {
                return (
                  <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointe">
                    <td>{user.nameUser}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div> */}
      </div >
    </div >
  )
}
export default Search;
