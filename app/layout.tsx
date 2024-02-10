import './globals.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from './router/components/navbar/page'
import 'reflect-metadata';
import Avatar from './router/components/avatar/page';
import NotificationComponent from './router/components/notification/notification';

export const metadata: Metadata = {
  title: 'Atena',
  description: 'Centralny system monitorowania jakości',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en" data-theme="dark">
      <body className="dark ">
        <div className="flex flex-col items-center justify-center">
          <header className='flex flex-row bg-neutral-focus w-full max-w-screen-2xl'>
            <div className='basis-1/6 flex flex-row'>
              <Navbar></Navbar>
            </div>
            <div className="basis-4/6 text-white flex flex-row items-center justify-center">
              <Image className='items-center m-2' src="/icon.png" alt="Logo" width={100} height={100} priority />
              <h1 className='text-5xl text-atena-LightBlue ml-2'></h1>
            </div>
            {/* Avatar */}
            <div className="flex flex-row items-center justify-center">
              <NotificationComponent/>
            </div>
            <div className="flex flex-row items-center justify-center">
              <Avatar></Avatar>
            </div>
          </header>

          <main className='flex w-full '>
            {children}
          </main>

          <footer className="footer footer-center p-4 text-base-content bg-neutral-focus max-w-screen-2xl">
            <aside>
              <p>Copyright © 2023 - All right reserved</p>
            </aside>
          </footer>
        </div>
      </body>
    </html>
  )
}
