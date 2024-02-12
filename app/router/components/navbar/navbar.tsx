
import Image from 'next/image'
import 'reflect-metadata';
import MainMenu from './mainmenu/mainmenu';
import Avatar from './avatar/page';
import NotificationComponent from './notification/notification';

const Navbar = () => {
    return (
        <div className="navbar bg-neutral-focus 2xl:border-x-8 2xl:border-neutral-focus justify-between h-28">
            <div className="order-1">
                <MainMenu></MainMenu>
            </div>
            <div className="order-2 ">
                <Image className='items-center ml-44' src="/a.png" alt="Logo" width={100} height={100} />
            </div>
            <div className="order-3">
                <NotificationComponent />
                <div className="dropdown dropdown-end">
                    <Avatar />
                </div>
            </div>
        </div>
    )
}

export default Navbar