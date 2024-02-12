'use client'
import { api_QueueList_getAll } from '@/app/api/queue_api';
import { getActiveUser } from '@/app/auth';
import { StatusLabels, Status_Note, TypeLabels, Type_RateCC } from '@/app/classes/enums';
import { FeedbackLabels, Feedback_type } from '@/app/classes/feedback';
import { FiltrFeedback } from '@/app/classes/filtrs/feedback_filtr';
import { FiltrNoteCC } from '@/app/classes/filtrs/noteCC_Filtr';
import { FiltrRateCC } from '@/app/classes/filtrs/rateCC_filtr';
import { FiltrRateM } from '@/app/classes/filtrs/rateM_filtr';
import { FiltrTest } from '@/app/classes/filtrs/test_filtr';
import { Queue } from '@/app/classes/queue';
import { TestLabels, TestPass } from '@/app/classes/test';
import { Role, User } from '@/app/classes/user';
import { createSearchCriteriaByFiltrFeedback, createSearchCriteriaByFiltrNoteCC, createSearchCriteriaByFiltrRateCC, createSearchCriteriaByFiltrRateM, createSearchCriteriaByFiltrTest } from '@/app/factory/factory_searchCriteria';
import { updateUserList } from '@/app/factory/factory_user';
import Link from 'next/link';
import { userInfo } from 'os';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const Search = () => {

  const [openTab, setOpenTab] = React.useState(1); // Kontrola zakładek
  const [isPermit, setIsPermit] = useState(false);
  const [activeUser, setActiveUser] = useState(new User());
  const [userList, setUserList] = useState<Array<User>>([]);
  const [queueList, setQueueList] = useState<Array<Queue>>([]);

  const [agentId, setAgentId] = useState(0);

  const [filtrNoteCC, setFiltrNoteCC] = useState(new FiltrNoteCC())
  const [filtrRateCC, setFiltrRateCC] = useState(new FiltrRateCC())
  const [filtrRateM, setFiltrRateM] = useState(new FiltrRateM())
  const [filtrTest, setFiltrTest] = useState(new FiltrTest())
  const [filtrFeedback, setFiltrFeedback] = useState(new FiltrFeedback())

  const [choiseUsers, setSelectedUsers] = useState<Array<User>>([]);

  useEffect(() => {

    async function fetchData() {
      try {
        const users = await updateUserList();
        const user = await getActiveUser();
        const queues = await api_QueueList_getAll();
        setActiveUser(user);
        setUserList(users);
        setQueueList(queues);

        // Walidacja roli. Możliwość pobrania tylko swoich danych przez agenta
        if (user.role === Role.AGENT_) {
          setAgentId(user.id);
          handleCheckboxChange(user);
        }
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
  function clearRateM_Click() {
    setFiltrRateM(new FiltrRateM())
  }
  function clearTest_Click() {
    setFiltrRateM(new FiltrRateM())
  }
  function clearFeedback_Click() {
    setFiltrRateM(new FiltrRateM())
  }

  const handleCheckboxChange = (selectUser: User) => {
    const isSelected = choiseUsers.some(user => user.id === selectUser.id)

    if (isSelected) {
      setSelectedUsers(choiseUsers.filter((user) => user !== selectUser));
    } else {
      setSelectedUsers([...choiseUsers, selectUser]);
    }
  }

  useEffect(() => {
    setFiltrNoteCC((prevFiltrNoteCC) => ({ ...prevFiltrNoteCC, userCol: choiseUsers }));
    setFiltrRateCC((prevFiltrRateCC) => ({ ...prevFiltrRateCC, userCol: choiseUsers }));
    setFiltrRateM((prevFiltrRateM) => ({ ...prevFiltrRateM, userCol: choiseUsers }));
    setFiltrTest((prevFiltrList) => ({ ...prevFiltrList, userCol: choiseUsers }));
    setFiltrFeedback((prevFiltrFB) => ({ ...prevFiltrFB, userCol: choiseUsers }));
  }, [choiseUsers]);

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
        <div className="tabs justify-center items-center w-full">

<a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 1 ? " tab-active " : "")
}
    onClick={e => {
        e.preventDefault(); setOpenTab(1);
    }}
    data-toggle="tab" href="#link1" role="tablist" >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
    <p className='ml-2'>Coachingi</p>
</a>

<a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 2 ? " tab-active " : "")
}
    onClick={e => {
        e.preventDefault(); setOpenTab(2);
    }}
    data-toggle="tab" href="#link2" role="tablist" >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
    </svg>
    <p className='ml-2'>Rozmowy</p>
</a>

<a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 3 ? " tab-active " : "")
}
    onClick={e => {
        e.preventDefault(); setOpenTab(3);
    }}
    data-toggle="tab" href="#link3" role="tablist" >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>


    <p className='ml-2'>Maile</p>
