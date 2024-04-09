'use client'
import Image from 'next/image'
import { getActiveUser } from './auth'
import { useEffect, useState } from 'react';
import { User } from './classes/user';

export default function Home() {

  const [activeUser, setActiveUser] = useState(new User());

  useEffect(() => {
    const fetchData = async () => {
      const user = await getActiveUser();
      setActiveUser(user);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto w-full items-center justify-center 2xl:border-x-8 2xl:border-neutral-focus">

      <div className="flex flex-row items-center justify-center m-10">
        <Image className='items-center' src={'/logo.png'} alt="Logo" width={600} height={600} priority />
      </div>
      {activeUser.id === 0 && (
        <h1 className='text-center text-2xl text-error'>Brak dostępu do bazy danych - sprawdź połączenie</h1>
      )}
      <h1 className="text-center text-2xl text-info m-10">Centralny system monitorowania jakości</h1>
    </div>
  )
}
// ================= Losowa zmiana obrazka ============================

// const images = useMemo(() => ['/logo.png', '/logo.png'], []);
// const [currentIndex, setIndex] = useState(0);

// useEffect(() => {
//   const intervalId = setInterval(() => {
//     const newIndex = Math.floor(Math.random() * images.length);
//     setIndex(newIndex);
//   }, 1000);
// return () => clearInterval(intervalId); // Wyczyszczenie interwału po odmontowaniu komponentu
// }, [currentIndex, images]);

// <Image className='items-center' src={images[currentIndex]} alt="Logo" width={600} height={600} priority />
