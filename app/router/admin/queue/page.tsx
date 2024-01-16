'use client'
import { User } from '@/app/classes/user'
import React, { useEffect, useState } from 'react'
import { updateUserList } from '@/app/factory/factory_user'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmDialog from '../../components/dialog/ConfirmDialog'
import { api_User_delete } from '@/app/api/user_api'
import { api_QueueList_getAll, api_Queue_add, api_Queue_update } from '@/app/api/queue_api'
import { Queue } from '@/app/classes/queue'
import { updateQueueList } from '@/app/factory/factory_queue'

const Queue_Page = () => {

  const [queuelist, setQueueList] = useState<Array<Queue>>([]);
  const [newQueue, setNewQueue] = useState(new Queue());

  useEffect(() => {
    updateQueueTable();
  }, []);


  async function updateQueueTable() {
    try {
      const queues = await updateQueueList();
      setQueueList(queues);
    } catch (error) {
      console.error('Błąd pobierania kolejek:', error);
    }
  }

  async function addNewQueue() {
    try {
      if (newQueue.nameQueue !== '') {
        const foo = await api_Queue_add(newQueue);
        if (foo.isOK) {
          toast.info(foo.callback, {
            position: toast.POSITION.TOP_RIGHT,
            theme: 'dark',
          });
        } else {
          toast.error(foo.callback, {
            position: toast.POSITION.TOP_RIGHT,
            theme: 'dark',
          });
        }
      } else {
        toast.error('Nie podano nazwy kolejki', {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error('Błąd dodawania kolejki:', error);
    } finally {
      updateQueueTable();
    }
  }

  async function updateQueue(queue: Queue) {
    try {
      const foo = await api_Queue_update(queue);
      if (foo.isOK) {
        toast.info(foo.callback, {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark',
        });
      } else {
        toast.error(foo.callback, {
          position: toast.POSITION.TOP_RIGHT,
          theme: 'dark',
        });
      }

    } catch (error) {
      console.error('Błąd dodawania kolejki:', error);
    } finally {
      updateQueueTable();
    }
  }

  return (

    <div className='flex flex-row'>
      <ToastContainer />
      <div className="col-span-6">
        <table className="table table-pin-rows ">
          {/* head */}
          <thead>
            <tr >
              <th>Nazwa kolejki</th>
              <th>Czy aktywna</th>
              <th className='flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                <h1 className='ml-1'>Akcja</h1>
              </th>
            </tr>
          </thead>
          <tbody className="table-auto overflow-scroll" >
            {queuelist.map((queue, index) => {
              return (
                <tr key={index} className="hover:bg-base-300  hover:text-white cursor-pointer">
                  <td>{queue.nameQueue}</td>
                  <td>{queue.available ? 'Tak' : 'Nie'}</td>
                  <td className="dropdown w-max">
                    <label tabIndex={0} className="btn btn-sm">Akcja</label>
                    <ul tabIndex={0} className="dropdown dropdown-content z-[50] menu shadow bg-base-100 rounded-box border-2">
                      <li>
                        {queue.available ?
                          <button className='btn btn-info btn-sm hover:btn-success m-1 items-center justify-center h-10'
                            onClick={() => {
                              queue.available = false;
                              updateQueue(queue);
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            &nbsp;&nbsp;<p>Dezaktwuj</p>
                          </button>
                          :
                          <button className='btn btn-info btn-sm hover:btn-success m-1 items-center justify-center h-10'
                            onClick={() => {
                              queue.available = true;
                              updateQueue(queue);
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
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
          {/* foot */}
          <tfoot>
            <tr>
              <th>Nazwa</th>
              <th>Czy Aktywny</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className='col-span-6 mt-4 ml-32 border-2 border-info border-opacity-50 items-center justify-center'>

        <h1 className='text-center text-info text-xl m-5'>Sekcja dodawania kolejek</h1>

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
                setNewQueue({ ...newQueue, nameQueue: e.target.value, available: false })
              }} />
          </label>
          <button
            onClick={addNewQueue}
            className='btn btn-info hover:btn-primary mt-5'>
            Dodaj
          </button>
        </div>
      </div>
    </div>


  )
}

export default Queue_Page