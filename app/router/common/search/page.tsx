'use client'
import { getActiveUser } from '@/app/auth';
import { Role, User } from '@/app/classes/user';
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
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [selectedUser, setUser] = useState(new User());



  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [agent, setAgent] = useState(0);

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

              <div className='flex sm:flex-col md:flex-row items-center justify-center '>

                <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2'>
                  <h1 className='text-info text-lg text-center ml-3'> Dotyczy miesiąca</h1>
                  <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                  <div className='flex mt-2'>
                    <div className="flex flex-col m-2">
                      <span className="label-text">Data od:</span>
                      <input
                        className="input input-bordered w-full max-w-xs"
                        value={dateStart}
                        onChange={e => { setDateStart(e.currentTarget.value) }}
                        type="month"
                        placeholder="Type here"
                      />
                    </div>
                    <div className="flex flex-col mr-2 ml-4 m-2">
                      <span className="label-text">Data do:</span>
                      <input
                        className="input input-bordered w-full max-w-xs"
                        value={dateEnd}
                        onChange={e => { setDateEnd(e.currentTarget.value) }}
                        type="month"
                        placeholder="Type here"
                      />
                    </div>
                  </div>
                </div>

                <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2'>
                  <h1 className='text-info text-lg text-center ml-3'>Data przeprowadzenia</h1>
                  <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                  <div className='flex mt-2'>
                    <div className="flex flex-col m-2">
                      <span className="label-text">Data od:</span>
                      <input
                        className="input input-bordered w-full max-w-xs"
                        value={dateStart}
                        onChange={e => { setDateStart(e.currentTarget.value) }}
                        type="date"
                        placeholder="Type here"
                      />
                    </div>
                    <div className="flex flex-col mr-2 ml-4 m-2">
                      <span className="label-text">Data do:</span>
                      <input
                        className="input input-bordered w-full max-w-xs"
                        value={dateEnd}
                        onChange={e => { setDateEnd(e.currentTarget.value) }}
                        type="date"
                        placeholder="Type here"
                      />
                    </div>
                  </div>
                </div>


                <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2'>

                  <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2'>

                    <h1 className='text-info text-lg text-center ml-3'>Zalecenia (fraza)</h1>
                    <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                    <input
                      className="input input-bordered input-info max-w-md gap-y-2 w-72 m-2"
                      type="text" />
                  </div>


                  <div className='flex flex-col border-2 border-info border-opacity-50 mt-2 justify-center items-center m-2'>

                    <h1 className='text-info text-lg text-center ml-3'>Zalecenia (fraza)</h1>
                    <hr className="w-48 h-1 opacity-50 border-0 rounded bg-info m-2"></hr>

                    <input
                      className="input input-bordered input-info max-w-md gap-y-2 w-72 m-2"
                      type="text" />
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
      </div>
    </div>
  )
}
export default Search;