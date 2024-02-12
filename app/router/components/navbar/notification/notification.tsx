// '==========================================================================================================================================
// '*********************** Notification Component *******************************************************************************************
// '==========================================================================================================================================
'use client'
import { api_noteCC_getById } from '@/app/api/noteCC_api';
import { api_NotificationList_getAll, api_Notification_update } from '@/app/api/notification_api';
import { api_rateCC_getById } from '@/app/api/rateCC_api';
import { api_rateM_getById } from '@/app/api/rateM_api';
import { getActiveUser } from '@/app/auth';
import { FiltrFeedback } from '@/app/classes/filtrs/feedback_filtr';
import { FiltrTest } from '@/app/classes/filtrs/test_filtr';
import { Notification, Notification_Mode, Notification_Type } from '@/app/classes/notification';
import { NoteCC } from '@/app/classes/rates/noteCC';
import { RateCC } from '@/app/classes/rates/rateCC';
import { RateM } from '@/app/classes/rates/rateM';
import { Role, User } from '@/app/classes/user';
import { createSearchCriteriaByFiltrFeedback, createSearchCriteriaByFiltrTest } from '@/app/factory/factory_searchCriteria';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const NotificationComponent = () => {

  const [notiList, setNotiList] = useState<Array<Notification>>([]); // Lista powiadomień
  const [activeUser, setActiveUser] = useState(new User());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getActiveUser();
      setActiveUser(user);

      const list = await api_NotificationList_getAll(user);
      setNotiList(list);
    };

    fetchData();
  }, []);

  async function preview(noti: Notification) {

    close(noti);

    switch (noti.type) {

      case Notification_Type.NOTE_CC_ || Notification_Type.NOTE_APPEALS_: {
        const noteCC: NoteCC = await api_noteCC_getById(noti.previewId)
        localStorage.removeItem('noteCC_new');
        localStorage.setItem('noteCC_prev', JSON.stringify(noteCC))
      }
      case Notification_Type.RATE_CC_: {
        const rateCC: RateCC = await api_rateCC_getById(noti.previewId)
        localStorage.removeItem('rateCC_prev');
        localStorage.setItem('rateCC_prev', JSON.stringify(rateCC));
      }
      case Notification_Type.RATE_CC_C: {
        const rateCC: RateCC = await api_rateCC_getById(noti.previewId)
        localStorage.removeItem('rateCC_prev');
        localStorage.setItem('rateCC_prev', JSON.stringify(rateCC));
      }
      case Notification_Type.RATE_CC_M_: {
        const rateCC: RateCC = await api_rateCC_getById(noti.previewId)
        localStorage.removeItem('rateCC_prev');
        localStorage.setItem('rateCC_prev', JSON.stringify(rateCC));
      }
      case Notification_Type.RATE_M_: {
        const rateM: RateM = await api_rateM_getById(noti.previewId)
        localStorage.removeItem('rateM_prev');
        localStorage.setItem('rateM_prev', JSON.stringify(rateM));
      }
      case Notification_Type.FEEDBACK_: {
        const filtrFeedback: FiltrFeedback = new FiltrFeedback();
        filtrFeedback.id = noti.previewId;
        const criteriaList = createSearchCriteriaByFiltrFeedback(filtrFeedback);
        localStorage.setItem('feedbackList_criteriaList', JSON.stringify(criteriaList));
      }
      case Notification_Type.TEST_: {
        const filtrTest: FiltrTest = new FiltrTest();
        filtrTest.id = noti.previewId;
        const criteriaList = createSearchCriteriaByFiltrTest(filtrTest);
        localStorage.setItem('testList_criteriaList', JSON.stringify(criteriaList));
      }
    }
  }

  function close(noti: Notification) {

    setIsDropdownOpen(false);

    //Aktualizacja DB
    noti.mode = Notification_Mode.BACK_;
    api_Notification_update(noti).then((foo => {
      if (foo.isOK === true) {
        const newList = notiList.filter(n => n.id !== noti.id);
        setNotiList(newList); //Usunięcie powiadomienia z listy 
      }
    }));

  }

  return (
    <div className={`dropdown dropdown-end  ${isDropdownOpen ? 'dropdown-open' : ''}`}>
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          {notiList.length === 0 ?
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-neutral-content w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-info w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>
          }
          <span className="badge badge-sm indicator-item">{notiList.length}</span>
        </div>
      </div>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <div className="card-body">
          {notiList.length === 0 ? (
            <div role="alert" className="alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Brak powiadomień</span>
            </div>
          ) : (
            notiList.map((noti, index) => (
              <div key={index} className="card w-96 bg-base-100 shadow-xl ">
                <div className="card-body">
                  <h2 className="card-title">
                    Powiadomienie
                    <div className="badge badge-secondary">Nowe</div>
                    <div className="card-actions justify-end">
                      <button className='btn btn-neutral btn-xs' onClick={e => { close(noti) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </h2>
                  <p>{noti.text}</p>
                  <div className="card-actions justify-end">
                    <Link className="group link link-info link-hover text-lg"
                      href={noti.type === Notification_Type.RATE_CC_ ? '/router/cards/rateCC' :
                        noti.type === Notification_Type.RATE_CC_C ? '/router/cards/rateCC' :
                          noti.type === Notification_Type.RATE_CC_M_ ? '/router/cards/rateCC' :
                            noti.type === Notification_Type.RATE_M_ ? '/router/cards/rateM' :
                              noti.type === Notification_Type.NOTE_CC_ ? '/router/cards/noteCC' :
                                noti.type === Notification_Type.NOTE_APPEALS_ ? '/router/cards/noteCC' :
                                  noti.type === Notification_Type.TEST_ ? '/router/cards/tests' :
                                    Notification_Type.FEEDBACK_ ? '/router/cards/feedback' : ''}>
                      <button className="btn btn-neutral btn-xs" onClick={e => { preview(noti) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        Podgląd
                      </button>
                    </Link>
                  </div>
                </div>
                <hr className="w-full h-1 opacity-50 border-0 rounded bg-info"></hr>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}

export default NotificationComponent


