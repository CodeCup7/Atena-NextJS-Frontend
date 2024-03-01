'use client'
import Image from 'next/image'
import 'reflect-metadata';
import MainMenu from './mainmenu/mainmenu';
import Avatar from './avatar/page';
import NotificationComponent from './notification/notification';
import { getActiveUser } from '@/app/auth';
import { User } from '@/app/classes/user';
import { useState, useEffect } from 'react';

const Navbar = () => {

    const [activeUser, setActiveUser] = useState(new User());
    
    useEffect(() => {
        const fetchData = async () => {
            const user = await getActiveUser();
            setActiveUser(user);
        };
        fetchData();
    }, []);

    return (
        <div className="navbar bg-neutral-focus 2xl:border-x-8 2xl:border-neutral-focus justify-between h-28">
            <div className="order-1">
            {activeUser.id !== 0 && <MainMenu activeUser={activeUser} />}
            </div>
            <div className="order-2 ">
                <Image className='items-center ml-44' src="/a.png" alt="Logo" width={100} height={100} />
            </div>
            <div className="order-3">
            {activeUser.id !== 0 && <NotificationComponent activeUser={activeUser} />} {/* Renderuj tylko jeśli activeUser jest dostępny */}
                <div className="dropdown dropdown-end">
                {activeUser.id !== 0 && <Avatar activeUser={activeUser} />}
                </div>
            </div>
        </div>
    )
}

export default Navbar