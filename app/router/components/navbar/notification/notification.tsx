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
import { IconClose, IconInfo, IconNotificationOFF, IconNotificationON, IconPreview } from '../../icons/icons';

const NotificationComponent = ({ activeUser }: { activeUser: User }) => {

  const [notiList, setNotiList] = useState<Array<Notification>>([]); // Lista powiadomień
  //const [activeUser, setActiveUser] = useState(new User());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      //const user = await getActiveUser();
      //setActiveUser(user);

      const list = await api_NotificationList_getAll(activeUser);
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
            <IconNotificationOFF size={8} className='text-neutral-content' />
            :
            <IconNotificationON size={8} className='text-info' />
          }
          <span className="badge badge-sm indicator-item">{notiList.length}</span>
        </div>
      </div>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <div className="card-body">
          {notiList.length === 0 ? (
            <div role="alert" className="alert">
              <IconInfo />
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
                        <IconClose />
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
                        <IconPreview />
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


