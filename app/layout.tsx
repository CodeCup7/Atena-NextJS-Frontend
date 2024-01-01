import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Navbar from './router/components/navbar/page'
import 'reflect-metadata';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AtenaWEB',
  description: 'Generated by create next app',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <html lang="en" data-theme="dark">
      <body className="dark">
        <div className="flex flex-col items-center ">
          <header className='flex flex-row bg-neutral-focus w-full max-w-screen-2xl'>
            <div className='basis-1/6 flex flex-row'>
              <Navbar></Navbar>
            </div>
            <div className="basis-4/6 text-white flex flex-row items-center justify-center">
              <Image className='items-center' src="/logo.png" alt="Logo" width={120} height={120} priority />
              <h1 className='text-4xl text-info ml-2'>Atena</h1>
            </div>
          </header>

          <main className='flex w-full'>
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