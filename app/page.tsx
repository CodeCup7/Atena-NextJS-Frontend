'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image'

export default function Home() {

  const images = useMemo(() => ['/sleep.png', '/wakeup.png'], []);
  const [currentIndex, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newIndex = Math.floor(Math.random() * images.length);
      setIndex(newIndex);
    }, 1000);

    return () => clearInterval(intervalId); // Wyczyszczenie interwału po odmontowaniu komponentu
  }, [currentIndex, images]);

  return (
    <div className="container mx-auto w-full items-center justify-center border-2">

      <div className="flex flex-row items-center justify-center m-10">
        <Image className='items-center' src={images[currentIndex]} alt="Logo" width={400} height={400} priority />
      </div>

      <h1 className="text-center text-2xl text-info m-10">Centralny system monitorowania jakości</h1>
    </div>
  )
}



