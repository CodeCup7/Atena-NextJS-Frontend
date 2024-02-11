import './globals.css'
import type { Metadata } from 'next'
import 'reflect-metadata';
import Navbar from './router/components/navbar/navbar';

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
            <div className='w-full'>
              <Navbar/>
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
