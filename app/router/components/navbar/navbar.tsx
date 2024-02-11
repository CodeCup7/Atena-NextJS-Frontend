
import Image from 'next/image'
import 'reflect-metadata';
import MainMenu from './mainmenu/mainmenu';
import Avatar from './avatar/page';
import NotificationComponent from './notification/notification';

const Navbar = () => {
    return (
        <div className="navbar bg-neutral-focus 2xl:border-x-8 2xl:border-neutral-focus">
            <div className="flex-1">
                <MainMenu></MainMenu>
            </div>
            <div className="flex-1">
                <Image className='items-center m-2' src="/icon.png" alt="Logo" width={80} height={80} />
            </div>
            <div className="flex-none">
                <NotificationComponent />
                <div className="dropdown dropdown-end">
                    <Avatar />
                </div>
            </div>
        </div>
    )
}

export default Navbar