</a>

<a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 4 ? " tab-active " : "")
}
    onClick={e => {
        e.preventDefault(); setOpenTab(4);
    }}
    data-toggle="tab" href="#link4" role="tablist" >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>

    <p className='ml-2'>Testy</p>
</a>

<a className={"tab tab-bordered sm:tab-sm md:tab-lg text-xs" + (openTab === 5 ? " tab-active " : "")
}
    onClick={e => {
        e.preventDefault(); setOpenTab(5);
    }}
    data-toggle="tab" href="#link5" role="tablist" >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
    </svg>
    <p className='mx-2'>Pochwały i Skargi</p>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
    </svg>
</a>
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
                          value={filtrNoteCC.status}
                          onChange={e => {
                            setFiltrNoteCC({ ...filtrNoteCC, status: Object.values(Status_Note).find(status => status === e.target.value) as Status_Note || Status_Note.NO_START_ });
                          }}>
                          <option value={Status_Note.ALL_}>{StatusLabels[Status_Note.ALL_]}</option>
                          {/* <option value={Status_Note.NO_START}>{StatusLabels[Status_Note.NO_START]}</option> */}
                          <option value={Status_Note.CLOSE_}>{StatusLabels[Status_Note.CLOSE_]}</option>
                          <option value={Status_Note.CLOSE_WITHOUT_}>{StatusLabels[Status_Note.CLOSE_WITHOUT_]}</option>
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
                              disabled
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
                              disabled
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
                        {/* ID Rozmowy */}
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
                                  typeRate: Object.values(Type_RateCC).find(typeRate => typeRate === e.target.value) as Type_RateCC || Type_RateCC.ALL_
                                });
                              }}
                            >
                              <option value={Type_RateCC.ALL_}>{TypeLabels[Type_RateCC.ALL_]}</option>
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
            {/* RateM TAB */}
            <div className={openTab === 3 ? "block" : "hidden"} id="link1">
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
                              value={filtrRateM.dateRateStart}
                              onChange={e => { setFiltrRateM({ ...filtrRateM, dateRateStart: e.target.value }) }}
                              type="date"
                            />
                          </div>
                          <div className="flex flex-col mr-2 ml-4 m-2">
                            <span className="label-text">Data do:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrRateM.dateRateEnd}
                              onChange={e => { setFiltrRateM({ ...filtrRateM, dateRateEnd: e.target.value }) }}
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
                              value={filtrRateM.rateStart}
                              onChange={e => { setFiltrRateM({ ...filtrRateM, rateStart: e.target.value }) }}
                              min='0'
                              step='1'
                              type="number" />
                          </div>
                          <hr className="w-2 h-1 border-0 rounded bg-white"></hr>
                          <div className='flex flex-col'>
                            <h1 className='text-sm text-center'>Maksymalna ocena</h1>
                            <input
                              className="input input-bordered input-info max-w-md w-24 m-2"
                              value={filtrRateM.rateEnd}
                              onChange={e => { setFiltrRateM({ ...filtrRateM, rateEnd: e.target.value }) }}
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
                            value={filtrRateM.id}
                            onChange={e => { setFiltrRateM({ ...filtrRateM, id: parseInt(e.target.value) }) }}
                            min='0'
                            step='1'
                            type="number" />
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
                          const criteriaList = createSearchCriteriaByFiltrRateM(filtrRateM);
                          localStorage.setItem('rateMList_criteriaList', JSON.stringify(criteriaList));
                        }} className="btn btn-outline btn-info mx-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Szukaj maili
                        </button>
                      </Link>
                      <button onClick={clearRateM_Click} className="btn btn-outline btn-info mx-2">
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
            {/* Test TAB */}
            <div className={openTab === 4 ? "block" : "hidden"} id="link1">
              <div className='flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center mt-2'>
                  <div className='flex flex-col 2xl:flex-row '>
                    <div className='flex flex-col items-center justify-center'>
                      {/* Szukanie po miesiącu */}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Data testu</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex mt-2'>
                          <div className="flex flex-col m-2">
                            <span className="label-text">Data od:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrTest.dateTestStart}
                              onChange={e => { setFiltrTest({ ...filtrTest, dateTestStart: e.target.value }) }}
                              type="date"
                            />
                          </div>
                          <div className="flex flex-col mr-2 ml-4 m-2">
                            <span className="label-text">Data do:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrTest.dateTestEnd}
                              onChange={e => { setFiltrTest({ ...filtrTest, dateTestEnd: e.target.value }) }}
                              type="date"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Test PASS */}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Czy zdany?</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex items-center justify-start mb-4 gap-4'>

                          <select className="select select-bordered select-sm w-fit max-w-xs h-14"
                            value={TestPass.ALL_}
                            onChange={e => {
                              setFiltrTest({ ...filtrTest, testPass: Object.values(TestPass).find(testPass => testPass === e.target.value) as TestPass || TestPass.ALL_ });
                            }}>
                            <option value={TestPass.ALL_}>{TestLabels[TestPass.ALL_]}</option>
                            <option value={TestPass.PASS_}>{TestLabels[TestPass.PASS_]}</option>
                            <option value={TestPass.NO_PASS_}>{TestLabels[TestPass.NO_PASS_]}</option>
                            <option value={TestPass.NO_REQUIRED_}>{TestLabels[TestPass.NO_REQUIRED_]}</option>
                          </select>
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
                            value={filtrTest.id}
                            onChange={e => { setFiltrTest({ ...filtrTest, id: parseInt(e.target.value) }) }}
                            min='0'
                            step='1'
                            type="number" />
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
                          const criteriaList = createSearchCriteriaByFiltrTest(filtrTest);
                          localStorage.setItem('testList_criteriaList', JSON.stringify(criteriaList));
                        }} className="btn btn-outline btn-info mx-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Szukaj testów
                        </button>
                      </Link>
                      <button onClick={clearTest_Click} className="btn btn-outline btn-info mx-2">
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
            {/* Feedback TAB */}
            <div className={openTab === 5 ? "block" : "hidden"} id="link1">
              <div className='flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center mt-2'>
                  <div className='flex flex-col 2xl:flex-row '>
                    <div className='flex flex-col items-center justify-center'>
                      {/* Szukanie po miesiącu */}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Data feedbacku</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex mt-2'>
                          <div className="flex flex-col m-2">
                            <span className="label-text">Data od:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrFeedback.dateFeedbackStart}
                              onChange={e => { setFiltrFeedback({ ...filtrFeedback, dateFeedbackStart: e.target.value }) }}
                              type="date"
                            />
                          </div>
                          <div className="flex flex-col mr-2 ml-4 m-2">
                            <span className="label-text">Data do:</span>
                            <input
                              className="input input-bordered w-full max-w-xs"
                              value={filtrFeedback.dateFeedbackEnd}
                              onChange={e => { setFiltrFeedback({ ...filtrFeedback, dateFeedbackEnd: e.target.value }) }}
                              type="date"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Feedback Type */}
                      <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2 w-full'>
                        <h1 className='text-info text-lg text-center ml-3'>Pochwała czy skarga ?</h1>
                        <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                        <div className='flex items-center justify-start mb-4 gap-4'>

                          <select className="select select-bordered select-sm w-fit max-w-xs h-14"
                            value={Feedback_type.ALL_}
                            onChange={e => {
                              setFiltrFeedback({ ...filtrFeedback, feedback: Object.values(Feedback_type).find(testPass => testPass === e.target.value) as Feedback_type || Feedback_type.ALL_ });
                            }}>
                            <option value={Feedback_type.ALL_}>{FeedbackLabels[Feedback_type.ALL_]}</option>
                            <option value={Feedback_type.POSITIVE_}>{FeedbackLabels[Feedback_type.POSITIVE_]}</option>
                            <option value={Feedback_type.NEGATIVE_}>{FeedbackLabels[Feedback_type.NEGATIVE_]}</option>

                          </select>
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
                            value={filtrFeedback.id}
                            onChange={e => { setFiltrFeedback({ ...filtrFeedback, id: parseInt(e.target.value) }) }}
                            min='0'
                            step='1'
                            type="number" />
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
                          const criteriaList = createSearchCriteriaByFiltrFeedback(filtrFeedback);
                          localStorage.setItem('feedbackList_criteriaList', JSON.stringify(criteriaList));
                        }} className="btn btn-outline btn-info mx-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Szukaj testów
                        </button>
                      </Link>
                      <button onClick={clearFeedback_Click} className="btn btn-outline btn-info mx-2">
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
                        handleCheckboxChange(user)
                      }}>
                      <td>
                        <input
                          type="checkbox"
                          disabled={!isPermit}
                          className="checkbox checkbox-info"
                          onChange={() => { }}
                          checked={choiseUsers.some(userInList => userInList.id === user.id)}
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
