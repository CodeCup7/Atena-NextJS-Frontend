'use client'
import { api_QueueList_getAll } from '@/app/api/queue_api';
import { getActiveUser } from '@/app/auth';
import { StatusLabels, Status_Note, TypeLabels, Type_RateCC } from '@/app/classes/enums';
import { FiltrNoteCC } from '@/app/classes/filtrNoteCC';
import { FiltrRateCC } from '@/app/classes/filtrRateCC';
import { Queue } from '@/app/classes/queue';
import { Role, User } from '@/app/classes/user';
import { createSearchCriteriaByFiltrNoteCC, createSearchCriteriaByFiltrRateCC } from '@/app/factory/factory_searchCriteria';
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
  const [queueList, setQueueList] = useState<Array<Queue>>([]);

  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [agent, setAgent] = useState(0);

  const [filtrNoteCC, setFiltrNoteCC] = useState(new FiltrNoteCC())
  const [filtrRateCC, setFiltrRateCC] = useState(new FiltrRateCC())

  useEffect(() => {

    async function fetchData() {
      try {
        const users = await updateUserList();
        const user = await getActiveUser();
        const queues = await api_QueueList_getAll();
        setActiveUser(user);
        setUserList(users);
        setQueueList(queues);

        const isPermit: boolean = user.role === Role.ADMIN_ || user.role === Role.COACH_;
        setIsPermit(isPermit);

      } catch (error) {
        console.log('Błąd useEffect', error);
      }
    }
    fetchData();
  }, []);

  function clearCoaching_Click() {
    setFiltrNoteCC(new FiltrNoteCC())
  }
  function clearRateCC_Click() {
    setFiltrRateCC(new FiltrRateCC())
  }

  const [choiseUser, setChoiseUser] = useState<Array<User>>([]);


  function checkboxUserHandler(user: User) {

    const isSelected = choiseUser.find(r => r.id === user.id)

    if (isSelected) {
        const updatedChoiseUser = choiseUser.filter((r) => r.id !== user.id);
        setChoiseUser(updatedChoiseUser);
    } else {
        setChoiseUser((prevChoiseUser) => [...prevChoiseUser, user]);
    }
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

      <div className='flex justify-center '>

        {/* Tabs Main */}
        <div className='flex flex-col mt-10 '>
          <div className="tabs justify-center items-center ">

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
          <div className=" flex flex-col min-w-0 break-words mb-6 tab-content tab-space">
            {/* NoteCC TAB */}
            <div className={openTab === 1 ? "block" : "hidden"} id="link1">
              <div className='flex flex-col items-center justify-center mt-2'>
                <div className='flex flex-col 2xl:flex-row '>
                  <div className='flex flex-col items-center justify-center'>
                    {/* Szukanie po miesiącu */}
                    <div className='flex flex-col border-2 border-info border-opa mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'> Dotyczy miesiąca</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                      <div className='flex mt-2'>
                        <div className="flex flex-col m-2">
                          <span className="label-text">Data od:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            value={filtrNoteCC.appliesDateStart}
                            onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, appliesDateStart: e.target.value }) }}
                            type="month"
                          />
                        </div>
                        <div className="flex flex-col mr-2 ml-4 m-2">
                          <span className="label-text">Data do:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            value={filtrNoteCC.appliesDateEnd}
                            onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, appliesDateEnd: e.target.value }) }}
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
                            value={filtrNoteCC.coachDateStart}
                            onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, coachDateStart: e.target.value }) }}
                            type="date"
                          />
                        </div>
                        <div className="flex flex-col mr-2 ml-4 m-2">
                          <span className="label-text">Data do:</span>
                          <input
                            className="input input-bordered w-full max-w-xs"
                            value={filtrNoteCC.coachDateEnd}
                            onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, coachDateEnd: e.target.value }) }}
                            type="date"
                          />
                        </div>
                      </div>
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

                      <div className='flex flex-col items-center justify-start mb-4'>
                        <input
                          className="input input-bordered input-info max-w-md w-24 m-2"
                          value={filtrNoteCC.id}
                          onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, id: parseInt(e.target.value) }) }}
                          min='0'
                          step='1'
                          type="number" />
                      </div>
                      <div className='flex flex-col items-center justify-start mb-4'>
                        <select className="select select-bordered select-sm w-fit max-w-xs h-14"
                          value={Status_Note.ALL}
                          onChange={e => {
                            setFiltrNoteCC({ ...filtrNoteCC, status: Object.values(Status_Note).find(status => status === e.target.value) as Status_Note || Status_Note.NO_START });
                          }}>
                          <option value={Status_Note.ALL}>{StatusLabels[Status_Note.ALL]}</option>
                          {/* <option value={Status_Note.NO_START}>{StatusLabels[Status_Note.NO_START]}</option> */}
                          <option value={Status_Note.CLOSE}>{StatusLabels[Status_Note.CLOSE]}</option>
                          <option value={Status_Note.CLOSE_WITHOUT}>{StatusLabels[Status_Note.CLOSE_WITHOUT]}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-center justify-center h-full 2xl:ml-10 w-full'>
                    {/* Zalecenia */}
                    <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'>Zalecenia (fraza)</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                      <input
                        className="input input-bordered input-info max-w-md gap-y-2 w-72 m-2"
                        value={filtrNoteCC.zalecenia}
                        onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, zalecenia: e.target.value }) }}
                        type="text" />
                    </div>
                    {/* Odwołanie */}
                    <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                      <h1 className='text-info text-lg text-center ml-3'>Odwołanie (fraza)</h1>
                      <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                      <input
                        className="input input-bordered input-info max-w-md gap-y-2 w-72 m-2"
                        value={filtrNoteCC.odwolanie}
                        onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, odwolanie: e.target.value }) }}
                        type="text" />
                      <div className="flex">
                        <label className="label cursor-pointer">
                          <input type="checkbox" className="checkbox checkbox-info mr-2"
                            checked={filtrNoteCC.allOdwolania}
                            onChange={e => { setFiltrNoteCC({ ...filtrNoteCC, allOdwolania: e.target.checked }) }} />
                          <span className="label-text"> Wszystkie odwołania</span>
                        </label>
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
                        const criteriaList = createSearchCriteriaByFiltrNoteCC(filtrNoteCC);
                        localStorage.setItem('noteCCList_criteriaList', JSON.stringify(criteriaList));
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
                <div className='flex flex-col items-center justify-center mt-2'>
                  <div className='flex flex-col 2xl:flex-row '>
                    <div className='flex flex-col items-center justify-center'>
                      {/* Szukanie po miesiącu */}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Data wystawienia oceny</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex mt-2'>
                          <div className="flex flex-col m-2">
                            <span className="label-text">Data od:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrRateCC.dateRateStart}
                              onChange={e => { setFiltrRateCC({ ...filtrRateCC, dateRateStart: e.target.value }) }}
                              type="date"
                            />
                          </div>
                          <div className="flex flex-col mr-2 ml-4 m-2">
                            <span className="label-text">Data do:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrRateCC.dateRateEnd}
                              onChange={e => { setFiltrRateCC({ ...filtrRateCC, dateRateEnd: e.target.value }) }}
                              type="date"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Data rozmowy */}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Data rozmowy</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex mt-2'>
                          <div className="flex flex-col m-2">
                            <span className="label-text">Data od:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrRateCC.dateCallStart}
                              onChange={e => { setFiltrRateCC({ ...filtrRateCC, dateCallStart: e.target.value }) }}
                              type="date"
                            />
                          </div>
                          <div className="flex flex-col mr-2 ml-4 m-2">
                            <span className="label-text">Data do:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrRateCC.dateCallEnd}
                              onChange={e => { setFiltrRateCC({ ...filtrRateCC, dateCallEnd: e.target.value }) }}
                              type="date"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Zakres ocen*/}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Zakres ocen</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex items-center justify-start mb-4 gap-4'>
                          <div className='flex flex-col'>
                            <h1 className='text-sm text-center'>Minimalna ocena</h1>
                            <input
                              className="input input-bordered input-info max-w-md w-24 m-2"
                              value={filtrRateCC.rateStart}
                              onChange={e => { setFiltrRateCC({ ...filtrRateCC, rateStart: e.target.value }) }}
                              min='0'
                              step='1'
                              type="number" />
                          </div>
                          <hr className="w-2 h-1 border-0 rounded bg-white"></hr>
                          <div className='flex flex-col'>
                            <h1 className='text-sm text-center'>Maksymalna ocena</h1>
                            <input
                              className="input input-bordered input-info max-w-md w-24 m-2"
                              value={filtrRateCC.rateEnd}
                              onChange={e => { setFiltrRateCC({ ...filtrRateCC, rateEnd: e.target.value }) }}
                              min='0'
                              step='1'
                              type="number" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col items-center justify-center h-full 2xl:ml-10 w-full gap-2'>
                      <div className='flex items-center justify-center h-full w-full gap-2'>
                        {/* ID */}
                        <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center w-full'>
                          <h1 className='text-info text-lg text-center ml-3'>Id</h1>
                          <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                          <input
                            className="input input-bordered input-info max-w-md w-24 m-2"
                            value={filtrRateCC.id}
                            onChange={e => { setFiltrRateCC({ ...filtrRateCC, id: parseInt(e.target.value) }) }}
                            min='0'
                            step='1'
                            type="number" />
                        </div>
                        {/* Typ Oceny */}
                        <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center w-full'>
                          <h1 className='text-info text-lg text-center ml-3'>ID Rozmowy</h1>
                          <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>
                          <input
                            className="input input-bordered input-info max-w-md w-24 m-2"
                            value={filtrRateCC.idCall}
                            onChange={e => { setFiltrRateCC({ ...filtrRateCC, idCall: e.target.value }) }}
                            type="text" />
                        </div>
                      </div>

                      <div className='flex items-center justify-center h-full  w-full gap-2'>
                        {/* Typ rozmowy */}
                        <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center w-full'>
                          <h1 className='text-info text-lg text-center ml-3'>Typ rozmowy</h1>
                          <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                          <div className='flex flex-col items-center justify-start mb-4'>
                            <select
                              className="select select-bordered select-sm w-fit max-w-xs h-14"
                              value={filtrRateCC.typeRate}
                              onChange={e => {
                                setFiltrRateCC({
                                  ...filtrRateCC,
                                  typeRate: Object.values(Type_RateCC).find(typeRate => typeRate === e.target.value) as Type_RateCC || Type_RateCC.ALL
                                });
                              }}
                            >
                              <option value={Type_RateCC.ALL}>{TypeLabels[Type_RateCC.ALL]}</option>
                              <option value={Type_RateCC.RATTING_}>{TypeLabels[Type_RateCC.RATTING_]}</option>
                              <option value={Type_RateCC.MYSTERY_}>{TypeLabels[Type_RateCC.MYSTERY_]}</option>
                              <option value={Type_RateCC.CURRENT_}>{TypeLabels[Type_RateCC.CURRENT_]}</option>
                            </select>
                          </div>
                        </div>
                        {/* Kolejka */}
                        <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center w-full'>
                          <h1 className='text-info text-lg text-center ml-3'>Kolejka</h1>
                          <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                          <div className='flex flex-col items-center justify-start mb-4'>
                            <select className="select select-bordered select-sm w-fit max-w-lg h-14"
                              value={filtrRateCC.queueId}
                              onChange={e => {
                                setFiltrRateCC({ ...filtrRateCC, queueId: e.target.value })
                              }}>
                              <option value={0} disabled>Wybierz kolejkę ...</option>
                              {queueList.filter(queue => queue.available === true).map((queue) => (
                                <option key={queue.id} value={queue.id}>{queue.nameQueue}</option>
                              ))}
                            </select>
                          </div>
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
                          const criteriaList = createSearchCriteriaByFiltrRateCC(filtrRateCC);
                          localStorage.setItem('rateCCList_criteriaList', JSON.stringify(criteriaList));
                        }} className="btn btn-outline btn-info mx-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Szukaj rozmów
                        </button>
                      </Link>
                      <button onClick={clearRateCC_Click} className="btn btn-outline btn-info mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        Wyczyść filtr
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={openTab === 3 ? "block" : "hidden"} id="link1">
              <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 2xl:grid-rows-1 items-center justify-center border'>
                E-Mail
              </div>
            </div>
          </div>
        </div>

        {/* User Tabel */}
        <div className='flex flex-col sm:ml-2 md:ml-10 mt-2 border-info border-opacity-50 border-2 items-center '>
          <h1 className='text-info text-lg text-center ml-3 '> Lista agentów</h1>
          <div className="2xl:max-h-[650px] overflow-y-auto w-fit">
            <table className="table">
              <thead>
                <tr>
                  <th className='w-32' >Zaznacz</th>
                  <th className='w-full'>Imię i nazwisko</th>
                </tr>
              </thead>
              <tbody className="table-auto overflow-scroll w-full">
                {userList.filter(user => user.role === Role.AGENT_).map((user, index) => {
                  return (
                    <tr className="hover:bg-base-300  hover:text-white cursor-pointe"
                      key={index}
                      onClick={() => {
                        checkboxUserHandler(user) // Obsługa zaznaczenia checkboxa
                        filtrNoteCC.userCol = choiseUser;
                        filtrRateCC.userCol = choiseUser;
                      }}>
                      <td>
                        <input type="checkbox" className="checkbox checkbox-info"
                          checked={choiseUser.some((r) => r.id == user.id)}
                          onChange={() => { }}
                        />
                      </td>
                      <td>{user.nameUser}</td>
                    </tr>)
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </div >
  )
}
export default Search;
