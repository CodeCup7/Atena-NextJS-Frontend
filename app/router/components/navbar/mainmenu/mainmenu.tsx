'use client'
import { getActiveUser } from '@/app/auth';
import { Rate_Mode, Type_RateCC } from '@/app/classes/enums';
import { Role, User } from '@/app/classes/user';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { IconAdmin, IconBrowser, IconCurrent, IconDashboard, IconFeedbackUp, IconHomePage, IconMystery, IconNoteMain, IconRateCC, IconRateM, IconSearch, IconTest} from '../../icons/icons';

export const MainMenu = ({ activeUser }: { activeUser: User }) => {

    interface Foo {
        button: boolean;
        image: boolean;
        pernament: boolean;
    }

    //const [activeUser, setActiveUser] = useState(new User());
    const [menuHidden, setMenuHiden] = useState(false);
    const isPermit: boolean = activeUser.role === Role.ADMIN_ || activeUser.role === Role.COACH_;

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             //const user = await getActiveUser();
    //             //setActiveUser(user);
    //             // const isPermit: boolean = activeUser.role === Role.ADMIN_ || activeUser.role === Role.COACH_;
    //             // setIsPermit(isPermit);
    //         } catch (error) {
    //             console.log('Błąd useEffect', error);
    //         }
    //     }
    //     fetchData();
    // }, []);


    function disabledLink(foo: Foo) {

        if (foo.button) {
            if (!isPermit && !foo.pernament) {
                return 'group link link-neutral text-lg pointer-events-none opacity-80'
            }
            return 'group link link-info link-hover text-lg'
        } else if (foo.image) {
            if (!isPermit && !foo.pernament) {
                return 'w-6 h-6 stroke-neutral'
            }
            return 'w-6 h-6 stroke-info group-hover:stroke-blue-50'
        }
        return ''
    }


    return (

        <div className="navbar flex flex-1 w-full">
            <div className="dropdown dropdown-bottoms">
                <button tabIndex={0} className="btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                    disabled={activeUser.id === 0}
                    onClick={() => setMenuHiden(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </button>
                <ul tabIndex={0} className={`${menuHidden ? 'hidden' : ''} menu menu-md dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-lg flex flex-row border border-info`}>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: true })} href="/router/cards/poligon">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={disabledLink({ button: false, image: true, pernament: true })}>
                                        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <span className="ml-2">Poligon</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: true })} href="/">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconHomePage/>
                                    <span className="ml-2">Strona główna</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: true })} href="/router/common/browser">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconBrowser />
                                    <span className="ml-2">Przeglądarka</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: true })} href="/router/common/dashboard">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconDashboard />
                                    <span className="ml-2">Dashboard</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: true })} href="/router/common/search">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconSearch />
                                    <span className="ml-2">Wyszukaj</span>
                                </div>
                            </button>
                        </Link>

                    </li>
                    <hr className="w-48 h-1 mx-auto border-0 rounded bg-gray-700"></hr>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })} href="/router/cards/noteMain" >
                            <button className="group" onClick={() => setMenuHiden(true)} >
                                <div className="flex items-center">
                                    <IconNoteMain />
                                    <span className="ml-2">Monitoring</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })}
                            href={{
                                pathname: "/router/cards/rateCC",
                                query: { type: Type_RateCC.RATTING_ }
                            }}>
                            <button className="group" onClick={() => {
                                localStorage.removeItem('rateCC_prev');
                                setMenuHiden(true)
                            }}>
                                <div className="flex items-center">
                                    <IconRateCC />
                                    <span className="ml-2">Karta rozmowy</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })} href="/router/cards/rateM">
                            <button className="group" onClick={() => {
                                localStorage.removeItem('rateM_prev');
                                setMenuHiden(true)
                            }}>
                                <div className="flex items-center">
                                    <IconRateM />
                                    <span className="ml-2">Karta mail</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })}
                            href={{
                                pathname: "/router/cards/rateCC",
                                query: { type: Type_RateCC.MYSTERY_ }
                            }}>
                            <button className="group" onClick={() => setMenuHiden(true)}>

                                <div className="flex items-center">
                                    <IconMystery />
                                    <span className="ml-2">Tajemniczy klient</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })}
                            href={{
                                pathname: "/router/cards/rateCC",
                                query: { type: Type_RateCC.CURRENT_ }
                            }}>
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconCurrent />                                    <span className="ml-2">Bieżący odsłuch</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })} href="/router/cards/tests">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconTest />
                                    <span className="ml-2">Testy</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })} href="/router/cards/feedback">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconFeedbackUp />
                                    <span className="ml-2">Pochwały i skargi</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                    <hr className="w-48 h-1 mx-auto border-0 rounded bg-gray-700"></hr>
                    <li>
                        <Link className={disabledLink({ button: true, image: false, pernament: false })} href="/router/admin">
                            <button className="group" onClick={() => setMenuHiden(true)}>
                                <div className="flex items-center">
                                    <IconAdmin />
                                    <span className="ml-2">Administracja</span>
                                </div>
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>
        </div >
    )
}

export default MainMenu
