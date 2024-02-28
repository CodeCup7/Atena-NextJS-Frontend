'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api_queue_add, api_queue_update } from '@/app/api/queue_api'
import { Queue } from '@/app/classes/queue'
import { updateQueueList } from '@/app/factory/factory_queue'
import { IconAction, IconActivate, IconAdd, IconDeactivate } from '../../components/icons/icons';

const Queue_Page = () => {

  // ====== Hooks =========================================================
  const [queuelist, setQueueList] = useState<Array<Queue>>([]);
  const [newQueue, setNewQueue] = useState(new Queue());

  useEffect(() => {
    updateQueueTable();
  }, []);

  // ====== Funkcje ======================================================
  async function updateQueueTable() {
    try {
      const queues = await updateQueueList();
      setQueueList(queues);
    } catch (error) {
      console.error('Błąd pobierania kolejek:', error);
      toast.error('Błąd pobierania kolejek:', { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
    }
  }

  // ====== Akcje ====================================================== 
  async function addNewQueue() {

    if (newQueue.nameQueue !== '') {
      closeModal();
      api_queue_add(newQueue).then((foo => {
        if (foo.isOK === true) {
          toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
          updateQueueTable();
        } else {
          toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        }
      }));
    } else {
      toast.error('Nie podano nazwy kolejki', { position: toast.POSITION.TOP_RIGHT, theme: 'dark', });
    }
  }

  async function updateQueue(queue: Queue) {
    api_queue_update(queue).then((foo => {
      if (foo.isOK === true) {
        toast.info(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
        updateQueueTable();
      } else {
        toast.error(foo.callback, { position: toast.POSITION.TOP_RIGHT, theme: "dark" });
      }
    }));
  }

  // ====== Obsługa modala =========================================================
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  // ====== HTML =================================================================
  return (
    <div className='container mx-auto border-2 border-info border-opacity-50 p-2' >
      <ToastContainer />
      <button className="btn btn-outline btn-info btn-sm" onClick={openModal}>
        <IconAdd />
        Dodaj kolejkę
      </button>
      <div className='flex flex-row'>
        <div className="col-span-6">
          <table className="table table-pin-rows ">
            <thead>
              <tr >
                <th>Nazwa kolejki</th>
                <th>Czy aktywna</th>
                <th className='flex items-center justify-center'>
                  <IconAction />
                  <h1 className='ml-1'>Akcja</h1>
                </th>
              </tr>
            </thead>
            <tbody className="table-auto overflow-scroll" >
              {queuelist.map((queue) => {
                return (
                  <tr key={queue.id} className="hover:bg-base-300  hover:text-white cursor-pointer">
                    <td>{queue.nameQueue}</td>
                    <td>{queue.available ? 'Tak' : 'Nie'}</td>
                    <td className="dropdown w-max">
                      <label tabIndex={0} className="btn btn-sm">Akcja</label>
                      <ul tabIndex={0} className="dropdown dropdown-content z-[50] menu shadow bg-base-100 rounded-box border-2">
                        <li>
                          {queue.available ?
                            <button className='btn btn-info btn-sm hover:btn-warning m-1 items-center justify-center h-10'
                              onClick={() => {
                                queue.available = false;
                                updateQueue(queue);
                              }}>
                              <IconDeactivate />
                              &nbsp;&nbsp;<p>Dezaktwuj</p>
                            </button>
                            :
                            <button className='btn btn-info btn-sm hover:btn-success m-1 items-center justify-center h-10'
                              onClick={() => {
                                queue.available = true;
                                updateQueue(queue);
                              }}>
                              <IconActivate />
                              &nbsp;&nbsp;<p>Aktywuj</p>
                            </button>
                          }
                        </li>
                      </ul>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Nazwa</th>
                <th>Czy Aktywny</th>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* MODAL */}
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box">
            <div className="flex flex-col items-center justify-center ml-10">
              <span className='text-info'>Dodaj nową kolejkę</span>
              <hr className="w-full h-1 opacity-50 border-0 rounded bg-info mt-1"></hr>

              <div className='flex flex-col mx-6 mb-6'>
                <label className="form-control w-full max-w-xs mt-2">
                  <div className="label">
                    <span className={`label-text ${newQueue.nameQueue != '' ? '' : 'hidden'}`}>Nazwa nowej kolejki</span>
                  </div>
                  <input
                    className="input input-bordered input-info max-w-md gap-y-2 w-72"
                    value={newQueue.nameQueue}
                    type="text"
                    placeholder="Nazwa nowej kolejki"
                    onChange={e => {
                      setNewQueue({ ...newQueue, nameQueue: e.target.value, available: true })
                    }} />
                </label>
                <button
                  onClick={addNewQueue}
                  className='btn btn-outline btn-info mt-5'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Dodaj
                </button>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                Zamknij
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>

  )
}

export default Queue_Page
